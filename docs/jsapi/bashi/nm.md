# 网络

## 1.概述

封装的网络接口

## 2.模块使用方式

```javascript
import { nm } from "nm"
netmanager = new nm()
```

## 3.方法

### 3.1  init 初始化

#### 返回值

- promise 成功0

#### 用法示例

```javascript
netmanager.init()
```

### 3.2  exit 退出

#### 返回值

- promise  成功0

#### 用法示例

```javascript
netmanager.exit()
```

### 3.3 getConfig 获取网络配置

#### 返回值

- promise 成功返回网络配置{”ether“:{},"wifi":{},"lte":{}},参照setConfig的示例
  - ether
    - enable
    - mode
    - ip
    - mask
    - gw
    - dns
    - mac

  - wifi
    - sta_enable
    - sta_ssid
    - sta_passwd
    - ap_enable
    - ap_ssif
    - ap_passwd

  - lte
    - enable


#### 用法示例

```javascript
netmanager.getConfig().then(res=>{
  console.log(res)
}).catch(err=>{})
```

### 3.4 setConfig 设置网络配置

#### 参数

- ether：参照示例
- wifi ：参照示例
- lte：参照示例

#### 返回值

- promise 

#### 用法示例

```javascript
const ether = { enable: 1, mode: 0 }
//动态则mode为1，静态则为0
ether.mode = 1
ether.ip = "192.168.20.10"
ether.mask = "255.255.255.0"
ether.gw = "192.168.20.1"
ether.dns = "192.168.20.1"

const wifi = {}
let mode = "sta"//sta为连接wifi，ap为发出wifi
if (mode == "sta") {
    wifi.sta_enable = 1
    wifi.sta_ssid = "test_sta_wifi"
    wifi.sta_passwd = "12345678"
    wifi.ap_enable = 0
    wifi.ap_ssid = ""
    wifi.ap_passwd = ""
} else if (mode == "ap") {
    wifi.sta_enable = 0
    wifi.sta_ssid = ""
    wifi.sta_passwd = ""
    wifi.ap_enable = 1
    wifi.ap_ssid = "test_ap_wifi"
    wifi.ap_passwd = "123456"
} else {
    wifi.sta_enable = 0
    wifi.sta_ssid = ""
    wifi.sta_passwd = ""
    wifi.ap_enable = 0
    wifi.ap_ssid = ""
    wifi.ap_passwd = ""
}

const lte = {enable = 1}

netmanager.setConfig({
    ether: ether,
    wifi: wifi,
    lte: lte,
}).then(res=>{
    if(res===0){
        //成功
    }
}).catch(err=>{
    
})


```

### 3.5 resetConfig 重置网络配置

#### 返回值

- promise 成功返回0

#### 用法示例

```javascript
netmanager.resetConfig().then(res=>{
  console.log(res)
}).catch(err=>{})
```

### 3.6 restart 重启网络

#### 参数

- 重启网卡类型 ether/wifi/lte

#### 返回值

- promise 

#### 用法示例

```javascript
netmanager.restart("ether").then(res=>{
  console.log(res)
}).catch(err=>{})
```

### 3.7 netinfo 当前网络状态

#### 返回值

- promise 
  - ether
    - enable
    - iface
    - ipaddr

  - sta
    - enable
    - iface
    - ipaddr

  - ap
    - enable
    - iface
    - ipaddr

  - lte
    - enable
    - iface
    - ipaddr


#### 用法示例

```javascript
netmanager.netinfo().then(res=>{
  console.log(res)
}).catch(err=>{})
```

### 3.8 ifconfig ifconfig获取指定网卡ip

#### 参数

- netinfo 获取到的网络iface，若一级确定，也可以写死

#### 返回值

- promise 

#### 用法示例

```javascript
netmanager.ifconfig("eth0").then(res=>{
  console.log(res)
}).catch(err=>{})
```



## 4.简单封装

```javascript
import { nm } from "nm"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"

class Nm {
  netmanager
  constructor() {
    this.netmanager = new nm()
    this.netmanager.init()
  }

  async getAllConfig() {
    const result = await this.netmanager.getConfig()
    return result
  }
  async getAllInfo() {
    const result = await this.netmanager.netinfo()
    return result
  }
  async getIp() {
    let result = await this.getAllInfo()
    if (!isObject(result)) {
      return ""
    }
    // console.log(JSON.stringify(result))
    //以太网-wifi-lte，enable并且有ip
    if (
      isObject(result.ether) &&
      result.ether.enable === 1 &&
      isString(result.ether.ipaddr) &&
      result.ether.ipaddr !== "0.0.0.0"
    ) {
      //以太网
      return ["eth", result.ether.iface, result.ether.ipaddr]
    }

    if (
      isObject(result.sta) &&
      result.sta.enable === 1 &&
      isString(result.sta.ipaddr) &&
      result.sta.ipaddr !== "0.0.0.0"
    ) {
      //wifi
      return ["sta", result.sta.iface, result.sta.ipaddr]
    }

    if (
      isObject(result.lte) &&
      result.lte.enable === 1 &&
      isString(result.lte.ipaddr) &&
      result.lte.ipaddr !== "0.0.0.0"
    ) {
      //lte
      return ["lte", result.lte.iface, result.lte.ipaddr]
    }

    if (
      isObject(result.ap) &&
      result.ap.enable === 1 &&
      isString(result.ap.ipaddr) &&
      result.ap.ipaddr !== "0.0.0.0"
    ) {
      //ap
      return ["ap", result.ap.iface, result.ap.ipaddr]
    }

    return ["unknown", "unknown", "0.0.0.0"]
  }

  //
  async setConfig(info) {
    // console.log(JSON.stringify(info))
    return this.netmanager.setConfig({
      ether: info.ether,
      wifi: info.wifi,
      lte: info.lte,
    })
  }

  restart(type) {
    if (type === "ether" || type === "wifi" || type === "lte") {
      this.netmanager.restart(type)
    }
  }
}

export default new Nm()

```

