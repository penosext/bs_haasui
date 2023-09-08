import { mpp, audio } from "mpp"
import conf from "../conf/conf"
import { DEFINE } from "../../utils/define"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"

class Mpp {
  mDisplay
  mAudio
  screenTimer = 0 //自动息屏的timer
  isScreenClose = false //屏幕息屏状态
  tempStopAutoScreenClose = false //临时关闭自动息屏

  constructor() {
    this.mDisplay = new mpp()
    this.mAudio = new audio()
    this.mAudio.open()
  }

  //传感器图像显示在屏幕上 0 白光，1红外
  show(mode) {
    if (!isNumber(mode) || (mode != 0 && mode != 1)) {
      mode = 0
    }
    console.log("display mode:" + mode)
    this.mDisplay.vishow({ mode: mode })
  }
  //设置亮度 0-100
  setScreenBrightness(value) {
    if (isNumber(value) && value >= 0 && value <= 100) {
      this.mDisplay.set_brightness({ brightness: value })
    }
  }
  setAutoScrrenOffTemp(status) {
    if (status) {
      this.tempStopAutoScreenClose = true
      this.touchAutoScreenOff()
      if (this.screenTimer) {
        clearTimeout(this.screenTimer)
      }
    } else {
      this.tempStopAutoScreenClose = false
      this.touchAutoScreenOff()
    }
  }
  //初始化自动息屏
  touchAutoScreenOff() {
    if (this.tempStopAutoScreenClose) {
      if (this.isScreenClose) {
        this.setScreenBrightness(100)
      }
      return
    }
    conf
      .cfgGet(DEFINE.configHw.turnOffScreen)
      .then((res) => {
        if (res === "disable") {
          //不自动息屏
          if (this.isScreenClose) {
            this.setScreenBrightness(100)
          }
          return
        } else {
          //自动息屏
          if (this.isScreenClose) {
            this.isScreenClose = false
            this.setScreenBrightness(100)
          }
          if (this.screenTimer) {
            clearTimeout(this.screenTimer)
          }
          this.screenTimer = setTimeout(() => {
            this.isScreenClose = true
            this.setScreenBrightness(0)
          }, 15 * 1000)
        }
      })
      .catch((err) => {
        if (this.isScreenClose) {
          this.setScreenBrightness(100)
        }
      })
  }

  setAuido(volume) {
    if (isNumber(volume) && volume >= 0 && volume <= 100) {
      this.mAudio.setvol({ vol: volume })
    }
  }
  //播放语音
  play(filename, isImm) {
    if (!isString(filename)) {
      return
    }
    if (isImm == true || isImm == 1) {
      isImm = 1
    } else {
      isImm = 0
    }
    conf
      .cfgGet(DEFINE.configUi.voiceMode)
      .then((res) => {
        if (res === "default") {
          this.mAudio.play({ filename: filename, flag: isImm })
        }
      })
      .catch((err) => {})
  }
  playOpendoor() {
    this.play(conf.cfgGetAudioPath("remote_open.mp3"))
  }
  playUserPass() {
    this.play(conf.cfgGetAudioPath("user_pass.mp3"), 1)
  }
  playUserExpire() {
    this.play(conf.cfgGetAudioPath("user_expire.mp3"))
  }
  playUserDeny() {
    this.play(conf.cfgGetAudioPath("user_deny.mp3"))
  }
  playQrDeny() {
    this.play(conf.cfgGetAudioPath("qr_deny.mp3"))
  }
  playDi() {
    this.play(conf.cfgGetAudioPath("qrcode.mp3"), 1)
  }
  playPidError() {
    this.play(conf.cfgGetAudioPath("idfail.mp3"), 1)
  }
  playPidFaceNotMatch() {
    this.play(conf.cfgGetAudioPath("id_face_fail.mp3"), 1)
  }
}

export default new Mpp()
