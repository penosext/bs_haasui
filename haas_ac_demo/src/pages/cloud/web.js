import { httpserver } from "httpserver"
import { DEFINE } from "../../utils/define"
import { isString, isNumber, isObject } from "../../utils/util"
import adpMisc from "./adp_misc"
import { gate_handler } from "./gate"
import { http } from "http"

class Web {
  isInit = false
  htpd
  constructor() {
    this.isInit = false
  }

  reply(req, data) {
    if (isObject(data)) {
      this.htpd.send_reply({
        req: req,
        data: JSON.stringify(data),
      })
    } else {
      this.htpd.send_reply({
        req: req,
        data: data,
      })
    }
  }

  common_post(url, data) {
    http
      .request({
        url: url,
        method: "POST",
        data: data,
        headers: ["Content-Type:application/json"],
        timeout: 10,
      })
      .then((res) => {})
      .catch((err) => {})
  }

  async webapi_handler(req, path, data) {
    console.log("webapi_handler -> request path:" + path)
    console.log(Object.prototype.toString.call(data))
    let newdata
    if (isString(data)) {
      newdata = data.replaceAll("\r\n", "")
      // console.log(JSON.stringify(newdata))
    } else {
      this.reply(
        req,
        JSON.stringify({
          retcode: DEFINE.error.INVALID,
          tips: "data not string",
        })
      )
      return
    }
    let rb = JSON.parse(newdata)
    if (!isObject(rb) || !isString(rb.action) || !isObject(rb.header)) {
      this.reply(
        req,
        JSON.stringify({
          retcode: DEFINE.error.INVALID,
          tips: "body must be json and have action",
        })
      )
      return
    }
    // check token
    if (
      rb.action !== "auth-login" &&
      rb.action !== "info" &&
      rb.action !== "device-info"
    ) {
      let token = this.htpd.find_header({ req: req, dir: 0, key: "Token" })
      if (!isString(token) || !(await adpMisc.check_token(token))) {
        this.reply(req, {
          retcode: DEFINE.error.INVALID,
          action: rb.action,
          header: rb.header,
          tips: "without token or token timeout",
        })
        return
      }
    }
    if (rb.action === "auth-login") {
      let rsp = await adpMisc.auth_login(rb)
      rsp.header = rb.header
      // console.log("adp.webapi_handler -> rsp : " + JSON.stringify(rsp))
      this.reply(req, rsp)
      return
    }
    // console.log("adp.webapi_handler -> request : " + JSON.stringify(rb))
    let rsp = await gate_handler(rb)
    if (rsp == null) {
      this.req_temp = req
      return
    }
    rsp.header = rb.header
    // console.log("adp.webapi_handler -> response : " + JSON.stringify(rsp))
    this.reply(req, rsp)
  }

  common_reply(reply) {
    if (this.req_temp) {
      console.log("webapi.common_reply -> response ")
      this.reply(this.req_temp, reply)
      webapi.req_temp = nil
      return true
    }

    return false
  }

  init(port) {
    if (this.isInit) {
      return
    }
    console.log("webapi.init -> webapi server")
    if (!isNumber(port)) {
      port = 80
    }
    this.htpd = new httpserver()
    this.htpd
      .init({ port: port })
      .then((res) => {
        // console.log(JSON.stringify(res))
        this.isInit = true
        this.htpd.on("request", (res) => {
          // console.log(JSON.stringify(res))
          this.webapi_handler(res.req, res.path, res.data)
        })
      })
      .catch((err) => {
        this.isInit = false
        console.log(err)
      })
  }
  //end
}
export default new Web()
