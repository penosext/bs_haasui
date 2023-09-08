import sqlite3 from "sqlite3"
import { isString, isNumber, isObject } from "../../utils/util"
import bashiFace from "../face/face"
import face from "../face/face"
class DbUser {
  state = false
  platform = "bashi"
  version = 0 //数据库版本，有字段更新则需编写更新sql
  updateSqlList = {
    //升级的sql语句
    MIGRATION_0_1: "",
  }
  dbf_user = null
  user_max = 30000
  userDb = "/home/walos/public/userdb.db"
  userKeys = {
    keys: [
      "uid",
      "feature",
      "name",
      "desc",
      "idno",
      "effect",
      "expire",
      "create_datetime",
      "modify_datetime",
      "qr",
      "pass",
    ],
    uid: "uid",
    feature: "feature",
    name: "name",
    desc: "desc",
    idno: "idno",
    effect: "effect",
    expire: "expire",
    create_datetime: "create_datetime",
    modify_datetime: "modify_datetime",
    qr: "qr",
    pass: "pass",
  }

  constructor() {
    //cfg有一个default.json作为默认值，
    this.dbf_user = new sqlite3.Database()
    this.dbf_user
      .open(this.userDb)
      .then((res) => {
        if (res === 0) {
          console.log(`---------打开${this.userDb}success--------`)
          //user_table: uid 用户id，add是否添加到算法模块(0,1)，strdata 包含其他杂项
          //card_table: uid cid卡id type类型(ic卡等) hex卡号的hex值 data卡号的base64值
          //rule_table: uid type rid effect expire
          let sql = `CREATE TABLE IF NOT EXISTS user_table(
                        ${this.userKeys.uid}             CHAR(128) PRIMARY KEY NOT NULL,
                        ${this.userKeys.feature}         INTEGER, 
                        ${this.userKeys.name}            CHAR(128),
                        ${this.userKeys.desc}            CHAR(256),
                        ${this.userKeys.idno}            CHAR(128),
                        ${this.userKeys.effect}          INTEGER NOT NULL,
                        ${this.userKeys.expire}          INTEGER NOT NULL,
                        ${this.userKeys.create_datetime} INTEGER,
                        ${this.userKeys.modify_datetime} INTEGER,
                        ${this.userKeys.qr}              TEXT,
                        ${this.userKeys.pass}            CHAR(16));
                    CREATE TABLE IF NOT EXISTS card_table(
                        uid     CHAR(128),
                        cid     TEXT PRIMARY KEY NOT NULL,
                        type    TEXT,
                        hex     TEXT,
                        data    TEXT);
                     CREATE TABLE IF NOT EXISTS rules_table(
                        rule_id  INTEGER PRIMARY KEY AUTOINCREMENT,
                        uid     CHAR(128),
                        type    TEXT,
                        rid     INTEGER,
                        count   INTEGER,
                        cron    TEXT,
                        data    TEXT
                        effect  INTEGER,
                        expire  INTEGER);
                    CREATE TABLE IF NOT EXISTS admin_table(
                        name    CHAR(64) PRIMARY KEY,
                        passwd  CHAR(64),
                        role    CHAR(32));
                    CREATE TABLE IF NOT EXISTS sys_table(
                        version INTEGER PRIMARY KEY,
                        src    CHAR(32));`
          return this.dbf_user.exec(sql)
        } else {
          return Promise.reject(
            new Error(`---------打开${this.userDb}fail--------`)
          )
        }
      })
      .then((res) => {
        console.log(res)
        if (res === 0) {
          this.state = true
          this.admin_insert("admin", "9990BC737DD5B17E7A5F01B48B2C08AE")
          this.checkVersion()
        } else {
          return Promise.reject(new Error("创建表异常"))
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async fini() {
    if (!this.state) {
      return false
    }
    await this.dbf_user.close()
    this.state = false
    return true
  }

  async checkVersion() {
    //先读取，没读到这说明是第一次，写入当前版本号，从0开始
    let sqlQuery = `SELECT * FROM sys_table ORDER BY version DESC LIMIT 1;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    let queryRes = await stQuery.step()
    await stQuery.finalize()

    //判断是否需要升级
    if (!Array.isArray(queryRes) || queryRes.length < 2) {
      console.log("checkVersion : " + queryRes)
      this.updateVersion()
    } else {
      if (queryRes[0] < this.version) {
        for (let i = queryRes[0]; i < this.version; i++) {
          let sql = "MIGRATION_" + i + "_" + (i + 1)
          if (sql) {
            await this.dbf_user.exec(this.updateSqlList[sql])
          }
        }
        this.updateVersion()
      }
    }
  }

  async updateVersion() {
    //更新版本号
    let sqlInsert = `INSERT INTO sys_table VALUES(?, ?);`
    let stInsert = await this.dbf_user.prepare(sqlInsert)
    await stInsert.bind(this.version, this.platform)
    let insertRes = await stInsert.run()
    if (insertRes === 0) {
      return true
    }
  }

  check_state(tips) {
    if (!this.state) {
      if (tips) {
        log.warning("userdb => not initialized")
      } else {
        log.warning(tips + " => userdb not opened")
      }
    } else {
    }

    return this.state
  }

  async user_exist(uid) {
    if (!this.check_state("DBUSER.user_exist")) {
      return false
    }
    if (!isString(uid)) {
      return false
    }

    let sqlQuery = `SELECT * FROM user_table WHERE ${this.userKeys.uid} = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(uid)
    let queryRes = await stQuery.step()
    await stQuery.finalize()
    console.log("user_exist " + uid + ": " + JSON.stringify(queryRes))
    if (!Array.isArray(queryRes)) {
      console.log("user_exist : " + queryRes)
      return false
    } else {
      if (queryRes.length < this.userKeys.keys.length) {
        return false
      }
    }
    return true
  }
  /**
    当前用户数
    @returns {Number}
   */
  async user_count() {
    if (!this.check_state("DBUSER.user_count")) {
      return 0
    }
    let sqlQuery = `SELECT COUNT(*) FROM user_table ;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    let queryRes = await stQuery.step()
    await stQuery.finalize()
    if (!Array.isArray(queryRes)) {
      console.log("user_count : " + queryRes)
      return 0
    } else {
      if (queryRes.length <= 0) {
        return 0
      }
    }
    return queryRes[0]
  }

  /**
    当前用户数有特征的
    @returns {Number}
   */
  async user_count_has_feature() {
    if (!this.check_state("DBUSER.user_count")) {
      return 0
    }
    let sqlQuery = `SELECT COUNT(*) FROM user_table where ${this.userKeys.feature}=1;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    let queryRes = await stQuery.step()
    await stQuery.finalize()
    if (!Array.isArray(queryRes)) {
      console.log("user_count : " + queryRes)
      return 0
    } else {
      if (queryRes.length <= 0) {
        return 0
      }
    }
    return queryRes[0]
  }

  async check_user_max() {
    return (await this.user_count()) < this.user_max
  }

  /**
    用户插入，用户存在时则为更新，更新将全量更新已有字段
    @param {Object} user 用户信息
    @param {String} user.userid 用户id
    @param {String} user.name 用户名
    @param {String} user.hasFeature 用来表示用户特征是否已经成功添加到face模块
    @param {String} user.desc desc
    @param {String} user.idno 身份证号码
    @param {Number} user.effect 生效时间
    @param {Number} user.expire 过期时间
    @param {Number} user.qr 用户二维码 
    @param {Number} user.pass 用户密码 一般6位数字
    @param {Array} user.rules  规则数组
    @param {Array} user.cards 卡数组
    @returns {Boolean}
   */
  async user_insert(user) {
    if (!this.check_state("DBUSER.user_insert")) {
      return false
    }
    if (!isObject(user)) {
      return false
    }
    if (!(await this.check_user_max())) {
      console.log("DBUSER.user_insert -> reach max:" + this.user_max)
      return false
    }

    let ts = new Date().getTime() / 1000

    let sqlInsert =
      "INSERT INTO user_table VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
    let isExist = await this.user_exist(user.userid)
    if (isExist) {
      //update
      sqlInsert = `UPDATE user_table SET 
      ${this.userKeys.name} = ?, 
      ${this.userKeys.feature} = ?,  
      ${this.userKeys.desc} = ?, 
      ${this.userKeys.idno} = ?, 
      ${this.userKeys.effect} = ?,
      ${this.userKeys.expire} = ?, 
      ${this.userKeys.modify_datetime} = ?, 
      ${this.userKeys.qr} = ?, 
      ${this.userKeys.pass} = ? 
      WHERE ${this.userKeys.uid} = ?;`
    }
    let stInsert = await this.dbf_user.prepare(sqlInsert)
    if (isExist) {
      await stInsert.bind(
        user.name || "",
        user.hasFeature ? 1 : 0,
        user.desc || "",
        user.idno || "",
        user.effect,
        user.expire,
        ts,
        user.qr || "",
        user.pass || "",
        user.userid
      )
    } else {
      await stInsert.bind(
        user.userid,
        user.hasFeature ? 1 : 0,
        user.name || "",
        user.desc || "",
        user.idno || "",
        user.effect,
        user.expire,
        ts,
        ts,
        user.qr || "",
        user.pass || ""
      )
    }
    let insertRes = await stInsert.run()
    await stInsert.finalize()
    if (insertRes === 0) {
      console.log("user_insert success")
      // 处理rule和card相关内容

      if (Array.isArray(user.rules) && user.rules > 0) {
        for (let i = 0; i < user.rules.length; i++) {
          const rule = user.rules[i]
          await this.rule_insert(rule, user.userid)
        }
      } else {
        await this.rule_delete(user.userid)
        await this.card_delete(user.userid)
      }

      if (Array.isArray(user.cards) && user.cards > 0) {
        for (let i = 0; i < user.cards.length; i++) {
          const card = user.cards[i]
          await this.card_inserts(card, user.userid)
        }
      } else {
        await this.card_delete(user.userid)
      }

      return true
    }

    return false
  }

  /**
    用户查询
    @param {String} uid 用户id
    @param {Boolean} isrule 是否返回rule相关内容
    @param {Boolean} iscard 是否返回用户卡相关内容
    @param {Boolean} isfeature 是否返回用户特征
    @returns {Object} userinfo
   */
  async user_lookup(uid, isrule, iscard, isfeature) {
    if (!this.check_state("DBUSER.user_lookup")) {
      return null
    }
    if (!isString(uid)) {
      return null
    }
    let sqlQuery = `SELECT * FROM user_table WHERE ${this.userKeys.uid} = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(uid)
    let queryRes = await stQuery.step()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("user_lookup : " + queryRes)
      return null
    } else {
      if (queryRes.length < this.userKeys.keys.length) {
        return null
      }
    }
    const user = {
      userid: queryRes[0],
      hasFeature: queryRes[1] === 1,
      name: queryRes[2],
      desc: queryRes[3],
      idno: queryRes[4],
      effect: queryRes[5],
      expire: queryRes[6],
      qr: queryRes[9],
      pass: queryRes[10],
    }
    user.create = queryRes[7]
    user.modify = queryRes[8]

    // isrule iscard相关
    if (isrule) {
      user.rules = await this.rules_fetch(uid)
    }
    if (iscard) {
      user.cards = await this.card_fetch(uid)
    }
    if (isfeature) {
      // 从face模块获取
      let feature = ""
      try {
        feature = await bashiFace.userGetFeature(uid)
      } catch (error) {}

      user.face = { feature: feature }
    }

    return user
  }

  /**
    用户查询
    @param {String} pass 用户密码
    @param {Boolean} isrule 是否返回rule相关内容
    @param {Boolean} iscard 是否返回用户卡相关内容
    @param {Boolean} isfeature 是否返回用户特征
    @returns {Object} userinfo
   */
  async user_lookup_bypass(pass, isrule, iscard, isfeature) {
    if (!this.check_state("DBUSER.user_lookup_bypass")) {
      return null
    }
    if (!isString(pass)) {
      return null
    }
    let sqlQuery = `SELECT * FROM user_table WHERE ${this.userKeys.pass} = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(pass)
    let queryRes = await stQuery.step()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("user_lookup_bypass : " + queryRes)
      return null
    } else {
      if (queryRes.length < this.userKeys.keys.length) {
        return null
      }
    }
    const user = {
      userid: queryRes[0],
      hasFeature: queryRes[1] === 1,
      name: queryRes[2],
      desc: queryRes[3],
      idno: queryRes[4],
      effect: queryRes[5],
      expire: queryRes[6],
      qr: queryRes[9],
      pass: queryRes[10],
    }
    user.create = queryRes[7]
    user.modify = queryRes[8]

    // isrule iscard相关
    if (isrule) {
      user.rules = await this.rules_fetch(uid)
    }
    if (iscard) {
      user.cards = await this.card_fetch(uid)
    }
    if (isfeature) {
      // 从face模块获取
      let feature = ""
      try {
        feature = await bashiFace.userGetFeature(uid)
      } catch (error) {}

      user.face = { feature: feature }
    }

    return user
  }

  /**
    用户删除
    @param {String} uid 用户id
    @returns {Boolean}
   */
  async user_delete(uid) {
    if (!this.check_state("DBUSER.user_delete")) {
      return false
    }
    if (!isString(uid)) {
      return false
    }

    let sqlQuery = `DELETE FROM user_table WHERE ${this.userKeys.uid} = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(uid)
    let queryRes = await stQuery.run()
    await stQuery.finalize()

    // 删除卡 规则等

    if (queryRes == 0) {
      this.rule_delete(uid)
      this.card_delete(uid)
      return true
    } else {
      return false
    }
  }

  /**
    用户id获取
    @param {Number} offset 
    @param {Number} limit 
    @param {Number} modify 修改时间，用于筛选该时间之前的未修改用户
    @returns {Array} ids
   */
  async user_fetch(offset, limit, modify) {
    if (!this.check_state("DBUSER.user_fetch")) {
      return []
    }
    if (!isNumber(offset) || offset < 0) {
      offset = 0
    }
    if (!isNumber(limit) || limit < 0) {
      limit = 10
    }

    const uids = []

    let sqlQuery = `SELECT ${this.userKeys.uid} FROM user_table LIMIT ? OFFSET ?;`
    if (isNumber(modify)) {
      sqlQuery = `SELECT ${this.userKeys.uid} FROM user_table where ${this.userKeys.modify_datetime} < ? LIMIT ? OFFSET ?;`
    }

    let stQuery = await this.dbf_user.prepare(sqlQuery)
    if (isNumber(modify)) {
      await stQuery.bind(modify, limit, offset)
    } else {
      await stQuery.bind(limit, offset)
    }
    let queryRes = await stQuery.all()
    await stQuery.finalize()
    if (!Array.isArray(queryRes)) {
      console.log("user_fetch : " + queryRes)
      return uids
    } else {
      queryRes.forEach((element) => {
        if (Array.isArray(element) && element.length == 1) {
          uids.push(element[0])
        }
      })
      return uids
    }
  }

  /**
    查询用户详情
    @param {Number} offset
    @param {Number} limit
    @param {Boolean} isrule 是否返回rule相关内容
    @param {Boolean} iscard 是否返回用户卡相关内容
    @param {Boolean} isfeature 是否返回用户特征
    @returns
   */
  async user_fetch_data(offset, limit, isrule, iscard, isfeature) {
    if (!this.check_state("DBUSER.user_fetch_data")) {
      return []
    }
    if (!isNumber(offset) || offset < 0) {
      offset = 0
    }
    if (!isNumber(limit) || limit < 0) {
      limit = 10
    }

    let sqlQuery = `SELECT * FROM user_table LIMIT ? OFFSET ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(limit, offset)
    let queryRes = await stQuery.all()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("user_fetch_data : " + queryRes)
      return []
    } else {
      const users = []
      for (let index = 0; index < queryRes.length; index++) {
        const item = queryRes[index]
        if (Array.isArray(item) && item.length == this.userKeys.keys.length) {
          const user = {
            userid: item[0],
            hasFeature: item[1] === 1,
            name: item[2],
            desc: item[3],
            idno: item[4],
            effect: item[5],
            expire: item[6],
            qr: item[9],
            pass: item[10],
          }
          user.create = item[7]
          user.modify = item[8]
          // isrule iscard相关
          if (isrule) {
            user.rules = await this.rules_fetch(uid)
          }
          if (iscard) {
            user.cards = await this.card_fetch(uid)
          }
          if (isfeature) {
            // 从face模块获取
            user.face = { feature: await face.userGetFeature(uid) }
          }
          users.push(user)
        }
      }
      return users
    }
  }

  /**
    更新用户特征的状态--lookup再insert
    @param {String} uid
    @param {Boolean} hasFeature 更新用户的feature状态，是否添加到face模块成功
    @returns {Boolean}
   */
  async user_update_face(uid, hasFeature) {
    if (!this.check_state("DBUSER.user_update_face")) {
      return false
    }

    const user = await this.user_lookup(uid)
    if (!isObject(user)) {
      console.log("DBUSER.user_update_face -> user not exist:" + uid)
      return false
    }

    user.hasFeature = hasFeature
    return this.user_insert(user)
  }

  async user_clear() {
    if (!this.check_state("DBUSER.user_clear")) {
      return false
    }
    let sqlQuery = `DELETE FROM user_table;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      await this.rule_clear()
      await this.card_clear()
      return true
    } else {
      return false
    }
  }

  /**
    用户规则插入，不存在更新，只有插入和删除
    @param {Object} rule
    @param {String} userid 用户id
    @param {Number} rule.type 类型 支持1计数 2cron 4梯控
    @param {Number} user.count 计数时用
    @param {String} user.cron cron时用
    @param {String} user.data 其它形式时使用
    @param {Number} user.effect 生效时间
    @param {Number} user.expire 过期时间
    @param {Number} user.rid  规则序号
    @returns {Boolean}
   */
  async rule_insert(rule, userid) {
    if (!this.check_state("DBUSER.rule_insert")) {
      return false
    }
    if (!isObject(rule)) {
      return false
    }

    let sqlInsert =
      "INSERT INTO rules_table(uid,type,rid,count,cron,data,effect,expire) VALUES(?, ?, ?, ?, ?, ?, ?, ?);"
    let stInsert = await this.dbf_user.prepare(sqlInsert)
    await stInsert.bind(
      userid,
      rule.type,
      rule.rid,
      rule.count || 0,
      rule.cron || "",
      rule.data || "",
      rule.effect,
      rule.expire
    )

    let insertRes = await stInsert.run()
    await stInsert.finalize()
    if (insertRes === 0) {
      console.log("rule_insert success")
      return true
    }

    return false
  }

  /**
    用户规则删除
    @param {String} uid 用户id
    @returns {Boolean}
   */
  async rule_delete(uid) {
    if (!this.check_state("DBUSER.rule_delete")) {
      return false
    }
    if (!isString(uid)) {
      return false
    }

    let sqlQuery = `DELETE FROM rules_table WHERE uid = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(uid)
    let queryRes = await stQuery.run()
    await stQuery.finalize()

    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }

  /**
    查询用户规则列表
    @param {String} userid 是否返回用户特征
    @returns
   */
  async rules_fetch(userid) {
    if (!this.check_state("DBUSER.rules_fetch")) {
      return []
    }
    if (!isString(userid) || userid === "") {
      return []
    }

    let sqlQuery = `SELECT * FROM rules_table where uid = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(userid)
    let queryRes = await stQuery.all()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("rules_fetch : " + queryRes)
      return []
    } else {
      const rules = []
      queryRes.forEach((item) => {
        if (Array.isArray(item) && item.length == 9) {
          const rule = {
            type: item[2],
            rid: item[3],
            effect: item[7],
            expire: item[8],
          }
          if (rule.type === 1) {
            rule.count = item[4]
          } else if (rule.type === 2) {
            rule.cron = item[5]
          } else if (rule.type === 4) {
            rule.data = item[6]
          }

          rules.push(rule)
        }
      })
      return rules
    }
  }

  async rule_clear() {
    if (!this.check_state("DBUSER.rule_clear")) {
      return false
    }
    let sqlQuery = `DELETE FROM rules_table;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }

  /**
    用户卡插入，不存在更新，只有插入和删除
    @param {Object} card
    @param {String} userid 用户id
    @param {Number} card.id 卡id
    @param {Number} card.type 卡类型
    @param {String} card.hex 卡hex值
    @param {String} card.data 卡其他类型的值
    @returns {Boolean}
   */
  async card_insert(card, userid) {
    if (!this.check_state("DBUSER.card_insert")) {
      return false
    }
    if (!isObject(card)) {
      return false
    }

    let sqlInsert = "INSERT INTO card_table VALUES(?, ?, ?, ?, ?);"
    let stInsert = await this.dbf_user.prepare(sqlInsert)
    await stInsert.bind(
      userid,
      card.id,
      card.type || "ic",
      card.hex || "",
      card.data || ""
    )

    let insertRes = await stInsert.run()
    await stInsert.finalize()
    if (insertRes === 0) {
      console.log("card_insert success")
      return true
    }

    return false
  }

  /**
    查询用户卡列表
    @param {String} userid
    @returns
   */
  async card_fetch(userid) {
    if (!this.check_state("DBUSER.card_fetch")) {
      return []
    }
    if (!isString(userid) || userid === "") {
      return []
    }

    let sqlQuery = `SELECT * FROM card_table where uid = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(userid)
    let queryRes = await stQuery.all()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("card_fetch : " + queryRes)
      return []
    } else {
      const cards = []
      queryRes.forEach((item) => {
        if (Array.isArray(item) && item.length == 5) {
          const card = {
            id: item[1],
            type: item[2],
            hex: item[3],
            data: item[4],
          }

          cards.push(card)
        }
      })
      return cards
    }
  }

  /**
    查询用户卡
    @param {String} hex
    @returns
   */
  async card_lookup(hex) {
    if (!this.check_state("DBUSER.card_lookup")) {
      return null
    }
    if (!isString(hex) || hex === "") {
      return null
    }

    let sqlQuery = `SELECT * FROM card_table where hex = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(hex)
    let queryRes = await stQuery.step()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("card_lookup : " + queryRes)
      return null
    } else {
      if (queryRes.length < 5) {
        return null
      }
    }

    const card = {
      userid: queryRes[0],
      id: queryRes[1],
      type: queryRes[2],
      hex: queryRes[3],
      data: queryRes[4],
    }

    return card
  }

  /**
    用户卡删除
    @param {String} uid 用户id
    @returns {Boolean}
   */
  async card_delete(uid) {
    if (!this.check_state("DBUSER.card_delete")) {
      return false
    }
    if (!isString(uid)) {
      return false
    }

    let sqlQuery = `DELETE FROM card_table WHERE uid = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(uid)
    let queryRes = await stQuery.run()
    await stQuery.finalize()

    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }

  async card_clear() {
    if (!this.check_state("DBUSER.card_clear")) {
      return false
    }
    let sqlQuery = `DELETE FROM card_table;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }

  async admin_insert(name, passwd) {
    if (!this.check_state("DBUSER.admin_insert")) {
      return false
    }
    let admin = await this.admin_lookup(name)
    let sqlInsert = `INSERT INTO admin_table VALUES(?, ?, ?);`
    if (admin != null) {
      sqlInsert = `UPDATE admin_table SET passwd = ? WHERE name = ?;`
    }
    let stInsert = await this.dbf_user.prepare(sqlInsert)
    if (admin != null) {
      await stInsert.bind(passwd, name)
    } else {
      await stInsert.bind(name, passwd, "admin")
    }
    let insertRes = await stInsert.run()
    if (insertRes === 0) {
      console.log("admin_insert success")
      return true
    }
    return false
  }

  async admin_lookup(name) {
    if (!this.check_state("DBUSER.admin_lookup")) {
      return null
    }
    if (!isString(name)) {
      return null
    }
    let sqlQuery = `SELECT * FROM admin_table WHERE name = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(name)
    let queryRes = await stQuery.step()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("admin_lookup : " + queryRes)
      return null
    } else {
      if (queryRes.length < 3) {
        return null
      }
    }
    const admin = {}
    admin.name = queryRes[0]
    admin.passwd = queryRes[1]
    // console.log(JSON.stringify(admin))
    return admin
  }

  async admin_delete(name) {
    if (!this.check_state("DBUSER.admin_delete")) {
      return false
    }
    if (!isString(name)) {
      return false
    }

    let sqlQuery = `DELETE FROM admin_table WHERE name = ?;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    await stQuery.bind(name)
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }

  async admin_clear() {
    if (!this.check_state("DBUSER.admin_clear")) {
      return false
    }

    let sqlQuery = `DELETE FROM admin_table ;`
    let stQuery = await this.dbf_user.prepare(sqlQuery)
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }
}
export default new DbUser()
