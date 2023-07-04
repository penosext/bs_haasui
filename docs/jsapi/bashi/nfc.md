# **NFC**

## 1.概述

封装了刷卡等相关的使用

## 2.模块使用方式

```javascript
import { ytwl } from "nfc"
this.ytwl = new ytwl()
```

## 3.ytwl方法,云梯物联刷卡模块

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

