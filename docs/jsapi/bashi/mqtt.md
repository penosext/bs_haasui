# mqtt

## 1.概述

封装了mqtt的使用

## 2.模块使用方式

```javascript
import { mqtt, mqttcli } from "mqtt"
```

## 3.mqtt方法

### 3.1 init 初始化mqtt 调用完成才可以继续初始化mqttcli

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mqtt
  .init()
  .then((res) => {
    console.log("init mqtt success")
  })
  .catch((err) => {
    //初始化mqtt失败
    console.log("init mqtt fail")
  })
```

## 4.mqttcli方法

```javascript
let cli = new mqttcli()
```

### 4.1 init 初始化mqttcli

#### 参数

- cid ： client_id
- username ： 
- passwd ：
- debug ：1则打印更多dbug信息

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
cli
  .init({
    cid: "test_client_id",
    username: "test_user",
    passwd: "test_passwd",
    debug: 1,
  })
  .then((res) => {
    console.log("cli init :"+ret)
  })
  .catch((err) => {
    console.log("cli init err", err)
  })
```

### 4.2 on监听,字面意思

```javascript
cli.on("connect", (res) => {
  console.log("onconnect")
})
cli.on("disconnect", (res) => {
  console.log("disconnect")
})
cli.on("publish", (res) => {
  console.log("publish")
})
cli.on("subscribe", (res) => {
  console.log("subscribe")
})
cli.on("unsubscribe", (res) => {
  console.log("unsubscribe")
})
cli.on("message", (res) => {
  console.log("onmessage: from:" + res.topic + " payload:" + res.payload)
})
```

### 4.3 do_connect

#### 参数

- host ： mqtt地址
- port ： 端口
- keepalive ：

#### 返回值

- promise 成功0 失败抛出异常，失败后自行重试

#### 用法示例

```javascript
this.cli
  .do_connect({
    host: "broker.emqx.io",
    port: 1883,
    keepalive: 10,
  })
  .then((res) => {
    //连接完成，连接完成后断线会自动重连
    console.log("do_connect success")
  })
  .catch((err) => {
    //连接失败需手动重试
    console.log("connect err", err)
  })
```

### 4.4 do_subcribe

#### 参数

- topic 
- qos 

#### 返回值

- promise 成功0,同时on("subscribe")可收到回调， 失败抛出异常

#### 用法示例

```javascript
cli.do_subcribe({
  topic: "haas/test_sub",
  qos: 0,
})
```

### 4.5 do_unsubcribe

#### 参数

- topic  

#### 返回值

- promise 成功0,同时on("unsubscribe")可收到回调， 失败抛出异常

#### 用法示例

```javascript
cli.do_unsubcribe({
  topic: "haas/test_sub",
})
```

### 4.6 do_publish

#### 参数

- topic 
- payload
- qos
- retain

#### 返回值

- promise 成功0,同时on("publish")可收到回调， 失败抛出异常

#### 用法示例

```javascript
cli.do_publish({ topic: "haas/test_pub", payload: "112233") })
```

### 4.7 do_disconnect 手动断开连接，不会自动重连

#### 返回值

- promise 成功0,同时on("disconnect")可收到回调， 失败抛出异常

#### 用法示例

```javascript
cli.do_disconnect()
```

### 4.8 do_config

#### 参数

- protocol 
- debug 
- username
- passwd

#### 返回值

- promise 成功0， 失败抛出异常

#### 用法示例

```javascript
cli.do_config({
  debug: 1,
  username: "test_newuser",
  passwd: "test_new_pass",
})
```

