import { isString, isNumber, isObject } from "../../utils/util"
import { DEFINE } from "../../utils/define"
import dbUser from "./db_user"
import dbLog from "./db_log"
import fs from "fs"
import misc from "../misc/misc"
import conf from "../conf/conf"
import netmanager from "../netmanager/netmanager"
import bashiFace from "../face/face"
import mqtt from "./mqtt"
import mpp from "../mpp/mpp"
import { event_show_user } from "../../utils/event"
import card from "../card/card"
import storage from "storage"

class AdpDev {
  constructor() {}

  synctime(req) {
    console.log("adpdev.synctime -")

    if (!isObject(req.body) || !isNumber(req.body.timestamp)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    if (isNumber(req.body.timezone)) {
      conf.cfgSet(DEFINE.configCommon.timeZone, req.body.timezone + "")
    }

    misc.setUtc(req.body.timestamp)
    return {
      retcode: DEFINE.error.OK,
    }
  }

  async devinfo(req) {
    const body = {
      ["device-id"]: await conf.cfgDeviceId(),
      ["product-id"]: conf.cfgProductName(),
      ["hardware-version"]: "x2500-v100",
      ["walos-version"]: conf.cfgSoftVersion(),
      ["algm-version"]: conf.cfgFdrVersion(),
      ["algm-vendor"]: conf.cfgFdrVendor(),
      // ["disk-info"]: tonumber(utils.disk_freesize(CfgDataPath())),
      ["ip"]: await netmanager.getIp()[2],
      total_user: await dbUser.user_count(),
      total_face: await dbUser.user_count_has_feature(),
    }

    return {
      retcode: DEFINE.error.OK,
      body: body,
    }
  }

  async logrinfo(req) {
    console.log("adpdev.logrinfo -> ")
    return {
      retcode: DEFINE.error.OK,
      body: {
        max: await dbLog.max(),
        min: await dbLog.min(),
      },
    }
  }

  async logrfetch(req) {
    console.log("logr.fetch -> ")

    let seqnum = await dbLog.min()
    let offset = 0
    let limit = 10
    let have_seqnum = false

    if (!isObject(req.body)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    if (isNumber(req.body.seqnum)) {
      seqnum = req.body.seqnum
      if (seqnum < 0) {
        seqnum = 0
      }
      have_seqnum = true
    }

    if (isNumber(req.body.offset)) {
      offset = req.body.offset
      if (offset < 0) {
        offset = 0
      }
    }

    if (isNumber(req.body.limit)) {
      limit = req.body.limit
      if (limit <= 0) {
        limit = 10
      }
    }

    const rsp = {
      retcode: DEFINE.error.OK,
      body: {
        events: [],
      },
    }
    if (have_seqnum) {
      rsp.body.events = []
      for (let i = seqnum; i < seqnum + limit; i++) {
        let lr = await dbLog.lookup(i)
        console.log("logr.fetch -> seqnum:" + i + ", " + JSON.stringify(lr))

        if (lr != null) {
          rsp.body.events.push(lr)
        }
      }
    } else {
      console.log("logr.fetch -> -> offset:" + offset)
      rsp.body.events = await dbLog.fetch(offset, limit)
    }

    return rsp
  }

  network_apply(req) {
    console.log("adpdev.network_apply -> ")
    conf.cfgNetworkApply()
    return {
      retcode: DEFINE.error.OK,
    }
  }

  reset(req) {
    console.log("adpdev.reboot -> reset device")
    //数据库，日志图，用户图等都存在cfgDataPath中，把这个目录删除就行了
    fs.rm(conf.cfgDataPath())
    storage.setStorage(DEFINE.default.isMqttNormalActive, "0")
    setTimeout(() => {
      misc.reboot()
    }, 1000)
    return {
      retcode: DEFINE.error.OK,
    }
  }

  reboot(req) {
    console.log("adpdev.reboot -> 1 seconds later reboot")
    setTimeout(() => {
      misc.reboot()
    }, 1000)
    return {
      retcode: DEFINE.error.OK,
    }
  }

  algm_apply(req) {
    console.log("adpdev.algm_apply -> ")
    conf.cfgAlgmApply()
    return {
      retcode: DEFINE.error.OK,
    }
  }

  algm_control(req) {
    console.log("adpuser.algm_control -> ")

    if (
      !isObject(req.body) ||
      !isString(req.body.type) ||
      !isString(req.body.control)
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    let control = req.body.control
    if (control == "start") {
      bashiFace.setEnable(1)
    } else if (control == "stop") {
      bashiFace.setEnable(0)
    }

    if (bashiFace.getEnable()) {
      return {
        retcode: DEFINE.error.OK,
        body: {
          type: "fdr",
          state: "running",
        },
      }
    } else
      return {
        retcode: DEFINE.error.OK,
        body: {
          type: "fdr",
          state: "stop",
        },
      }
  }

  cardread(req) {
    const reply = {}
    reply.body = {}
    let lastCardHex = card.readLastCard()
    if (isString(lastCardHex) && lastCardHex !== "") {
      reply.retcode = 0
      reply.body.type = "ic"
      reply.body.hex = lastCardHex
      reply.body.data = misc.hexToBase64(lastCardHex)
    } else {
      reply.retcode = 103
      reply.tips = "无读卡数据暂存"
      reply.body.type = ""
      reply.body.data = ""
      reply.body.hex = ""
    }
    return reply
  }

  async opendoor(req) {
    console.log("adpdev.opendoor -> ")

    if (!isObject(req.body) || !isString(req.body.userid)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    let optype = "open"
    let delay = 3
    let uid = ""
    if (!isNumber(req.body.delay)) {
      delay = (await conf.cfgGetInt(DEFINE.configHw.tipsDuration)) || 3
    } else {
      delay = req.body.delay
    }

    if (isString(req.body.userid)) {
      uid = req.body.userid
    }

    if (req.body.type == "open" || req.body.type == "silent") {
      //  开门指令
      optype = "open"
      event_show_user("远程开门")
      if (req.body.type !== "silent") {
        mpp.playOpendoor()
      }
      misc.openDoor(true, delay)
      // 生成日志
      let ts = new Date().getTime()
      let savedLog = await dbLog.saveAndLookup(uid, "", 0, "remote", ts)
      let rc = mqtt.event_post(savedLog)
      if (rc) {
        dbLog.update(ts, 1)
      }
    } else if (req.body.type == "qr_deny") {
      // 二维码异常
      optype = "qr_deny"
      mpp.playQrDeny()
    } else if (req.body.type == "close") {
      // 关门
      optype = "close"
      misc.openDoor(false, 0)
    } else {
      return {
        retcode: DEFINE.error.INVALID,
        tips: "unsupport type",
      }
    }
    return {
      retcode: DEFINE.error.OK,
    }
  }

  async upload(req) {
    console.log("adpdev.upload -> ")

    if (
      !isObject(req.body) ||
      req.body.type !== "upgrade" ||
      !isString(req.body.filename) ||
      !isNumber(req.body.filesize) ||
      !isNumber(req.body.size) ||
      !isString(req.body.data)
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    if (!isNumber(req.body.offset)) {
      req.body.offset = 0
    }

    let rc = await misc.writeB64ToFile(
      req.body.data,
      conf.cfgUpgradePath() + "/" + req.body.filename,
      req.body.offset
    )
    if (rc) {
      return {
        retcode: DEFINE.error.OK,
      }
    } else {
      return {
        retcode: DEFINE.error.FILEOPS,
        tips: DEFINE.error.FILEOPS_TIPS,
      }
    }
  }

  async upgrade(req) {
    console.log("adpdev.upgrade -> ")
    setTimeout(() => {
      misc.reboot()
    }, 1000)
    return {
      retcode: DEFINE.error.OK,
    }
  }

  async download(req) {
    console.log("adpdev.download -> ")

    if (
      !isObject(req.body) ||
      !isNumber(req.body.timestamp) ||
      (req.body.type !== "snapshot" && req.body.type !== "logr")
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }
    const body = req.body
    if (!isNumber(body.offset) || body.offset < 0) {
      body.offset = 0
    }
    if (!isNumber(body.size) || body.size < 0) {
      body.size = 128 * 1024
    }

    if (body.type === "snapshot") {
      return {
        retcode: DEFINE.error.FILEOPS,
        tips: DEFINE.error.FILEOPS_TIPS,
      }
      if (body.chanel !== 0 && body.chanel !== 1) {
        body.chanel = 0
      }
      // local fpath = CfgDataPath() .. "/snapshots/"
      // local fname = "SNAP" .. tostring(body.chanel) .. "-" .. tostring(body.timestamp) .. ".jpg"
      // local data, slice, fsize = utils.read_file(fpath .. fname, body.offset, body.size)
      // if data ~= nil then
      //     return download_pack(fname, fsize, data, body.offset)
      // else
      //     return {
      //         retcode = error.FILEOPS,
      //         tips = error.FILEOPS_TIPS
      //     }
      // end
    } else if (body.type == "logr") {
      let logPath = await conf.cfgGetLogPathAndCheck(body.timestamp)
      let buffer = await misc.readFromFile(logPath, body.offset, body.size)
      if (buffer) {
        const stat = await fs.stat(logPath)
        return {
          retcode: DEFINE.error.OK,
          body: {
            filename: body.timestamp + ".jpg",
            filesize: stat.size,
            offset: body.offset,
            data: misc.bufferToBase64(buffer),
            size: buffer.length,
          },
        }
      } else {
        return {
          retcode: DEFINE.error.FILEOPS,
          tips: DEFINE.error.FILEOPS_TIPS,
        }
      }
    } else
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
  }

  async eventdownload(req) {
    console.log("adpdev.eventdownload -> ")
    if (
      !isObject(req.body) ||
      !isNumber(req.body.timestamp) ||
      req.body.type !== "logr"
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    //todo return type obs
    const body = req.body
    if (!isNumber(body.offset) || body.offset < 0) {
      body.offset = 0
    }
    if (!isNumber(body.size) || body.size < 0) {
      body.size = 128 * 1024
    }
    let logPath = await conf.cfgGetLogPathAndCheck(body.timestamp)
    let buffer = await misc.readFromFile(logPath, body.offset, body.size)
    if (buffer) {
      const stat = await fs.stat(logPath)

      return {
        retcode: DEFINE.error.OK,
        body: {
          filename: body.timestamp + ".jpg",
          filesize: stat.size,
          offset: body.offset,
          data: misc.bufferToBase64(buffer),
          size: buffer.length,
        },
      }
    } else {
      return {
        retcode: DEFINE.error.FILEOPS,
        tips: DEFINE.error.FILEOPS_TIPS,
      }
    }
  }

  //end
}
export default new AdpDev()
