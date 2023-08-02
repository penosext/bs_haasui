# 算法

## 1.概述

提供算法的js封装，方便使用

## 2.模块使用方式

```javascript
import { jzface } from "face"
let face = new jzface()
```

## 3.方法

### 3.1  init 初始化

#### 参数

- model ： 人脸模型路径
- sn ： 算法sn
- database ： 算法数据库保存路径，确保可访问，文件不需要存在。特征等信息之后都在这里面，比较重要
- minface ： 最小人脸大小
- livescore ：活体阈值，传0.5

#### 返回值

- promise 成功返回0，失败抛出异常信息

#### 用法示例

```javascript
face
  .init({
    model: "/home/walos/model",
    sn: "snsnsnsnsnsnsnsnsnsn",
    database: "/home/walos/algm_face.db",
    minface: 100,
    livescore: 0.5
  })
  .then((res) => {
    console.log("face init :" + res)
  })
  .catch((err) => {
    console.log(err)
  })
```

### 3.2 on("message") 监听人脸识别

#### 回调值 json格式

- dma_addr 当前帧指针
- dma_size 
- uuid 返回用户id，陌生人时为 stranger_${track_id}
- h
- w
- x
- y

重要提示：在init之前，此监听必须开启，并且得到的任何数据都必须调用[dmafree](jsapi/bashi/algm?id=_34-dmafree-释放图像帧)或者[dma2file](jsapi/bashi/algm?id=_35-dma2file-保存图像帧为图片)以释放指针，否则将导致内存问题

```json
{
  "dma_addr":1963231144, 
  "dma_size":37841,
  "uuid":"stranger_10",
  "h":655,
  "w":567,
  "x":132,
  "y":464
}
```

#### 用法示例

```javascript
face.on("message", (msg) => {
  console.log(JSON.stringify(msg))
  face.dmafree({ dma_addr: msg.dma_addr })
  //face.dma2file({
  // dma_addr: msg.dma_addr,
  // dma_size: msg.dma_size,
  //filename: "/home/walos/test.jpg",
  //})
})
```



### 3.3 on("error") 监听算法模块相关异常

比如无法从摄像头取帧等导致无法正常使用算法的问题

#### 用法示例

```javascript
face.on("error", (msg) => {
  console.log("----------------face model error------------------------")
  // setTimeout(() => {
  //   misc.reboot()
  // }, 5000)
})
```

### 3.4 dmafree 释放图像帧

#### 参数

- dma_addr [3.2返回的msg中的dma_addr](jsapi/bashi/algm?id=_32-onquotmessagequot-监听人脸识别)

#### 返回值

promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
face.dmafree({ dma_addr: ptr })
```

### 3.5 dma2file 保存图像帧为图片

#### 参数

- dma_addr[ 3.2返回的msg中的dma_addr](jsapi/bashi/algm?id=_32-onquotmessagequot-监听人脸识别)
- dma_size [3.2返回的msg中的dma_size ](jsapi/bashi/algm?id=_32-onquotmessagequot-监听人脸识别)
- filename 要保存图片的完整路径

#### 返回值 

- promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
face.dma2file({
  dma_addr: ptr,
  dma_size: size,
  filename: "/home/walos/test.jpg",
}).then(res=>{
  console.log("保存图片：" + ret)
}).catch(err=>{
  console.log(err)
})
```

### 3.6 usradd 添加用户 - 用户图为文件

#### 参数

- uuid 用户唯一id ，需小于64位
- filename 用户照片路径 文件格式为jpg png bmp

#### 返回值 

- promise 成功返回base64编码的特征值 失败抛出异常信息

#### 用法示例

```javascript
let uid="uid_test_id1"
face
  .usradd({ uuid: uid, filename: "/home/walos/testid1.jpg" })
  .then((res) => {
    console.log("add user success:" + uid)
  })
  .catch((err) => {
    console.log("add user fail:" + err)
  })
```

### 3.7 usraddf 添加用户 使用base64特征值

#### 参数

- uuid 用户唯一id ，需小于64位
- feature base64编码的特征值，3.5中返回的或者3.7中查询

#### 返回值 

- promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
let uid="uid_test_id1"
let featB64=""
face
  .usraddf({ uuid: uid, feature: featB64 })
  .then((res) => {
    console.log("add user success:" + uid)
    reslove(res)
  })
  .catch((err) => {
    console.log("add user fail:" + err)
    reject(err)
  })
```

### 3.8 usrlookup 查询特征

#### 参数

- uuid 用户唯一id ，需小于64位

#### 返回值 

- promise 成功返回base64编码的特征值 失败抛出异常信息

#### 用法示例

```javascript
let uid="uid_test_id1"
face
  .usrlookup({ uuid: uid })
  .then((res) => {
    console.log("get user success:" + uid)
    reslove(res)
  })
  .catch((err) => {
    console.log("get user fail:" + err)
    reject(err)
  })
