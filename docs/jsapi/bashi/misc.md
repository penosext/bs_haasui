# 其它杂项

  1.概述

封装的其它接口

## 2.模块使用方式

```javascript
import { misc } from "misc"
```

## 3.方法

### 3.1  reboot 重启

#### 返回值

- 0

#### 用法示例

```javascript
misc.reboot()
```

### 3.2  chipid 获取设备唯一id

#### 返回值

- promise 

#### 用法示例

```javascript
misc.chipid().then(res=>{
  console.log(res.cid)
}).catch(err=>{})
```

### 3.3 gbk_to_utf8 gbk字符串转为utf8

#### 参数

- input ：输入字符串

#### 返回值

- promise 

#### 用法示例

```javascript
misc.gbk_to_utf8({input:""}).then(res=>{
  console.log(res.output)
}).catch(err=>{})
```

### 3.4 utf8_to_gbk utf8字符串转为gbk

#### 参数

- input ：输入字符串

#### 返回值

- promise 

#### 用法示例

```javascript
misc.utf8_to_gbk({input:""}).then(res=>{
  console.log(res.output)
}).catch(err=>{})
```

## 4.简单封装

```javascript
import { wfs } from "wfs"
import { misc } from "misc"
import { time } from "time"
import fs from "fs"
import { Base64 } from "js-base64"
import md5 from "js-md5"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"
import mGpio from "../gpio/gpio"
import conf from "../conf/conf"
import { DEFINE } from "../../utils/define"

class Misc {
    doorTimer = 0
    delay = 3

    constructor() {
        this.delay = 3
    }
    //从配置文件中读取当前app的路径
    async readAppPath(appid) {
        const ret = await fs.readFile(
            "/data/miniapp/data/mini_app/pkg/packages.json"
        )
        if (ret) {
            const packages = JSON.parse(ret)
            if (isObject(packages) && Array.isArray(packages.packages)) {
                for (let index = 0; index < packages.packages.length; index++) {
                    const element = packages.packages[index]
                    if (isObject(element) && element.appid === appid) {
                        return element.installPath
                    }
                }
            }
        }
    }
    async writeB64ToFile(b64, path, offset) {
        if (!isString(b64)) {
            return false
        }
        if (!isNumber(offset) || offset < 0) {
            offset = 0
        }
        const f = new wfs()
        let mode = "wb"
        if (offset > 0) {
            mode = "ab"
        }
        let ret = await f.open({ filename: path, mode: mode })
        if (ret === 0) {
            console.log(`open ${path} success`)
            ret = await f.write_bin(Base64.toUint8Array(b64))
            if (ret === 0) {
                console.log(`write ${path} success`)
                f.close()
                return true
            } else {
                console.log(`write ${path} fail`)
                f.close()
                return false
            }
        } else {
            console.log(`open ${path} fail`)
            f.close()
            return false
        }
    }
    async readFromFile(path, offset, size) {
        if (!isNumber(offset) || offset < 0) {
            offset = 0
        }
        if (!isNumber(size) || size <= 0) {
            size = 10000
        }
        const f = new wfs()
        let ret = await f.open({ filename: path, mode: "rb" })
        if (ret === 0) {
            console.log(`open ${path} success`)
            if (offset > 0) {
                await f.fseek({ offset: offset, whence: 0 })
            }
            let data = await f.read({ size: size })
            if (data == 0) {
                f.close()
                return null
            }
            console.log(`read ${path} success`)
            return data
        } else {
            return null
        }
    }
    bufferToBase64(buffer) {
        console.log("bufferToBase64")
        return Base64.fromUint8Array(new Uint8Array(buffer))
    }
    toHexString(bytes) {
        return bytes.reduce(
            (str, byte) => str + byte.toString(16).padStart(2, "0"),
            ""
        )
    }
    base64ToHex(str) {
        console.log(str)
        let bin = Base64.toUint8Array(str)

        return this.toHexString(bin)
    }
    hexToBase64(hex) {
        console.log(hex)
        const fromHexString = (hexString) =>
        new Uint8Array(
            hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
        )
        return Base64.fromUint8Array(fromHexString(hex))
    }
    base64Md5Checksum(b64, m5) {
        if (!isString(m5)) {
            return true
        }
        let bin = Base64.toUint8Array(b64)
        let chksum = md5(bin)
        if (chksum && chksum.toUpperCase() === m5) {
            return true
        }
        return false
    }
    stringToUint8Array(str) {
        var arr = []
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i))
        }

        var tmpUint8Array = new Uint8Array(arr)
        return tmpUint8Array
    }
    uint8ArrayToString(data) {
        return String.fromCharCode.apply(null, data)
    }
    setTipsDealy(delay) {
        this.delay = delay
    }
    //开门，继电器动作，延迟几秒关门
    openDoor(isOpen, delay) {
        if (this.doorTimer) {
            clearTimeout(this.doorTimer)
        }

        if (isOpen) {
            mGpio.write(mGpio.GPIO.RELAY, mGpio.LEVEL.GPIO_HIGH)
            this.doorTimer = setTimeout(() => {
                mGpio.write(mGpio.GPIO.RELAY, mGpio.LEVEL.GPIO_LOW)
            }, (delay || this.delay) * 1000)
        } else {
            mGpio.write(mGpio.GPIO.RELAY, mGpio.LEVEL.GPIO_LOW)
        }
    }
    reboot() {
        misc.reboot()
    }
    setUtc(ts) {
        if (!isNumber(ts)) {
            return false
        }

        time.setUTC({ utc: ts })
    }
    //获取系统运行时间
    getSystemRunTime() {
        return time.uptime()
    }
    //判断用户权限
    async checkUserPermission(userFound) {
        let now = new Date().getTime() / 1000
        console.log("new Date().getTime()/1000:" + now)
        console.log(JSON.stringify(userFound))
        if (now < userFound.effect) {
            //未到生效时间
            return [false, DEFINE.log.STATE_DISABLE, "未生效用户"]
        } else {
            if (userFound.expire == -1 || userFound.expire > now) {
                //有效期内
                if (Array.isArray(userFound.rules) && userFound.rules.length > 0) {
                    // -- 目前仅支持时间区间
                    let ispass = false

                    for (let index = 0; index < userFound.rules.length; index++) {
                        const rule = userFound.rules[index]
                        if (!ispass) {
                            if (rule.type == 0) {
                                if (
                                    now > rule.effect &&
                                    (rule.expire == -1 || rule.expire > now)
                                ) {
                                    ispass = true
                                }
                            } else if (rule.type == 2) {
                                if (
                                    now > rule.effect &&
                                    (rule.expire == -1 || rule.expire > now) &&
                                    (await this.checkIsNowIncron(rule.cron))
                                ) {
                                    ispass = true
                                }
                            } else {
                            }
                        }
                    }

                    if (ispass) {
                        return [true, DEFINE.log.STATE_SUCCESS, userFound.name]
                    } else {
                        return [false, DEFINE.log.STATE_DISABLE, "无有效权限"]
                    }
                } else {
                    return [true, DEFINE.log.STATE_SUCCESS, userFound.name]
                }
            } else {
                return [false, DEFINE.log.STATE_PER_OUT, "过期用户"]
            }
        }
    }
    //此方法目前只兼容 分 时 日 月 周 并且是数字格式的规则
    async checkIsNowIncron(cron) {
        //判断当前时间是否再cron规则范围内
        //cron规则 分 时 日 月 周
        //先判断月，再判断周，再判断日，再判断时，在判断分
        if (!isString(cron)) {
            return false
        }
        let tz = await conf.cfgGetInt(DEFINE.configCommon.timeZone)
        let now = new Date(Date.now() - tz * 60 * 1000)
        console.log(now)
        const cronList = cron.split(" ")
        if (!Array.isArray(cronList) || cronList.length < 5) {
            return false
        }
        // console.log("cronList:" + JSON.stringify(cronList))
        let isMonth = false
        let monsList = cronList[3].split(",")
        if (!Array.isArray(monsList) || monsList.length < 1) {
            return false
        }

        let nowMonth = now.getMonth() + 1
        for (let index = 0; index < monsList.length; index++) {
            const item = monsList[index]
            if (item === "*") {
                isMonth = true
            } else if (nowMonth + "" === item) {
                isMonth = true
            } else {
                let list2 = item.split("-")
                if (Array.isArray(list2) && list2.length === 2) {
                    let start = parseInt(list2[0])
                    let end = parseInt(list2[1])
                    if (nowMonth >= start && nowMonth <= end) {
                        isMonth = true
                    }
                }
            }
        }
        // console.log("isMonth:" + isMonth)
        if (isMonth === false) {
            return false
        }

        let isWeek = false
        let weeksList = cronList[4].split(",")
        if (!Array.isArray(weeksList) || weeksList.length < 1) {
            return false
        }

        let nowWeek = now.getDay()
        for (let index = 0; index < weeksList.length; index++) {
            const item = weeksList[index]
            if (item === "*") {
                isWeek = true
            } else if (nowWeek + "" === item) {
                isWeek = true
            } else {
                let list2 = item.split("-")
                if (Array.isArray(list2) && list2.length === 2) {
                    let start = parseInt(list2[0])
                    let end = parseInt(list2[1])
                    if (nowWeek >= start && nowWeek <= end) {
                        isWeek = true
                    }
                }
            }
        }
        // console.log("isWeek:" + isWeek)
        if (isWeek === false) {
            return false
        }

        let isDay = false
        let daysList = cronList[2].split(",")
        if (!Array.isArray(daysList) || daysList.length < 1) {
            return false
        }

        let nowDay = now.getDate()
        for (let index = 0; index < daysList.length; index++) {
            const item = daysList[index]
            if (item === "*") {
                isDay = true
            } else if (nowDay + "" === item) {
                isDay = true
            } else {
                let list2 = item.split("-")
                if (Array.isArray(list2) && list2.length === 2) {
                    let start = parseInt(list2[0])
                    let end = parseInt(list2[1])
                    if (nowDay >= start && nowDay <= end) {
                        isDay = true
                    }
                }
            }
        }
        // console.log("isDay:" + isDay)
        if (isDay === false) {
            return false
        }

        let isHour = false
        let hoursList = cronList[1].split(",")
        if (!Array.isArray(hoursList) || hoursList.length < 1) {
            return false
        }

        let nowHour = now.getHours()
        for (let index = 0; index < hoursList.length; index++) {
            const item = hoursList[index]
            if (item === "*") {
                isHour = true
            } else if (nowHour + "" === item) {
                isHour = true
            } else {
                let list2 = item.split("-")
                if (Array.isArray(list2) && list2.length === 2) {
                    let start = parseInt(list2[0])
                    let end = parseInt(list2[1])
                    if (nowHour >= start && nowHour <= end) {
                        isHour = true
                    }
                }
            }
        }
        // console.log("isHour:" + isHour)
        if (isHour === false) {
            return false
        }

        let isMin = false
        let minsList = cronList[0].split(",")
        if (!Array.isArray(minsList) || minsList.length < 1) {
            return false
        }

        let nowMin = now.getMinutes()
        for (let index = 0; index < minsList.length; index++) {
            const item = minsList[index]
            if (item === "*") {
                isMin = true
            } else if (nowMin + "" === item) {
                isMin = true
            } else {
                let list2 = item.split("-")
                if (Array.isArray(list2) && list2.length === 2) {
                    let start = parseInt(list2[0])
                    let end = parseInt(list2[1])
                    if (nowMin >= start && nowMin <= end) {
                        isMin = true
                    }
                }
            }
        }
        // console.log("isMin:" + isMin)
        if (isMin === false) {
            return false
        }

        return true
    }
}

export default new Misc()

```

