import { DEFINE } from "../../utils/define"
import adpUser from "./adp_user"
import adpDev from "./adp_dev"
import adpMisc from "./adp_misc"
import {
  isString,
  isFunction,
  isAsyncFunction,
  isObject,
} from "../../utils/util"

async function deprecated(req) {
  return {
    retcode: DEFINE.error.OK,
    tips: DEFINE.error.DEPRECATED_TIPS,
  }
}

function allways_ok(req) {
  return {
    retcode: DEFINE.error.OK,
  }
}

async function handler(req) {
  switch (req.action) {
    case "auth-login":
      return await adpMisc.auth_login(req)
    case "auth-passwd":
      return await adpMisc.auth_passwd(req)
    case "config-fetch":
    case "config-upload":
      return await adpMisc.conf_fetch(req)

    case "config-set":
      return await adpMisc.conf_set(req)
    case "mqtt-get":
      return await adpMisc.conf_mqtt_get(req)
    case "mqtt-set":
      return await adpMisc.conf_mqtt(req)
    case "device-synctime":
      return await adpDev.synctime(req)
    case "device-info":
      return await adpDev.devinfo(req)
    case "device-reboot":
      return await adpDev.reboot(req)
    case "device-reset":
      return await adpDev.reset(req)
    case "device-opendoor":
      return await adpDev.opendoor(req)
    case "device-upload":
      return await adpDev.upload(req)
    case "device-upgrade":
      return await adpDev.upgrade(req)
    case "device-snapshot":
      return await allways_ok(req)
    case "device-download":
      return await adpDev.download(req)
    case "device-cardread":
      return await adpDev.cardread(req)
    case "user-insert":
      return await adpUser.insert(req)
    case "user-remove":
      return await adpUser.remove(req)
    case "user-lookup":
      return await adpUser.lookup(req)
    case "user-fetch":
      return await adpUser.fetch(req)
    case "user-clear":
      return await adpUser.clear(req)
    case "fdr-extract":
      return await adpUser.fdr_extract(req)
    case "fdr-enable":
      return await adpUser.fdr_enable(req)
    case "user-batch":
      return await adpUser.insert(req)
    case "user-update":
      return await adpUser.insert(req)
    case "user-gen":
      return await adpUser.generate(req)
    case "user-upload":
      return await adpUser.upload(req)
    case "user-download":
      return await adpUser.download(req)
    case "user-upload-url":
      return await adpUser.upload_url(req)
    case "event-info":
      return await adpDev.logrinfo(req)
    case "event-fetch":
      return await adpDev.logrfetch(req)
    case "sync-time":
      return await adpDev.synctime(req)
    case "info":
      return await adpDev.devinfo(req)
    case "apply-network":
      return await adpDev.network_apply(req)
    case "apply-manager-mode":
      return await adpDev.reset(req)
    case "apply-algm-conf":
      return await adpDev.algm_apply(req)
    case "algm-control":
      return await adpDev.algm_control(req)
    case "apn-config":
      return await allways_ok(req)
    case "event-download":
    case "event-download-url":
      return await adpDev.eventdownload(req)
    case "card-read":
      return await adpDev.cardread(req)
    // case "card-insert":
    // return await adpUser.card_insertreq)
    // case "card-lookup":
    //   return await adpUser.card_lookup(req)
    //   case "card-remove":
    //   return await adpUser.card_remove(req)
    // case "card-fetch":
    //   return await deprecated(req)
    case "visitor-insert":
      return await deprecated(req)
    case "visitor-remove":
      return await deprecated(req)
    case "audio-upload":
      return await deprecated(req)
    case "audio-download":
      return await deprecated(req)
    case "audio-play":
      return await deprecated(req)
    default:
      return null
  }
}

function gate_check_state(req) {
  return true
}

export async function gate_handler(req) {
  if (!isObject(req) || !isString(req.action) || !isObject(req.header)) {
    console.log("gate:handler :> request invavlid")
    return {
      retcode: DEFINE.error.INVALID,
      tips: "request invavlid,header、action nil",
    }
  }

  if (!gate_check_state(req)) {
    console.log("gate:handler :> not manage able")
    return {
      retcode: DEFINE.error.NOTMANAGEABLE,
      tips: DEFINE.error.NOTMANAGEABLE_TIPS,
    }
  }
  // console.log(JSON.stringify(req))
  let rsp = await handler(req)
  if (rsp == null) {
    console.log("action unkown or not reply immediately")
    return null
    // return {
    //   action: req.action,
    //   header: req.header,
    //   retcode: DEFINE.error.NOTSUPPORT,
    //   tips: DEFINE.error.NOTSUPPORT_TIPS,
    // }
  }
  // console.log(JSON.stringify(rsp))
  rsp.action = req.action + "-ack"
  rsp.header = req.header
  // console.log(JSON.stringify(rsp))
  return rsp
}
