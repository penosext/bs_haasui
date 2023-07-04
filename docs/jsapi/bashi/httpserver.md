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

