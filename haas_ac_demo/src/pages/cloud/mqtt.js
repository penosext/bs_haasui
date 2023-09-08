import { mqtt, mqttcli } from "mqtt"
import conf from "../conf/conf"
import { DEFINE } from "../../utils/define"
import { event_update_link, event_show_active } from "../../utils/event"
import { gate_handler } from "./gate"
import { isString, isNumber, isObject } from "../../utils/util"
import storage from "storage"
import md5 from "js-md5"
import misc from "../misc/misc"
import web from "./web"

class Mqtt {
  isInit = false
  cli = null
  normalType = false
  conf = {
    host: "",
    port: 0,
    client_id: "",
    user: "",
    pass: "",
    pub: "",
    sub: "",
    devid: "",
    isActived: false, // 是否是激活状态，normal状态下才用到，激活状态则使用记录的主题等
  }
  activate = 10
  heartbeat = 10
  outgoing_reqs = {}
  reqid = 0
  reconnect_timer = 0
  last_request = 0
  last_ping = 0
  last_pong = 0

  constructor() {
    //cfg有一个default.json作为默认值，
    this.isInit = false
  }

  //初始化系统mqtt
  mqttInit() {
    if (this.isInit) {
      return
    }
    mqtt
      .init()
      .then((res) => {
        this.isInit = true
        console.log("init mqtt success")
      })
      .catch((err) => {
        //初始化mqtt失败
        this.isInit = false
        console.log("init mqtt fail")
      })
  }

  async mqttCreate() {
    if (!this.isInit) {
      return
    }
    let cf = {}
    cf.host = await conf.cfgGet(DEFINE.configCloud.mqttHost)

    cf.devid = await conf.cfgDeviceId()
    cf.port = await conf.cfgGetInt(DEFINE.configCloud.mqttPort)
    cf.client_id = await conf.cfgGet(DEFINE.configCloud.mqttClientId)
    if (!cf.client_id) {
      cf.client_id = cf.devid
    }
    cf.user = await conf.cfgGet(DEFINE.configCloud.mqttUser)
    if (!cf.user) {
      cf.user = cf.devid
    }

    cf.pass = await conf.cfgGet(DEFINE.configCloud.mqttPasswd)
    if (!cf.pass) {
      cf.pass = md5(md5.arrayBuffer(cf.devid).slice(0, 8))
    }
    //结尾的自动加设备id
    cf.pub = await conf.cfgGet(DEFINE.configCloud.mqttTopicPub)
    if (isString(cf.pub) && cf.pub.substring(cf.pub.length - 1) === "/") {
      cf.pub = cf.pub + cf.devid
    }
    cf.sub = await conf.cfgGet(DEFINE.configCloud.mqttTopicSub)
    if (isString(cf.sub) && cf.sub.substring(cf.sub.length - 1) === "/") {
      cf.sub = cf.sub + cf.devid
    }

    this.conf = cf
    console.log(JSON.stringify(cf))
    this.state = DEFINE.ui.STATE_INIT
    this.setup_connect()
  }

