import { isString, isNumber, isObject, isAsyncFunction } from "../../utils/util"
import { DEFINE } from "../../utils/define"
import dbUser from "./db_user"
import misc from "../misc/misc"
import conf from "../conf/conf"
import bashiFace from "../face/face"
import fs from "fs"
// import mqtt from "./mqtt"

class AdpUser {
  constructor() {}

  check_rule(rule) {
    // console.log("adpuser.check_rule -> "+JSON.stringify(rule))
    if (!isObject(rule)) {
      return null
    }

    if (!isNumber(rule.type)) {
      console.log("user.check_rule -> rule type not exist")
      return null
    }

    // type : 0x00, 时间； 多时间端可设置,直接使用expire和effect
    if (rule.type == 0) {
    }
    // 0x01, 计数；
    else if (rule.type == 1) {
      if (!isNumber(rule.count) || rule.count < 0) {
        console.log("user.check_rule -> rule type is count but count not exist")
        return null
      }
    }
    // 0x02, cron格式;
    else if (rule.type == 2) {
      // cron 格式：分 时 日 月 周  ，仅用来表示时间范围
      // 如 30-59 8,9 1,30 1-5,7,8 *   表示1到5月、7月、8月的每个1号和30号的8点30到8点59、9点30到9点59可通行
      // 如 * 7,8,15,16 * 2-6 1-5   表示 2到6月的每周一到周五的7点到8点59 15点到16点59可通行
      if (!isString(rule.cron) || rule.cron === "") {
        console.log("user.check_rule -> rule type is cron but cron not exist")
        return null
      }
    }
    // 0x04 梯控有效，可以比特位或组合
    else if (rule.type == 4) {
      if (!isString(rule.data) || rule.data.length > 16) {
        console.log(
          "user.check_rule -> rule type is elevator but data not exist"
        )
        return null
      }
    } else {
      return null
    }

    if (!isNumber(rule.rid)) {
      rule.rid = 0
    }

    if (!isNumber(rule.effect) || rule.effect < 0) {
      rule.effect = 0
    }

    if (!isNumber(rule.expire) || rule.expire < -1) {
      rule.expire = -1
    }

    return rule
  }

