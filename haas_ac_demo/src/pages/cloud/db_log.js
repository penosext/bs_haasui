import sqlite3 from "sqlite3"
import { isString, isNumber, isObject } from "../../utils/util"

class DbLog {
  state = false
  dbf_log = null
  logDb = "/home/walos/public/logdb.db"

  constructor() {
    //cfg有一个default.json作为默认值，
    this.dbf_log = new sqlite3.Database()
    this.dbf_log
      .open(this.logDb)
      .then((res) => {
        if (res === 0) {
          console.log(`---------打开${this.logDb}success--------`)

          let sql = `CREATE TABLE IF NOT EXISTS logr_table(
            seqnum          INTEGER PRIMARY KEY AUTOINCREMENT,
            event           CHAR(32), 
            sync            INTEGER,
            strdata         TEXT,
            create_datetime CHAR(16),
            modify_datetime CHAR(16));`
          return this.dbf_log.exec(sql)
        } else {
          return Promise.reject(
            new Error(`---------打开${this.logDb}fail--------`)
          )
        }
      })
      .then((res) => {
        console.log(res)
        if (res === 0) {
          this.state = true
        } else {
          return Promise.reject(new Error("创建表异常"))
        }
      })
      .catch((err) => {})
  }

  async fini() {
    if (!this.state) {
      return false
    }
    await this.dbf_log.close()
    this.state = false
    return true
  }

  check_state(tips) {
    if (!this.state) {
      if (tips) {
        log.warning("logdb => not initialized")
      } else {
        log.warning(tips + " => logdb not opened")
      }
    } else {
    }

    return this.state
  }

  /**
    日志最大序号
    @returns {Number}
   */
  async max() {
    if (!this.check_state("DBLOG.max")) {
      return 0
    }

    let sqlQuery = `SELECT  MAX(seqnum) FROM logr_table;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
    let queryRes = await stQuery.step()
    await stQuery.finalize()
    if (!Array.isArray(queryRes)) {
      console.log("max : " + queryRes)
      return 0
    } else {
      if (queryRes.length <= 0) {
        return 0
      }
    }
    return queryRes[0]
  }

  /**
    日志最小序号
    @returns {Number}
   */
  async min() {
    if (!this.check_state("DBLOG.min")) {
      return 0
    }

    let sqlQuery = `SELECT MIN(seqnum) FROM logr_table;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
    let queryRes = await stQuery.step()
    await stQuery.finalize()
    if (!Array.isArray(queryRes)) {
      console.log("max : " + queryRes)
      return 0
    } else {
      if (queryRes.length <= 0) {
        return 0
      }
    }
    return queryRes[0]
  }

  /**
    日志数量
    @returns {Number}
   */
  async count() {
    if (!this.check_state("DBLOG.count")) {
      return 0
    }
    let sqlQuery = `SELECT COUNT(*) FROM logr_table;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
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
    添加日志
    @param {Object} logr
    @param {String} logr.event
    @param {Number} logr.sync
    @param {Number} logr.timestamp
    @returns {Boolean}
   */
  async append(logr) {
    if (!this.check_state("DBLOG.append")) {
      return false
    }
    if (!isObject(logr)) {
      return false
    }
    if (!isNumber(logr.sync)) {
      logr.sync = 0
    }
    let strdata = JSON.stringify(logr)

    let sqlInsert =
      "INSERT INTO logr_table(event, sync, strdata, create_datetime, modify_datetime) VALUES(?1, ?2, ?3, ?4, ?5);"
    let stInsert = await this.dbf_log.prepare(sqlInsert)
    await stInsert.bind(
      logr.event,
      logr.sync,
      strdata,
      logr.timestamp + "",
      new Date().getTime() + ""
    )

    let insertRes = await stInsert.run()
    await stInsert.finalize()
    if (insertRes === 0) {
      console.log("log insert success")
      return true
    }

    return false
  }

  /**
    更新日志的同步状态
    @param {Number} timestamp
    @param {Number} sync  0/1
    @returns {Boolean}
   */
  async update(timestamp, sync) {
    if (!this.check_state("DBLOG.update")) {
      return false
    }
    if (!isNumber(timestamp)) {
      return false
    }
    if (!isNumber(sync)) {
      sync = 1
    }
    let sqlInsert =
      "UPDATE logr_table SET sync = ?, modify_datetime = ? WHERE create_datetime = ?;"
    let stInsert = await this.dbf_log.prepare(sqlInsert)
    await stInsert.bind(sync, new Date().getTime() + "", timestamp + "")

    let insertRes = await stInsert.run()
    await stInsert.finalize()
    if (insertRes === 0) {
      console.log("update success")
      return true
    }
  }

  /**
    @param {Number} seqnum
    @returns {Object}
   */
  async lookup(seqnum) {
    if (!this.check_state("DBLOG.lookup")) {
      return null
    }
    if (!isNumber(seqnum) || seqnum < 0) {
      return null
    }
    let sqlQuery = `SELECT * FROM logr_table WHERE seqnum = ?;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
    await stQuery.bind(seqnum)
    let queryRes = await stQuery.step()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("lookup : " + queryRes)
      return null
    } else {
      if (queryRes.length < 6) {
        return null
      }
    }
    const log = JSON.parse(queryRes[3])
    log.seqnum = queryRes[0]
    log.event = queryRes[1]
    log.sync = queryRes[2]
    log.timestamp = parseInt(queryRes[4])

