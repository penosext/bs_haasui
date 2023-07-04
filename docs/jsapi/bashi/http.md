# **http**

## 1.概述

封装了简单http请求

## 2.模块使用方式

```javascript
import { http } from "http"
```

## 3.方法

### 3.1 request 普通请求

#### 参数

- url ： 请求地址
- method ： 请求类型 GET POST
- headers ： 请求头，形如["Content-Type:application/json"]
- data :  数据，如post的body，get的query请求需自行拼接
- timeout ： 超时，秒

#### 返回值

- promise 

#### 用法示例

```javascript
http
  .request({
    url: 'https://www.baidu.com',
    method: "GET",
    headers: ["test-head:test"],
    timeout: 5,
  }).then(res=>{
    console.log(JSON.stringify(res))
  }).catch(err=>{
    console.log(err)
  })
```

### 3.2 download 下载

#### 参数

- url ： 请求地址
- method ： 请求类型 GET POST
- headers ： 请求头，形如["Content-Type:application/json"]
- data :  数据，如post的body，get的query请求需自行拼接
- timeout ： 超时，秒
- filename ：下载文件的保存地址

#### 返回值

- promise 

#### 用法示例

```javascript
let token = http.on("progress", (res) => {
  console.log("progress:" + res.percent + "%")
})
http
  .request({
    url: 'https://www.baidu.com',
    method: "GET",
    headers: ["Content-Type:application/octet-stream"],
    timeout: 30,
    filename："/home/walos/baidu.txt"
  }).then(res=>{
    console.log(JSON.stringify(res))
    http.off(token)
  }).catch(err=>{
    console.log(err)
    http.off(token)
  })
```

