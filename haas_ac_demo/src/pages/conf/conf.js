import storage from "storage"
import fs from "fs"
import { isString, isNumber, isObject, formatDate } from "../../utils/util"
import { DEFINE } from "../../utils/define"
import { DefaultJson } from "../../utils/default"
import packageJson from "../../../package.json"
import misc from "../misc/misc"
import mpp from "../mpp/mpp"
import netmanager from "../netmanager/netmanager"
import face from "../face/face"

//初始化读取配置，初始化读取设备id
class Conf {
  isInit = false //是否初始化过了
  devid = ""
  storeConf = {} //保存配置用来查询
  appPath = ""

  constructor() {
    //cfg有一个default.json作为默认值，
    this.isInit = false
    misc.readAppPath(this.cfgAppid()).then((res) => {
      this.appPath = res
      console.log(this.appPath)
    })

    fs.mkdir(this.cfgDataPath() + "/log")
    fs.mkdir(this.cfgDataPath() + "/user")
  }

  /**
   * 初始化配置相关,并且应用一下
   * @returns
   */
  cfgInit() {
    return new Promise((resolve, reject) => {
      if (this.isInit) {
        resolve(true)
        return
      }

      // NOTE 只有storage设置的时候才可以创建对应json文件，所以设置个值先，相当于初始化了一下这个storage吧
      storage
        .setStorage("app", "test")
        .then((res) => {
          console.log("storage init success")
          return this.cfgConfigInitLoad()
        })
        .then((res) => {
          this.cfgApply()
          this.isInit = true
          console.log("conf init success")
          resolve(true)
        })
        .catch((err) => {
          console.log("system storage may error", err)
          //todo 做点什么处理？母鸡
          reject(new Error("system storage may error"))
        })
    })
  }
  // 加载一遍完整配置并更新到内存当中
  async cfgConfigInitLoad() {
    // DefaultJson就是默认配置 , 遍历DefaultJson的key，去查kv数据库，有值则更新到内存
    if (DefaultJson && Array.isArray(DefaultJson.items)) {
      for (let i = 0; i < DefaultJson.items.length; i++) {
        let kvValue = await this.cfgGet(DefaultJson.items[i].key)
        if (kvValue) {
          this.storeConf[DefaultJson.items[i].key] = kvValue
        } else {
          this.storeConf[DefaultJson.items[i].key] = DefaultJson.items[i].value
        }
      }
      // console.log(JSON.stringify(this.storeConf))
      return DefaultJson
    } else {
      return { items: [] }
    }
  }
  // 从/home/nvs/devid读取
  loadDeviceId() {
    return new Promise((resolve, reject) => {
      fs.exists("/home/nvs/devid")
        .then((res) => {
          if (res) {
            console.log("devid exist")
            return fs.readFile("/home/nvs/devid")
          } else {
            console.log("devid not exist")
            reject(new Error("devid not exist"))
          }
        })
        .then((res) => {
          if (res) {
            console.log("read devid success")
            this.devid = res
            resolve(res)
          } else {
            console.log("null")
            reject(new Error("null"))
          }
        })
        .catch((err) => {
          console.log(err)
          return reject(err)
        })
    })
  }
  // 获取设备id
  async cfgDeviceId() {
    // 读取设备id
    if (this.devid) {
      return this.devid
    } else {
      try {
        let devid = await this.loadDeviceId()
        if (devid) {
          return devid
        }
      } catch (error) {
        return "nolicence"
      }
      return "nolicence"
    }
  }
  async cfgHasLicence() {
    let devid = await this.cfgDeviceId()
    if (devid && devid !== "nolicence") {
      return true
    } else {
      return false
    }
  }
  // 更新不会丢的数据放这个目录，比如数据库、日志
  cfgDataPath() {
    return "/home/walos/public"
  }
  cfgUpgradePath() {
    return "/home/walos/upgrade"
  }
  cfgGetLogPath(ts) {
    return this.cfgDataPath() + "/log/" + ts + ".jpg"
  }
  async cfgGetLogPathAndCheck(ts) {
    let tz = await this.cfgGetInt(DEFINE.configCommon.timeZone)
    let now = new Date(ts - tz * 60 * 1000)
    let path = this.cfgDataPath() + "/log/" + formatDate(now)
    let ret = await fs.mkdir(path)
    if (ret) {
      return path + "/" + ts + ".jpg"
    } else {
      return null
    }
  }
  cfgGetUserPath(uid) {
    return this.cfgDataPath() + "/user/" + uid + ".jpg"
  }
  cfgGetAudioPath(audioName) {
    return this.appPath + "assets/audios/cn/" + audioName
  }
  cfgGetAlgmModelPath() {
    // return this.appPath + "libs/jz_model"
    return "/home/walos/model"
  }
  cfgGetAlgmSn() {
    return "86f4396baa9c245f4faed26424118113"
  }
  // 产品名如何设置,package.json中的name字段
  cfgProductName() {
    return packageJson.name
  }
  // 版本如何设置，package.version
  cfgSoftVersion() {
    return packageJson.version
  }
  // 版本如何设置，package.version
  cfgAppid() {
    return packageJson.appid
  }
  cfgFdrVendor() {
    return "jz"
  }
  cfgFdrVersion() {
    return "0.1"
  }
  // 加载配置文件并更新DefaultJson的值，先读取默认的配置，再将kv数据库的数据更新到其中,返回的最新的完整而配置json
  async cfgConfigLoad() {
    if (DefaultJson && Array.isArray(DefaultJson.items)) {
      for (let i = 0; i < DefaultJson.items.length; i++) {
        let kvValue = await this.cfgGet(DefaultJson.items[i].key)
        if (kvValue) {
          DefaultJson.items[i].value = kvValue
        }
      }
      // console.log(JSON.stringify(this.storeConf))
      return DefaultJson
    } else {
      return { items: [] }
    }
  }
  //获取当前所有配置,{items:[]}
  cfgAllItems() {
    return this.cfgConfigLoad()
  }
  // 更新配置，key：string，value：string
  cfgSet(key, value) {
    //设置的时候设置到kv的时候同时设置到内存中，方便查询
    this.storeConf[key] = value
    // 更新到kv
    storage.setStorage(key, value)
    if (key === DEFINE.configAlgm.algmFaceMin) {
      this.cfgGetInt(key).then((res) => {
        face.doConfig({ minface: res })
      })
    }
  }
  // 获取配置，key：string，return：string
  async cfgGet(key) {
    // 获取的时候，先从内存获取，没有再从kv获取并设置到内存中,还是没有就不管了
    let memValue = this.storeConf[key]
    if (memValue) {
      // console.log("cfgGet mem")
      return memValue
    } else {
      // kv获取
      let kvValue = await storage.getStorage(key)
      if (kvValue) {
        this.storeConf[key] = kvValue
        return kvValue
      } else {
        return ""
      }
    }
  }
  //获取int类型的配置，key：string，return：int
  async cfgGetInt(key) {
    let value = await this.cfgGet(key)
    if (value) {
      return parseInt(value)
    } else {
      return -1
    }
  }
  //网络配置更新并使能
  cfgNetworkConfig(conf) {
    if (conf && isObject(conf)) {
      if (conf.ether) {
        for (let key in conf.ether) {
          this.cfgSet(key, conf.ether[key])
        }
      }
      if (conf.wifi) {
        for (let key in conf.wifi) {
          this.cfgSet(key, conf.wifi[key])
        }
      }
      if (conf.lte) {
        for (let key in conf.lte) {
          this.cfgSet(key, conf.lte[key])
        }
      }
    }

    this.cfgNetworkApply().then((res) => {
      netmanager.restart("ether")
      netmanager.restart("wifi")
      netmanager.restart("lte")
    })
  }
  //  配置设备网络
  async cfgNetworkApply() {
    console.log("do CfgNetworkApply")
    const netinfo = {}

    const ether = { enable: 1, mode: 0 }
    if ((await this.cfgGet(DEFINE.configNet.ethMode)) === "dynamic") {
      ether.mode = 1
    }
    ether.ip = await this.cfgGet(DEFINE.configNet.ethIp)
    ether.mask = await this.cfgGet(DEFINE.configNet.ethMask)
    ether.gw = await this.cfgGet(DEFINE.configNet.ethGw)
    ether.dns = await this.cfgGet(DEFINE.configNet.ethDns)
    netinfo.ether = ether

    const wifi = {}
    let mode = await this.cfgGet(DEFINE.configNet.wifiMode)
    if (mode == "sta") {
      wifi.sta_enable = 1
      wifi.sta_ssid = await this.cfgGet(DEFINE.configNet.wifiStaSsid)
      wifi.sta_passwd = await this.cfgGet(DEFINE.configNet.wifiStapasswd)
      wifi.ap_enable = 0
      wifi.ap_ssid = ""
      wifi.ap_passwd = ""
    } else if (mode == "ap") {
      wifi.sta_enable = 0
      wifi.sta_ssid = ""
      wifi.sta_passwd = ""
      wifi.ap_enable = 1
      wifi.ap_ssid = await this.cfgGet(DEFINE.configNet.wifiApSsid)
      wifi.ap_passwd = await this.cfgGet(DEFINE.configNet.wifiApPasswd)
      if (wifi.ap_ssid == "walos-wifi-abc") {
        //默认情况下，设备发出的wifi为 wos-设备名，密码为设备名
        let devid = await this.cfgDeviceId()
        wifi.ap_ssid = "wos-" + devid
        this.cfgSet(DEFINE.configNet.wifiApSsid, wifi.ap_ssid)
        wifi.ap_passwd = devid
        this.cfgSet(DEFINE.configNet.wifiApPasswd, wifi.ap_passwd)
      }
    } else {
      wifi.sta_enable = 0
      wifi.sta_ssid = ""
      wifi.sta_passwd = ""
      wifi.ap_enable = 0
      wifi.ap_ssid = ""
      wifi.ap_passwd = ""
    }

    netinfo.wifi = wifi

    const lte = {}
    if ((await this.cfgGet(DEFINE.configNet.lteMode)) == "enable") {
      lte.enable = 1
    } else lte.enable = 0
    netinfo.lte = lte
    return netmanager.setConfig(netinfo)
  }
  //todo 配置算法
  async cfgAlgmApply() {
    console.log("do CfgAlgmApply")
    const algm = {}

    // if ((await this.cfgGet(DEFINE.configCommon.logMode)) == "image") {
    //   algm.with_jpeg = 1
    // } else algm.with_jpeg = 0

    if ((await this.cfgGet(DEFINE.configAlgm.algmAlive)) == "enable") {
      algm.alive = true
    } else algm.alive = false

    // algm.type = this.cfgGetInt(DEFINE.configAlgm.algmType)
    // algm.clear = this.cfgGetInt(DEFINE.configAlgm.algmFaceClear)

    // algm.face_max = this.cfgGetInt(DEFINE.configAlgm.algmFaceMax)
    algm.minface = await this.cfgGetInt(DEFINE.configAlgm.algmFaceMin)

    // algm.yaw = this.cfgGetInt(DEFINE.configAlgm.algmFaceAngleYaw)
    // algm.roll = this.cfgGetInt(DEFINE.configAlgm.algmFaceAngleRoll)
    // algm.pitch = this.cfgGetInt(DEFINE.configAlgm.algmFaceAnglePitch)

    // algm.zone_x =await this.cfgGetInt(DEFINE.configAlgm.algmFaceZoneX)
    // algm.zone_y =await this.cfgGetInt(DEFINE.configAlgm.algmFaceZoneY)
    // algm.zone_w =await this.cfgGetInt(DEFINE.configAlgm.algmFaceZoneW)
    // algm.zone_h =await this.cfgGetInt(DEFINE.configAlgm.algmFaceZoneH)

    // return fdr.setparam(algm)
    return face.doConfig(algm)
  }

  // 一些硬件配置可能
  async cfgWosApply() {
    console.log("do CfgWosApply")
    const tracker = {}

    tracker.threshold = await this.cfgGetInt(DEFINE.configAlgm.algmThrehold)
    tracker.duration = await this.cfgGetInt(DEFINE.configHw.tipsDuration)
    misc.setTipsDealy(tracker.duration)

    let value_volume = await this.cfgGetInt(DEFINE.configHw.volumnOut)
    if (value_volume) {
      value_volume = Math.floor(value_volume)
      if (value_volume < 0 || value_volume > 100) {
        value_volume = 80
      }
    } else {
      value_volume = 80
    }
    mpp.setAuido(value_volume)
    // WosAudio.open_spk()
    // log.success("open_spk")
  }
  cfgApply() {
    this.cfgNetworkApply()
    this.cfgAlgmApply()
    this.cfgWosApply()
  }
}

export default new Conf()