  check_card(card) {
    // log.trace("adpuser.check_card -> "..log.stringify(card))

    if (!isString(card.id) || card.id.length > 32) {
      console.log("user.check_card -> card id not exist")
      return null
    }

    if (!isString(card.type) || card.type === "") {
      card.type = "ic"
    }

    // 如果有hex字段，则尝试将其转换为base64字段
    if (isString(card.hex) && card.hex !== "") {
      // console.log("from hex : " + card.hex)
      card.data = misc.hexToBase64(card.hex)
      // console.log("to hex : " + card.data)
    } else {
      if (!isString(card.data) || card.data.length > 64) {
        console.log("user.check_card -> data too long")
        return null
      } else card.hex = misc.base64ToHex(card.data)
    }

    return card
  }
  /**解析处理user的参数 */
  async check_user(user) {
    if (!isString(user.userid) || user.userid.length > 32) {
      console.log("user.check_user -> userid must be <=32 string")
      return null
    }
    if (!isString(user.name) || user.name.length > 32) {
      console.log("user.check_user -> name must be <=32 string")
      return null
    }
    if (!isString(user.desc) || user.desc.length > 64) {
      // console.log("user.check_user -> desc  must be <=64 string")
      user.desc = ""
    }
    if (!isString(user.idno) || user.idno.length > 32) {
      user.idno = ""
    }
    if (!isNumber(user.effect) || user.effect < 0) {
      user.effect = 0
    }
    if (!isNumber(user.expire) || user.expire < 0) {
      user.expire = -1
    }

    if (isObject(user.face)) {
      if (isString(user.face.data) && user.face.data != "") {
        //jpg图片的base64编码
        let w_ret = await misc.writeB64ToFile(
          user.face.data,
          conf.cfgGetUserPath(user.userid)
        )
        if (!w_ret) {
          console.log("write base64 img tofile fail")
          return null
        }
        try {
          user.face.feature = await bashiFace.userAdd(
            conf.cfgGetUserPath(user.userid),
            user.userid
          )
          if (user.face.feature) {
            user.hasFeature = true
          } else {
            user.hasFeature = false
          }
        } catch (error) {
          user.hasFeature = false
        }
        //提取特征结束就把图删了
        w_ret = await fs.rm(conf.cfgGetUserPath(user.userid))
      } else if (isString(user.face.feature) && user.face.feature !== "") {
        console.log("has feature data ")
        //特征值
        try {
          user.face.feature = await bashiFace.userAddFeature(
            user.face.feature,
            user.userid
          )
          if (user.face.feature == 0) {
            user.hasFeature = true
          } else {
            user.hasFeature = false
          }
        } catch (error) {
          user.hasFeature = false
        }
      }
    }

    if (Array.isArray(user.rules) && user.rules.length > 0) {
      const rules = []
      user.rules.forEach((rule) => {
        let r = this.check_rule(rule)
        if (r != null) {
          rules.push(r)
        }
      })
      user.rules = rules
    }

    if (Array.isArray(user.cards) && user.cards.length > 0) {
      const cards = []
      user.cards.forEach((card) => {
        let r = this.check_card(card)
        if (r != null) {
          cards.push(r)
        }
      })
      user.cards = cards
    }
    return user
  }
  async insert_user(user) {
    console.log("adpuser.insert_user -> ...")
    let u = await this.check_user(user, true)
    if (u == null) {
      return {
        userid: user.userid,
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }
    // console.log("insert_user:" + JSON.stringify(user))
    console.log("insert_user:" + user.userid)
    let rc = await dbUser.user_insert(user)
    if (!rc) {
      return {
        userid: user.userid,
        retcode: DEFINE.error.DBOPS,
        tips: DEFINE.error.DBOPS_TIPS,
      }
    }
    //feature 表示特征的生成或添加是否成功
    return {
      userid: user.userid,
      feature: user.hasFeature ? true : false,
      retcode: DEFINE.error.OK,
    }
  }

  /**插入用户入口方法 */
  async insert(req) {
    console.log("adpuser.insert -> ")
    if (!isObject(req.body) || !Array.isArray(req.body.users)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    const users = []
    for (let index = 0; index < req.body.users.length; index++) {
      const user = req.body.users[index]
      if (isObject(user) && isString(user.userid)) {
        let ret = await this.insert_user(user)
        users.push(ret)
      }
    }
    return {
      retcode: DEFINE.error.OK,
      body: { users: users },
    }
  }

  async remove_user(user) {
    console.log("adpuser.remove_user -> ..." + JSON.stringify(user))

    if (!isString(user.userid)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }
    //数据库删除
    let rc = await dbUser.user_delete(user.userid)
    //face模块删除
    bashiFace.userRemove(user.userid)

    return {
      userid: user.userid,
      retcode: DEFINE.error.OK,
    }
  }

  async remove(req) {
    console.log("adpuser.remove ")
    if (!isObject(req.body) || !Array.isArray(req.body.users)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    const users = []
    for (let index = 0; index < req.body.users.length; index++) {
      const user = req.body.users[index]
      let rc = await this.remove_user(user)
      users.push(rc)
    }

    const rsp = {
      retcode: DEFINE.error.OK,
      body: {
        users: users,
      },
    }

    console.log("adpuser.remove -> rsp:" + JSON.stringify(rsp))
    return rsp
  }

  async lookup(req) {
    console.log("adpuser.lookup")

    if (!isObject(req.body) || !Array.isArray(req.body.users)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    const users = []
    for (let index = 0; index < req.body.users.length; index++) {
      const user = req.body.users[index]
      let u = await dbUser.user_lookup(
        user.userid,
        true,
        user.card === 1,
        user.face === 1
      )
      if (u == null) {
        u = {
          retcode: DEFINE.error.NOEXIST,
          tips: DEFINE.error.NOEXIST_TIPS,
          userid: user.userid,
        }
      } else {
        u.retcode = 0
      }
      users.push(u)
    }

    const rsp = {
      retcode: DEFINE.error.OK,
      body: {
        users: users,
      },
    }
    return rsp
  }

  async fetch(req) {
    console.log("adpuser.fetch")

    if (!isObject(req.body)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    let offset = req.body.offset || 0
    let limit = req.body.limit || 10
    const rsp_users = []
    let users = await dbUser.user_fetch(offset, limit)
    if (Array.isArray(users) ** users.length > 0) {
    }
    users.forEach((user) => {
      rsp_users.push({ userid: user })
    })

    const rsp = {
      retcode: DEFINE.error.OK,
      body: { users: rsp_users },
    }
    return rsp
  }

  async clear(req) {
    console.log("adpuser.clear")
    await dbUser.user_clear()
    await bashiFace.userClear()
    const rsp = {
      retcode: DEFINE.error.OK,
      body: {},
    }

    console.log("adpuser.clear")
    return rsp
  }

  async fdr_extract(req) {
    console.log("fdr.fdr_extract -> ")

    if (!isObject(req.body) || !isString(req.body.source)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }
    if (req.body.source == "data") {
      if (
        !isString(req.body.image) ||
        (req.body.image !== "jpg" && req.body.image !== "jpeg") ||
        !isString(req.body.data)
      ) {
        return {
          retcode: DEFINE.error.INVALID,
          tips: DEFINE.error.INVALID_TIPS,
        }
      }
      if (req.body.data.length >= (2000 * 2000 * 4) / 3) {
        return {
          retcode: DEFINE.error.INVALID_FACE,
          tips: "jpg size must < 2000*2000",
        }
      }
      let w_ret = await misc.writeB64ToFile(
        req.body.data,
        conf.cfgGetUserPath(req.body.userid)
      )
      if (!w_ret) {
        console.log("write base64 img tofile fail")
        return {
          retcode: DEFINE.error.INTERNAL,
          tips: DEFINE.error.INTERNAL_TIPS,
        }
      }
      let feat = ""
      try {
        feat = await bashiFace.userAdd(
          conf.cfgGetUserPath(req.body.userid),
          req.body.userid
        )
        //因为只是提取特征，并非添加用户，所以删除
        bashiFace.userRemove(req.body.userid)
      } catch (error) {
        return {
          retcode: DEFINE.error.INVALID_FACE,
          tips: "提取特征失败",
          body: {
            userid: req.body.userid,
          },
        }
      }
      // await dbUser.user_update_face(req.body.userid, true)
      //提取特征结束就把图删了
      w_ret = await fs.rm(conf.cfgGetUserPath(req.body.userid))
      return {
        retcode: DEFINE.error.OK,
        body: {
          vendor: conf.cfgFdrVendor(),
          version: conf.cfgFdrVersion(),
          feature: feat,
          userid: req.body.userid,
        },
      }
    }

    if (req.body.source === "camera") {
      return {
        retcode: DEFINE.error.NOTSUPPORT,
        tips: DEFINE.error.NOTSUPPORT_TIPS,
      }
    }

    return {
      retcode: DEFINE.error.INVALID,
      tips: DEFINE.error.INVALID_TIPS,
    }
  }

  fdr_enable(req) {
    console.log("adpuser.fdr_enable -> ")

    if (!isObject(req.body) || !isString(req.body.ops)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    if (req.body.ops === "start") {
      // 停断通过前端实现或者sdk实现
      bashiFace.setEnable(1)
    } else if (req.body.ops == "stop") {
      bashiFace.setEnable(0)
    } else {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    // if (rc) {
    return {
      retcode: DEFINE.error.OK,
    }
    // } else {
    //   return {
    //     retcode: DEFINE.error.INTERNAL,
    //     tips: DEFINE.error.INTERNAL_TIPS,
    //   }
    // }
  }

  async generate(req) {
    console.log("adpuser.generate -> ")

    if (!isObject(req.body) || !isString(req.body.userid)) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    let feat = ""
    try {
      feat = await bashiFace.userAdd(
        conf.cfgGetUserPath(req.body.userid),
        req.body.userid
      )
    } catch (error) {
      return {
        retcode: DEFINE.error.INVALID_FACE,
        tips: "提取特征失败",
        body: {
          userid: req.body.userid,
        },
      }
    }
    dbUser.user_update_face(req.body.userid, true)
    //提取特征结束就把图删了
    fs.rm(conf.cfgGetUserPath(req.body.userid))
    return {
      retcode: DEFINE.error.OK,
      body: {
        face: {
          vendor: conf.cfgFdrVendor(),
          version: conf.cfgFdrVersion(),
          feature: feat,
        },
        userid: req.body.userid,
      },
    }
  }

  async upload(req) {
    console.log("adpuser.upload -> ")

    if (
      !isObject(req.body) ||
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

    let userid = req.body.filename.substring(
      0,
      req.body.filename.lastIndexOf(".")
    )
    console.log("userid:" + userid)
    if (!userid || !(await dbUser.user_exist(userid))) {
      return {
        retcode: DEFINE.error.NOEXIST,
        tips: DEFINE.error.NOEXIST_TIPS,
      }
    }

    if (!isNumber(req.body.offset)) {
      req.body.offset = 0
    }

    let rc = misc.base64Md5Checksum(req.body.data, req.body.md5sum)

    if (!rc) {
      return {
        retcode: DEFINE.error.CHECKSUM,
        tips: DEFINE.error.CHECKSUM_TIPS,
      }
    }
    rc = await misc.writeB64ToFile(
      req.body.data,
      conf.cfgGetUserPath(userid),
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

  async upload_url(req) {
    console.log("adpuser.upload_url -> ")

    if (
      !isObject(req.body) ||
      !isString(req.body.filename) ||
      !isString(req.body.data)
    ) {
      return {
        retcode: DEFINE.error.INVALID,
        tips: DEFINE.error.INVALID_TIPS,
      }
    }

    let userid = req.body.filename.substring(
      0,
      req.body.filename.lastIndexOf(".")
    )
    console.log("userid:" + userid)
    if (!userid || !(await dbUser.user_exist(userid))) {
      return {
        retcode: DEFINE.error.NOEXIST,
        tips: DEFINE.error.NOEXIST_TIPS,
      }
    }
    bashiFace.downFaceAndInsert(userid, req.body.data)
    return {
      retcode: DEFINE.error.OK,
    }
  }

  async download(req) {
    console.log("adpuser.upload -> ")

    if (!isObject(req.b64) || !isString(req.body.filename)) {
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
    let userid = body.filename.substring(0, body.filename.lastIndexOf("."))
    let buffer = await misc.readFromFile(
      conf.cfgGetUserPath(userid),
      body.offset,
      body.size
    )

    if (buffer) {
      const stat = await fs.stat(conf.cfgGetUserPath(userid))
      return {
        retcode: DEFINE.error.OK,
        body: {
          filename: body.filename,
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

export default new AdpUser()
