import { wfs } from "wfs"
import { wdt } from "wdt"
import fs from "fs"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"
import { DEFINE } from "../../utils/define"
import conf from "../conf/conf"

class Wdt {
  isInit = false
  constructor() {}

  async init() {
    if (this.isInit) {
      return
    }
    let next = 0
    let path = "/home/walos/wdt_reboot_num"
    // 读文件，有值 是debug或者-1，不执行，是数字，大于等于5，不再重启，小于5则加1，继续初始化
    const isExist = await fs.exists(path)
    if (isExist) {
      const readResult = await fs.readFile(path)
      console.log("readResult:" + readResult)
      if (readResult === "debug" || readResult === "-1") {
        this.isInit = true
        return
      }
      let readResult_int = parseInt(readResult)
      console.log("readResult_int:" + readResult_int)
      // console.log("isNumber(readResult_int):" + isNumber(readResult_int))
      // console.log(
      //   "Number.isNaN(readResult_int):" + Number.isNaN(readResult_int)
      // )
      if (!isNumber(readResult_int) || Number.isNaN(readResult_int)) {
        console.log("readResult_int === NaN")
        next = 0
      } else {
        if (readResult_int >= 3 || readResult_int < 0) {
          this.isInit = true
          return
        }
        next = readResult_int + 1
        console.log("next:" + next)
      }
    }
    const f = new wfs()
    let ret = await f.open({ filename: path, mode: "wb" })
    if (ret === 0) {
      console.log(`open ${path} success`)
      ret = await f.write_txt(next + "")
      if (ret === 0) {
        console.log(`write ${path} success`)
        f.close()
      } else {
        console.log(`write ${path} fail`)
        f.close()
      }
    } else {
      console.log(`open ${path} fail`)
      f.close()
    }

    // 初始化wdt
    ret = wdt.autorun()
    if (ret === 0) {
      // setInterval(() => {
      // wdt.feed()
      // console.log("feed")
      // }, 1000)
    }

    setTimeout(async () => {
      //30s之后重置为0
      const f = new wfs()
      let ret = await f.open({ filename: path, mode: "wb" })
      if (ret === 0) {
        console.log(`open ${path} success`)
        ret = await f.write_txt("0")
        if (ret === 0) {
          console.log(`write ${path} success`)
          f.close()
        } else {
          console.log(`write ${path} fail`)
          f.close()
        }
      } else {
        console.log(`open ${path} fail`)
        f.close()
      }
    }, 30 * 1000)
  }
}

export default new Wdt()
