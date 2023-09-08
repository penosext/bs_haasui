import { isString, isNumber, isObject } from "../../utils/util"
import { DEFINE } from "../../utils/define"
import dbUser from "./db_user"
// import dbLog from "./db_log"
// import fs from "fs"
import misc from "../misc/misc"
import conf from "../conf/conf"
// import netmanager from "../netmanager/netmanager"
// import bashiFace from "../face/face"
// import mqtt from "./mqtt"
// import mpp from "../mpp/mpp"

class AdpMisc {
  savedTokens = []
  constructor() {}

  async auth_login(req) {
    console.log("adpmisc.auth_login -> ")

    if (
      !isObject(req.body) ||
      !isString(req.body.user) ||
      !isString(req.body.passwd)
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    let admin = await dbUser.admin_lookup(req.body.user)
    if (admin) {
      if (admin.passwd === req.body.passwd) {
        const token = misc.createNewToken()
        this.savedTokens.push(token)
        return {
          retcode: DEFINE.error.OK,
          body: {
            token: token.token,
            timestamp: token.timestamp,
          },
        }
      } else
        return {
          retcode: DEFINE.error.NOEXIST,
          tips: DEFINE.error.NOEXIST_TIPS,
        }
    } else
      return {
        retcode: DEFINE.error.DBOPS,
        tips: DEFINE.error.DBOPS_TIPS,
      }
  }

  async auth_passwd(req) {
    console.log("adpmisc.auth_passwd -> ")

    if (
      !isObject(req.body) ||
      !isString(req.body.user) ||
      !isString(req.body.passwd)
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    if (await dbUser.admin_insert(req.body.user, req.body.passwd)) {
      return {
        retcode: DEFINE.error.OK,
      }
    } else {
      return {
        retcode: DEFINE.error.DBOPS,
        tips: DEFINE.error.DBOPS_TIPS,
      }
    }
  }

  async check_token(token) {
    console.log("adpmisc.check_token -> ")

    let find = false
    if (!token) {
      console.log("adpmisc.check_token -> token not exist")
      return false
    }

    this.savedTokens.forEach((item, index) => {
      if (item.timestamp + 60 * 60 < misc.getSystemRunTime()) {
        // 1 hour
        this.savedTokens.splice(index, 1)
      } else if (item.token == token) {
        item.timestamp = misc.getSystemRunTime() // update token timestamp
        find = true
      }
    })

    return find
  }

  async conf_fetch(req) {
    console.log("adpmisc.conf_fetch -> ")

    const rsp = {
      retcode: DEFINE.error.OK,
      body: {
        configs: (await conf.cfgAllItems()).items,
      },
    }

    return rsp
  }

  async conf_set(req) {
    console.log("adpmisc.conf_set -> ")

    if (!isObject(req.body) || !Array.isArray(req.body.configs)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    const rsp = {
      retcode: DEFINE.error.OK,
      body: {
        configs: [],
      },
    }

    for (let index = 0; index < req.body.configs.length; index++) {
      const item = req.body.configs[index]
      if (!isObject(item) || !isString(item.key) || !isString(item.value)) {
        rsp.body.configs.push({
          key: item.key,
          retcode: DEFINE.error.DBOPS,
        })
        rsp.retcode = DEFINE.error.DBOPS
      } else {
        conf.cfgSet(item.key, item.value)
        rsp.body.configs.push({
          key: item.key,
          retcode: 0,
        })
      }
    }

    conf.cfgApply()

    return rsp
  }

  conf_mqtt(req) {
    console.log("adpmisc.conf_mqtt -> ")

    if (
      !isObject(req.body) ||
      !isString(req.body.host) ||
      req.body.host == "" ||
      !isNumber(req.body.port) ||
      req.body.port < 0 ||
      req.body.port > 655354
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    const rsp = {
      retcode: DEFINE.error.OK,
      body: {},
    }

    conf.cfgSet(DEFINE.configCloud.mqttHost, req.body.host)

    conf.cfgSet(DEFINE.configCloud.mqttPort, "" + req.body.port)

    if (isString(req.body.client_id)) {
      conf.cfgSet(DEFINE.configCloud.mqttClientId, req.body.client_id)
    }

    if (isString(req.body.user)) {
      conf.cfgSet(DEFINE.configCloud.mqttUser, req.body.user)
    }

    if (isString(req.body.passwd)) {
      conf.cfgSet(DEFINE.configCloud.mqttPasswd, req.body.passwd)
    }

    if (isString(req.body.topic_pub)) {
      conf.cfgSet(DEFINE.configCloud.mqttTopicPub, req.body.topic_pub)
    }

    if (isString(req.body.topic_sub)) {
      conf.cfgSet(DEFINE.configCloud.mqttTopicSub, req.body.topic_sub)
    }

    return rsp
  }

  async conf_mqtt_get(req) {
    console.log("adpmisc.conf_mqtt_get -> ")

    const rsp = {
      retcode: DEFINE.error.OK,
      body: {
        host: "",
        port: 0,
        client_id: "",
        user: "",
        passwd: "",
        topic_pub: "",
        topic_sub: "",
      },
    }

    rsp.body.host = await conf.cfgGet(DEFINE.configCloud.mqttHost)
    rsp.body.port = await conf.cfgGetInt(DEFINE.configCloud.mqttPort)

    rsp.body.client_id = await conf.cfgGet(DEFINE.configCloud.mqttClientId)
    rsp.body.user = await conf.cfgGet(DEFINE.configCloud.mqttUser)
    rsp.body.passwd = await conf.cfgGet(DEFINE.configCloud.mqttPasswd)
    rsp.body.topic_pub = await conf.cfgGet(DEFINE.configCloud.mqttTopicPub)
    rsp.body.topic_sub = await conf.cfgGet(DEFINE.configCloud.mqttTopicSub)

    return rsp
  }

  //end
}
export default new AdpMisc()