  //设置连接参数和监听
  setup_connect() {
    this.cli = new mqttcli()
    if (this.cli == null) {
      log.warning("mqtt.setup_connect -> create mqtt client fail")
      return false
    }

    this.cli.on("connect", (res) => {
      this.state = DEFINE.ui.STATE_CONN
      event_update_link(DEFINE.ui.STATE_CONN)
      console.log("onconnect")
      this.cli.do_subcribe({ topic: this.conf.sub, qos: 0 })
    })
    this.cli.on("disconnect", (res) => {
      console.log("disconnect")
      this.state = DEFINE.ui.STATE_DISCON
      event_update_link(DEFINE.ui.STATE_DISCON)
      if (this.timer_check) {
        clearInterval(this.timer_check)
        this.timer_check = 0
      }
    })
    this.cli.on("publish", (res) => {
      console.log("publish")
    })
    this.cli.on("subscribe", (res) => {
      console.log("subscribe")
      this.state = DEFINE.ui.STATE_SUBSCRIBE
      event_update_link(DEFINE.ui.STATE_SUBSCRIBE)
      // 正式使用流程
      this.req_sync_time()

      if (this.timer_check) {
        clearInterval(this.timer_check)
        this.timer_check = 0
      }

      this.timer_check = setInterval(() => {
        this.update()
      }, 1000)
    })
    this.cli.on("unsubscribe", (res) => {
      console.log("unsubscribe")
    })
    this.cli.on("message", async (res) => {
      console.log("onmessage: from:" + res.topic)
      this.onmessage(res.topic, res.payload)
    })

    this.cli
      .init({
        cid: this.conf.client_id,
        username: this.conf.user,
        passwd: this.conf.pass,
        debug: 1,
      })
      .then((res) => {
        this.mqtt_connect()
      })
      .catch((err) => {
        console.log("cli init err", err)
      })
  }
  //mqtt连接，连接失败则定时重连，连接成功后自动重连
  mqtt_connect() {
    // console.log(JSON.stringify(this.conf))
    if (this.timer_check) {
      clearInterval(this.timer_check)
    }
    if (this.reconnect_timer) {
      clearTimeout(this.reconnect_timer)
    }
    this.last_ping = misc.getSystemRunTime()
    this.last_pong = misc.getSystemRunTime()
    this.cli
      .do_connect({
        host: this.conf.host,
        port: this.conf.port,
        keepalive: 10,
      })
      .then((res) => {
        //连接完成
        console.log("do_connect success")
      })
      .catch((err) => {
        console.log("connect err", err)
        this.reconnect_timer = setTimeout(() => {
          this.mqtt_connect()
        }, 5000)
      })
  }

  async update() {
    //是否需要自己判断断线，按说是不需要
    if (this.state > DEFINE.ui.STATE_CONN) {
      let now = misc.getSystemRunTime()
      // console.log("now:" + now + "  last:" + this.last_ping)
      if (now - this.last_ping > this.heartbeat) {
        if (this.state != DEFINE.ui.STATE_ACTION) {
          console.log("no rsp sync-time 10s")
          this.last_ping = misc.getSystemRunTime()
          this.req_sync_time()
        } else {
          this.req_ping()
        }
      }
      if (now - this.last_pong > this.heartbeat * 3) {
        console.log("to long not respone heartbeat, close")
        try {
          let rc = await this.cli.do_disconnect()
        } catch (error) {}
        this.mqtt_connect()
      }
    }
  }
  next_reqid() {
    this.reqid = this.reqid + 1
    return this.reqid + ""
  }
  //发送固定格式的msg
  send(msg, reqid, rsp) {
    this.last_request = misc.getSystemRunTime()
    if (reqid && rsp) {
      this.outgoing_reqs[reqid] = {
        cbs: rsp,
      }
    }
    if (msg.header) {
      msg.header.devid = this.conf.devid
    } else {
      msg.header = { devid: this.conf.devid }
    }
    // console.log(
    //   "publish topic:" + this.conf.pub + ",payload:" + JSON.stringify(msg)
    // )
    this.cli.do_publish({ topic: this.conf.pub, payload: JSON.stringify(msg) })
  }
  handler(msg) {
    let req = this.outgoing_reqs[msg.header.reqid]
    this.outgoing_reqs[msg.header.reqid] = null
    if (req && req.cbs) {
      req.cbs(this, msg)
    }
    return true
  }
  async onmessage(topic, payload) {
    this.last_pong = misc.getSystemRunTime()

    if (isString(payload)) {
      payload = payload.replaceAll("\r\n", "")
      // console.log(JSON.stringify(newdata))
    } else {
      this.send({
        retcode: DEFINE.error.INVALID,
        tips: "payload not string",
      })
      return false
    }

    let msg = JSON.parse(payload)
    if (!msg) {
      console.log("onmessage -> decode payload fai")
      return false
    }

    // response from platform
    if (isNumber(msg.retcode) && isObject(msg.header)) {
      console.log("response from platform")
      this.handler(msg)
      return true
    }
    // request from platform
    if (msg.action && msg.header) {
      console.log("request from platform")
      if (
        this.state !== DEFINE.ui.STATE_ACTION &&
        msg.action !== "info" &&
        msg.action !== "device-info"
      ) {
        this.send({
          retcode: DEFINE.error.NOTREGIST,
          tips: DEFINE.error.NOTREGIST_TIPS,
        })
        return false
      }

      this.last_ping = misc.getSystemRunTime()
      let rsp = await gate_handler(msg)
      // console.log("mqtt rsp:" + JSON.stringify(rsp))
      if (!rsp) {
        return false
      }

      this.send(rsp)
      return true
    }

    this.send({
      retcode: DEFINE.error.INVALID,
      tips: DEFINE.error.INVALID_TIPS,
    })
  }
  rsp_ping() {
    console.log("rsp_ping")
    this.last_pong = misc.getSystemRunTime()
  }
  req_ping() {
    const req = {}
    req.action = "ping"
    req.header = {}
    req.header.reqid = this.next_reqid()

    this.last_ping = misc.getSystemRunTime()

    console.log("req_ping -> ...")
    return this.send(req, req.header.reqid, this.rsp_ping)
  }
  //同步时间的回调，同步时间完成之后就当正式可以用了
  rsp_sync_time(_this, rsp) {
    console.log("rsp_sync_time:" + JSON.stringify(rsp))
    if (isObject(rsp) && rsp.retcode === 0) {
      if (isObject(rsp.body) && isNumber(rsp.body.timestamp)) {
        // 设置时间
        misc.setUtc(rsp.body.timestamp)
        _this.last_pong = misc.getSystemRunTime()
        //非bashi模式，这样就是正常使用了
        _this.state = DEFINE.ui.STATE_ACTION
        event_update_link(DEFINE.ui.STATE_ACTION)
        event_show_active(false)
      } else {
        //数据不对
      }
    } else {
      // 同步时间出错
    }
  }
  req_sync_time() {
    const req = { action: "sync-time", header: { reqid: this.next_reqid() } }
    console.log("req_sync_time -> " + JSON.stringify(req))
    return this.send(req, req.header.reqid, this.rsp_sync_time)
  }

