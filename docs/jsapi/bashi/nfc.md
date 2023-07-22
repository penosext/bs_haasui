# **NFC**

## 1.概述

封装了刷卡等相关的使用

## 2.模块使用方式

```javascript
import { ytwl } from "nfc"
this.ytwl = new ytwl()
```

## 3.ytwl模块,默认刷卡模块，其它模块待定义

### 3.1 init

#### 参数

- port ： 串口号 2，3

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
this.ytwl.init({
  port: 3,
})
```

### 3.1 on("cardid")监听刷卡回调

#### 用法示例

```javascript
toHexString(bytes) {
    return bytes.reduce(
      (str, byte) => str + byte.toString(16).padStart(2, "0"),
      ""
    )
  }

this.ytwl.on("cardid", (res) => {
  console.log("cardid read")
  let hex = this.toHexString(new Uint8Array(res))
})
```

## 4.简单封装

```javascript
import { isString, isNumber, isObject } from "../../utils/util"
import { ytwl } from "nfc"
import misc from "../misc/misc"

class Card {
    card
    isInit = false
lastCard = ""

constructor() {
    this.card = new ytwl()
}

init(port, cb) {
    if (this.isInit) {
        return
    }
    this.card.on("cardid", (res) => {
        console.log("cardid read")
        let hex = misc.toHexString(new Uint8Array(res))
        console.log(hex)
        cb(hex)
    })
    this.card.init({
        port: port,
    })
    this.isInit = true
}

readLastCard() {
    if (this.isInit) {
        return this.lastCard
    }
    return ""
}
}

export default new Card()

```