```

### 3.9  usrdel 用户删除

#### 参数

- uuid 用户唯一id ，需小于64位

#### 返回值 

- promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
let uid="uid_test_id1"
face
  .usrdel({ uuid: uid })
  .then((res) => {
    console.log("del user success:" + uid)
    reslove(res)
  })
  .catch((err) => {
    console.log("del user fail:" + err)
    reject(err)
  })
```

### 3.10  usrdrop 用户清空

#### 返回值 

- promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
face
    .usrdrop()
    .then((res) => {
    console.log("drop user success")
    reslove(res)
})
    .catch((err) => {
    console.log("drop user fail:" + err)
    reject(err)
})
```

## 4. 人证比对相关方法

### 4.1 setmode

#### 参数

- mode：0为普通人脸，1为人证比对模式

#### 返回值 

- promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
face
    .setmode({ mode: 1 })
    .then((res) => {
    reslove(res === 0)
})
    .catch((err) => {
    reject(err)
})
```

### 4.2 pidadd

#### 参数

- uuid：身份证号码
- dma_addr：身份证模块回到的身份证图片地址
- dma_size
- min_dist：人证比对的识别阈值，建议1.4，越小越严格，越大越宽松

#### 返回值 

- promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
face
    .pidadd({ uuid: uid, dma_addr: addr, dma_size: size, min_dist: 1.4 })
    .then((res) => {
    console.log("add pid success:" + uid)
    reslove(res)
})
    .catch((err) => {
    console.log("add pid fail:" + err)
    reject(err)
})
```

### 4.3 piddel

**人证比对完成之后记得调用此处删除数据**

#### 返回值 

- promise 成功返回0 失败抛出异常信息

#### 用法示例

```javascript
face
    .piddel()
    .then((res) => {
    reslove(res)
})
    .catch((err) => {
    console.log("drop user fail:" + err)
    reslove(0)
})
```



## 5. 简单face.js封装示例

```javascript
import { jzface } from "face"
import conf from "../conf/conf"
import fs from "fs"
import { DEFINE } from "../../utils/define"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"
import { http } from "http"
import mqtt from "../cloud/mqtt"
import dbUser from "../cloud/db_user"
import misc from "../misc/misc"

class BashiFace {
    //face实例
    isInit = false
    face
    enable = 1
mode = 0 //0为默认人脸识别模式，1为人证模式

/**
   * 回调方法function(msg){}
   * msg={"dma_addr":1951536200,"dma_size":50883,"h":0,"uuid":"stranger","w":0,"x":0,"y":0}
   * dma_addr是图片指针
   */
callBack = null
constructor() {
    this.isInit = false
    this.face = new jzface()
    this.face.on("message", (msg) => {
        // console.log("1")
        if (this.callBack == null || this.enable != 1) {
            this.algmJpgFree(msg.dma_addr)
        } else {
            this.callBack(msg)
        }
    })
    this.face.on("error", (msg) => {
        console.log("----------------face model error------------------------")
        setTimeout(() => {
            misc.reboot()
        }, 5000)
    })
}

async init() {
    let minface = await conf.cfgGet(DEFINE.configAlgm.algmFaceMin)
    return new Promise((reslove, reject) => {
        //todo 测试关闭此处人脸初始化
        // resolve(true)
        // return
        if (this.isInit) {
            reslove(true)
            return
        }
        this.face
            .init({
            model: conf.cfgGetAlgmModelPath(),
            sn: conf.cfgGetAlgmSn(),
            database: conf.cfgDataPath() + "/algm_face.db",
            minface: minface,
            livescore: 0.45,
        })
            .then((res) => {
            console.log("face init :" + res)
            this.isInit = true
            reslove(true)
        })
            .catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

//设置人脸识别的回调
setCallback(cb) {
    this.callBack = cb
}

//设置为人脸模式
setFaceMode() {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reslove(false)
            return
        }
        this.face
            .setmode({ mode: 0 })
            .then((res) => {
            reslove(res === 0)
        })
            .catch((err) => {
            reject(err)
        })
    })
}
//设置为人证模式
setIdFaceMode() {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reslove(false)
            return
        }
        this.face
            .setmode({ mode: 1 })
            .then((res) => {
            reslove(res === 0)
        })
            .catch((err) => {
            reject(err)
        })
    })
}

// 用enable控制人脸结果的回调
setEnable(enable) {
    if (enable !== 1) {
        enable = 0
    }
    this.enable = enable
}

getEnable() {
    return this.enable == 1
}

// 每次face回调中都需要调这个方法，否则内存泄露
algmJpgFree(ptr) {
    this.face.dmafree({ dma_addr: ptr })
}

/**
    保存识别图片
    @param {Number} ptr 人脸返回的图片指针 
    @param {Number} size 人脸返回的图片指针size
    @param {String} filename 文件路径+文件名
    @returns {Promise} 成功返回true 失败也返回成功，值为false
   */
algmJpgSave(ptr, size, filename) {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reslove(false)
            return
        }
        this.face
            .dma2file({
            dma_addr: ptr,
            dma_size: size,
            filename: filename,
        })
            .then((res) => {
            reslove(res === 0)
        })
            .catch((err) => {
            console.log("add user fail:" + err)
            reslove(false)
        })
    })
}

