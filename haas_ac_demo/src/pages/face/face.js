import { jzface } from "face"
import conf from "../conf/conf"
import fs from "fs"
import { DEFINE } from "../../utils/define"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"
import { http } from "http"
import mqtt from "../cloud/mqtt"
import dbUser from "../cloud/db_user"
import misc from "../misc/misc"
import mpp from "../mpp/mpp"

class BashiFace {
  //face实例
  isInit = false
  face
  enableCallback = 1
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
      if (this.callBack == null || this.enableCallback != 1) {
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
    let minface = await conf.cfgGetInt(DEFINE.configAlgm.algmFaceMin)
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
    if (enable !== 1 && enable !== true) {
      enable = 0
      mpp.setAutoScrrenOffTemp(true)
    } else {
      enable = 1
      mpp.setAutoScrrenOffTemp(false)
    }
    this.enableCallback = enable
  }

  getEnable() {
    return this.enableCallback == 1
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
          console.log("algmJpgSave fail:" + err)
          reslove(false)
        })
    })
  }

  /**
   配置算法模块
   @param {Object} algm
   @param {Object.Number} minface
   @returns 
   */
  doConfig(algm) {
    return new Promise((reslove, reject) => {
      if (!this.isInit) {
        reslove(false)
        return
      }
      this.face
        .config(algm)
        .then((res) => {
          reslove(res === 0)
        })
        .catch((err) => {
          reject(err)
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
          console.log("add user by f fail:" + err)
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
