# **httpserver**

## 1.概述

封装了简单http_server

## 2.模块使用方式

```javascript
import { httpserver } from "httpserver"
let htpd = new httpserver()
```

## 3.方法

### 3.1 init

#### 参数

- port ： 监听端口

#### 返回值

- promise 

#### 用法示例

```javascript
htpd
  .init({ port: port })
  .then((res) => {
    console.log(JSON.stringify(res))
  })
  .catch((err) => {
    console.log(err)
  })
```

### 3.2 .on("request") 

#### 用法示例

```javascript
htpd.on("request", (res) => {
  console.log(JSON.stringify(res))
  // this.webapi_handler(res.req, res.path, res.data)
})
```

### 3.3 find_header 

#### 参数

- req ： 来自[3.2](jsapi/bashi/httpserver?id=_32-onquotrequestquot)的res.req
- dir :  0是输入的header，1是输出的header
- key ： header的key

#### 返回值

- string / null 

#### 用法示例

```javascript
let value = htpd.find_header({ req: req, dir: 0, key: "Token" })
console.log(value)
```

### 3.4 add_header

#### 参数

- req ： 来自[3.2](jsapi/bashi/httpserver?id=_32-onquotrequestquot)的res.req
- dir :  0是输入的header，1是输出的header
- key ： header的key
- val : header的value

#### 返回值

- 0

#### 用法示例

```javascript
let rc = htpd.add_header({ req: req, dir: 1, key: "Token",val: "1"})
console.log(rc)
```



### 3.5 remove_header

#### 参数

- req ： 来自[3.2](jsapi/bashi/httpserver?id=_32-onquotrequestquot)的res.req
- dir :  0是输入的header，1是输出的header
- key ： header的key

#### 返回值

- 0

#### 用法示例

```javascript
let rc = htpd.remove_header({ req: req, dir: 1, key: "Token"})
console.log(rc)
```

### 3.6 clear_header

#### 参数

- req ： 来自[3.2](jsapi/bashi/httpserver?id=_32-onquotrequestquot)的res.req
- dir :  0是输入的header，1是输出的header

#### 返回值

- 0

#### 用法示例

```javascript
let rc = htpd.clear_header({ req: req, dir: 1})
console.log(rc)
```

### 3.6 send_reply

#### 参数

- req ： 来自[3.2](jsapi/bashi/httpserver?id=_32-onquotrequestquot)的res.req
- data 

#### 返回值

- promise 成功0，失败抛出异常

#### 用法示例

```javascript
htpd.send_reply({
  req: req,
  data: JSON.stringify({"data":"data"}),
})
```

## 4.简单示例

```javascript
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

```