/**
    通过文件添加人脸
    @param {String} uid 用户id 
    @param {String} path 文件路径
    @returns {Promise} 成功返回特征值 失败返回原因
   */
userAdd(path, uid) {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reject("not init")
            return
        }
        this.face
            .usradd({ uuid: uid, filename: path })
            .then((res) => {
            // console.log("add user success:" + uid)
            reslove(res)
        })
            .catch((err) => {
            console.log("add user fail:" + err)
            reject(err)
        })
    })
}

/**
    通过特征添加人脸
    @param {String} uid 用户id 
    @param {String} featB64 特征
    @returns {Promise} 成功返回0 失败返回原因
   */
userAddFeature(featB64, uid) {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reject("not init")
            return
        }
        this.face
            .usraddf({ uuid: uid, feature: featB64 })
            .then((res) => {
            // console.log("add user success:" + uid)
            reslove(res)
        })
            .catch((err) => {
            console.log("add user fail:" + err)
            reject(err)
        })
    })
}

/**
    获取库中的特征值
    @param {String} uid 用户id 
    @returns {Promise} 成功返回特征，失败也返回成功，但是值为空
   */
userGetFeature(uid) {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reslove("")
            return
        }
        this.face
            .usrlookup({ uuid: uid })
            .then((res) => {
            // console.log("get user success:" + uid)
            reslove(res)
        })
            .catch((err) => {
            console.log("get user fail:" + err)
            reslove("")
        })
    })
}

/**
    删除人脸
    @param {String} uid 用户id 
    @returns {Promise} 成功返回0 失败也返回成功
   */
userRemove(uid) {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reslove(0)
            return
        }
        this.face
            .usrdel({ uuid: uid })
            .then((res) => {
            // console.log("del user success:" + uid)
            reslove(res)
        })
            .catch((err) => {
            console.log("del user fail:" + err)
            reslove(0)
        })
    })
}

/**
    人脸清空
    @returns {Promise} 成功返回0 失败也返回成功
   */
userClear() {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reslove(0)
            return
        }
        this.face
            .usrdrop()
            .then((res) => {
            // console.log("drop user success")
            reslove(res)
        })
            .catch((err) => {
            console.log("drop user fail:" + err)
            reslove(0)
        })
    })
}

/**
    从url下载图片并添加
    @param {String} userid 用户id 
    @param {Url} url 图片地址
    @returns {Promise} 成功返回特征值 失败返回原因
   */
downFaceAndInsert(userid, url) {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reject("not init")
            return
        }
        // let token = http.on("progress", (res) => {
        //   console.log("downFaceAndInsert:" + res.percent + "%")
        // })
        http
            .download({
            url: url,
            method: "GET",
            filename: conf.cfgGetUserPath(userid),
            headers: ["Content-Type:application/octet-stream"],
            timeout: 60,
        })
            .then((res) => {
            // console.log(JSON.stringify(res))
            // http.off(token)
            return this.userAdd(conf.cfgGetUserPath(userid), userid)
        })
            .then((res) => {
            dbUser.user_update_face(userid, true)
            mqtt.feature_post(res, userid)
            fs.rm(conf.cfgGetUserPath(userid))
            reslove(res)
        })
            .catch((err) => {
            // console.log(JSON.stringify(err))
            mqtt.feature_post("", userid)
            // http.off(token)
            reject(err)
        })
    })
}

/**
   人证模式, 添加身份证图片入库比对
    @param {String} uid 身份证
    @param {Number} addr 身份证返回的图片地址
    @param {Number} size 身份证返回图片大小
    @returns {Prmoise} 成功为0 失败为失败原因
   */
userAddInIdCard(uid, addr, size) {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reject("not init")
            return
        }
        this.face
            .pidadd({ uuid: uid, dma_addr: addr, dma_size: size, min_dist: 1.4 })
            .then((res) => {
            console.log("add pid success:" + uid)
            reslove(res)
        })
            .catch((err) => {
            console.log("add pid fail:" + err)
            reject(err)
        })
    })
}

/**
    人证模式，数据清空
    @returns {Promise} 成功返回0 失败也返回成功
   */
userClearInIdCard() {
    return new Promise((reslove, reject) => {
        if (!this.isInit) {
            reslove(0)
            return
        }
        this.face
            .piddel()
            .then((res) => {
            reslove(res)
        })
            .catch((err) => {
            console.log("drop user fail:" + err)
            reslove(0)
        })
    })
}
}
export default new BashiFace()

```

简单调用示例

```javascript
import bashiFace from "../face/face"


async faceCallback(msg) {
  console.log(JSON.stringify(msg))
  //todo 根据回调数据查询自己的数据库中的用户信息，检查权限，显示ui与提示等
  //todo 陌生人建议连续多次返回同一个陌生人再判断信息
  bashiFace.algmJpgFree(msg.dma_addr)
}

bashiFace.init().then(res=>{
  bashiFace.setCallback(this.faceCallback)
})
```

