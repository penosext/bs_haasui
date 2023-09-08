import { nm } from "nm"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"

class Nm {
  netmanager
  constructor() {
    this.netmanager = new nm()
    this.netmanager.init()
  }

  async getAllConfig() {
    const result = await this.netmanager.getConfig()
    return result
  }
  async getAllInfo() {
    const result = await this.netmanager.netinfo()
    return result
  }
  async getIp() {
    let result = await this.getAllInfo()
    if (!isObject(result)) {
      return ""
    }
    // console.log(JSON.stringify(result))
    //以太网-wifi-lte，enable并且有ip
    if (
      isObject(result.ether) &&
      result.ether.enable === 1 &&
      isString(result.ether.ipaddr) &&
      result.ether.ipaddr !== "0.0.0.0"
    ) {
      //以太网
      return ["eth", result.ether.iface, result.ether.ipaddr]
    }

    if (
      isObject(result.sta) &&
      result.sta.enable === 1 &&
      isString(result.sta.ipaddr) &&
      result.sta.ipaddr !== "0.0.0.0"
    ) {
      //wifi
      return ["sta", result.sta.iface, result.sta.ipaddr]
    }

    if (
      isObject(result.lte) &&
      result.lte.enable === 1 &&
      isString(result.lte.ipaddr) &&
      result.lte.ipaddr !== "0.0.0.0"
    ) {
      //lte
      return ["lte", result.lte.iface, result.lte.ipaddr]
    }

    if (
      isObject(result.ap) &&
      result.ap.enable === 1 &&
      isString(result.ap.ipaddr) &&
      result.ap.ipaddr !== "0.0.0.0"
    ) {
      //ap
      return ["ap", result.ap.iface, result.ap.ipaddr]
    }

    return ["unknown", "unknown", "0.0.0.0"]
  }

  //
  async setConfig(info) {
    // console.log(JSON.stringify(info))
    return this.netmanager.setConfig({
      ether: info.ether,
      wifi: info.wifi,
      lte: info.lte,
    })
  }

  restart(type) {
    if (type === "ether" || type === "wifi" || type === "lte") {
      this.netmanager.restart(type)
    }
  }
}

export default new Nm()