  async event_post(event) {
    const evreq = {}
    evreq.action = "event-report"
    evreq.header = {}
    evreq.header.reqid = this.next_reqid()
    evreq.body = event
    evreq.body["device-id"] = await conf.cfgDeviceId()
    console.log("mqt.event_post ")
    conf.cfgGet(DEFINE.configCloud.manageMode).then((res) => {
      if (res === "mqtt") {
        if (!this.isInit) {
          console.log("mqt.event_post -> not init ")
          return
        }

        if (this.state == DEFINE.ui.STATE_ACTION && this.cli != null) {
          console.log("mqt.event_post -> " + JSON.stringify(event))
          this.send(evreq)
          return true
        }
        console.log("mqt.event_post -> not action")
        return false
      } else if (res === "none") {
        conf.cfgGet(DEFINE.configCloud.reportServer).then((res) => {
          if (isString(res)) {
            console.log("web.event_post -> ")
            web.common_post(res, JSON.stringify(evreq))
          }
        })
      }
    })
  }

  feature_post(feature, userid) {
    const evreq = {}
    evreq.action = "user-gen-upload"
    evreq.header = {}
    evreq.header.reqid = this.next_reqid()
    evreq.body = {
      userid: userid,
      face: {
        feature: feature,
        vendor: conf.cfgFdrVendor(),
        version: conf.cfgFdrVersion(),
      },
    }
    if (!feature) {
      evreq.retcode = -1
      evreq.body.face = {}
    }
    console.log("mqt.feature_post -> ")
    conf.cfgGet(DEFINE.configCloud.manageMode).then((res) => {
      if (res === "mqtt") {
        if (!this.isInit) {
          return
        }

        if (this.state == DEFINE.ui.STATE_ACTION && this.cli != null) {
          this.send(evreq)
          return true
        }
        return false
      } else if (res === "none") {
        conf.cfgGet(DEFINE.configCloud.reportServer).then((res) => {
          if (isString(res)) {
            console.log("web.feature_post -> ")
            web.common_post(res, JSON.stringify(evreq))
          }
        })
      }
    })
  }
}
export default new Mqtt()