    return log
  }

  /**
    根据时间戳查询日志
    @param {Number} timestamp
    @returns {Object}
   */
  async lookup_ts(timestamp) {
    if (!this.check_state("DBLOG.lookup_ts")) {
      return null
    }
    if (!isNumber(timestamp) || timestamp < 0) {
      return null
    }
    let sqlQuery = `SELECT * FROM logr_table WHERE create_datetime = ?;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
    await stQuery.bind(timestamp + "")
    let queryRes = await stQuery.step()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("lookup : " + queryRes)
      return null
    } else {
      if (queryRes.length < 6) {
        return null
      }
    }
    const log = JSON.parse(queryRes[3])
    log.seqnum = queryRes[0]
    log.event = queryRes[1]
    log.sync = queryRes[2]
    log.timestamp = parseInt(queryRes[4])

    return log
  }

  /**
    根据时间戳删除
    @param {Number} timestamp
    @returns {Boolean}
   */
  async remove(timestamp) {
    if (!this.check_state("DBLOG.remove")) {
      return false
    }
    if (!Number(timestamp)) {
      return false
    }

    let sqlQuery = `DELETE FROM logr_table WHERE create_datetime = ?;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
    await stQuery.bind(timestamp + "")
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }

  /**
    查询
    @param {Number} offset
    @param {Number} limit
    @param {Number} sync 同步状态 0/1 
    @param {String} event 
    @returns {Array}
   */
  async fetch(offset, limit, sync, event) {
    if (!this.check_state("DBLOG.fetch")) {
      return []
    }

    if (!isNumber(offset) || offset < 0) {
      offset = 0
    }
    if (!isNumber(limit) || limit < 0) {
      limit = 10
    }
    if (!isNumber(sync) || sync < 0) {
      sync = -1
    }
    if (!isString(event) || event === "") {
      event = null
    }

    let sqlQuery = `SELECT * FROM logr_table  ${
      sync === 0 || sync === 1 ? "where sync = ?" : ""
    } LIMIT ? OFFSET ?;`
    if (event) {
      sqlQuery = `SELECT * FROM logr_table  where (event = ? ${
        sync === 0 || sync === 1 ? "and sync = ?" : ""
      } ) LIMIT ? OFFSET ?;`
    }
    let stQuery = await this.dbf_log.prepare(sqlQuery)

    if (event) {
      if (sync === 0 || sync === 1) {
        await stQuery.bind(event, sync, limit, offset)
      } else {
        await stQuery.bind(event, limit, offset)
      }
    } else {
      if (sync === 0 || sync === 1) {
        await stQuery.bind(sync, limit, offset)
      } else {
        await stQuery.bind(limit, offset)
      }
    }

    let queryRes = await stQuery.all()
    await stQuery.finalize()

    if (!Array.isArray(queryRes)) {
      console.log("fetch : " + queryRes)
      return []
    } else {
      const logs = []
      queryRes.forEach((item) => {
        if (Array.isArray(item) && item.length == 6) {
          const log = JSON.parse(item[3])
          log.seqnum = item[0]
          log.event = item[1]
          log.sync = item[2]
          log.timestamp = parseInt(item[4])
          logs.push(log)
        }
      })
      return logs
    }
  }

  /**
    删除序号小于指定的日志
    @param {Number} seqnum
    @returns {Boolean}
   */
  async cleanup(seqnum) {
    if (!this.check_state("DBLOG.cleanup")) {
      return false
    }
    if (!isNumber(seqnum) || seqnum <= 0) {
      return false
    }
    let sqlQuery = `DELETE FROM logr_table WHERE seqnum < ?;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
    sqlQuery.bind(seqnum)
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }
  /**
    清空
    @returns {Boolean}
   */
  async clear() {
    if (!this.check_state("DBLOG.clear")) {
      return false
    }
    let sqlQuery = `DELETE FROM logr_table;`
    let stQuery = await this.dbf_log.prepare(sqlQuery)
    let queryRes = await stQuery.run()
    await stQuery.finalize()
    if (queryRes == 0) {
      return true
    } else {
      return false
    }
  }

  async saveAndLookup(uid, name, state, event, ts) {
    let rc = await this.append({
      uid: uid,
      name: name,
      state: state,
      event: event,
      timestamp: ts,
    })
    if (rc) {
      return await this.lookup_ts(ts)
    } else {
      return null
    }
  }
}
export default new DbLog()
