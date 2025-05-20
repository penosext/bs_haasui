# 视频播放器

## 1.概述

封装了简单视频播放功能，本地文件

## 2.模块使用方式

```javascript
import { mplayer } from "mplayer"

let mPlayer = new mplayer()

```

## 3.方法

### 3.1 avinfo 获取视频的播放信息

#### 参数

- filename： 文件名，绝对路径

#### 返回值

- promise 成功返回视频信息 失败抛出异常
  - width
  - height
  - fps
  - bitrate
  - duration
  - sample_rate
  - channels

#### 用法示例

```javascript
mPlayer.avinfo({ filename: "/home/walos/test.mp4" })
```

### 3.2 open 初始化视频

#### 参数

- filename：文件名，绝对路径
- decoder： 0：硬解 1：软解 2：自动
- isLoop：是否循环播放
- x ：播放坐标
- y ：播放坐标
- w： 播放区域宽度
- h： 播放区域高度
- fps：avinfo 获取的值
- aoenable：是否有声音
- volumn：音量，与音视频中的音量控制相同

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mPlayer.open({
      filename: "/home/walos/test.mp4",
      decoder: 2,
      loop: 0,
      pos_x: 0,
      pos_y: 0,
      pos_w: 800,
      pos_h: 480,
    })
```

### 3.3 start 开始播放

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mPlayer.start()
```

### 3.4 close 结束播放

#### 返回值

- promise 成功0 不会抛出失败

#### 用法示例

```javascript
mPlayer.close()
```

### 3.5 pause 暂停播放

- #### 返回值

  - promise 成功0 不会抛出失败

#### 用法示例

```javascript
mPlayer.pause()
```

### 3.6 start finish 播放回调

#### 用法示例

```javascript
mPlayer.on("finish", () => {})
mPlayer.on("start", () => {})
```

## 5.简单封装

```javascript
import { mpp, audio } from "mpp"
import { mplayer } from "mplayer"
import conf from "./conf"
// import { DEFINE } from "./define"
import { isString, isNumber, isObject, isFunction } from "./util"

class Media {
  mDisplay
  mAudio
  mPlayer
  playFinish = null
  mVolume = 80

  constructor() {
    if ($falcon.env.platform === "Windows") {
      return
    }
    this.mDisplay = new mpp()
    this.mPlayer = new mplayer()
    this.mPlayer.on("finish", () => {
      if (this.playFinish != null) this.playFinish()
    })
    this.mAudio = new audio()
    this.mAudio.open()
    this.setAuido(this.mVolume)
  }

  //设置亮度 0-100
  setScreenBrightness(value) {
    if (isNumber(value) && value >= 0 && value <= 100) {
      this.mDisplay.set_brightness({ brightness: value })
    }
  }
  initGui() {
    this.mDisplay.gui_init()
  }

  setAuido(volume) {
    if (isNumber(volume) && volume >= 0 && volume <= 100) {
      this.mVolume = volume
      if (this.mAudio) {
        this.mAudio.setvol({ vol: volume })
      }
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
    // conf
    //   .cfgGet(DEFINE.configUi.voiceMode)
    //   .then((res) => {
    //     if (res === "default") {
    this.mAudio
      .play({ filename: filename, flag: isImm })
      .then((res) => {})
      .catch((err) => {
        console.log(filename, err)
      })
    //     }
    //   })
    //   .catch((err) => {})
  }
  playTest() {
    // this.play(conf.cfgGetAudioPath("remote_open.mp3"))
    this.play(conf.cfgGetAudioPath("audio1.mp3"), 1)
  }

  playFile(filename) {
    this.play(conf.cfgGetAudioPath(filename), 1)
  }

  /**
   * 获取视频的播放信息
   * @param {String} filename 文件名，绝对路径
   *
   * @returns {Object} 视频的信息
   *
   */
  videoInfos(filename) {
    console.log(`filename：${filename} }`)
    return this.mPlayer.avinfo({ filename: filename })
  }
  /**
   * 播放视频
   * @param {*} filename  文件名，绝对路径
   * @param {*} decoder 0：硬解 1：软解 2：自动
   * @param {*} isLoop 是否循环播放
   * @param {*} x 播放坐标
   * @param {*} y 播放坐标
   * @param {*} w 播放区域宽度
   * @param {*} h 播放区域高度
   * @param {*} fps 帧率来自avinfo
   * @param {*} aoenable 播放声音
   * @param {*} volumn 音量
   * @returns
   */
  videoOpen(filename, decoder, isLoop, x, y, w, h, fps, aoenable, volumn) {
    //todo有个想法，得先获取视频文件的信息，再去播放，否则不知道视频宽高无法准确挖孔
    console.log(
      `filename：${filename} , decoder：${decoder}, isLoop：${isLoop}, x：${x} , y：${y}, w：${w}, h：${h}`
    )
    if (!isString(filename)) return
    if (!isNumber(decoder) || decoder < 0 || decoder > 2) {
      decoder = 0
    }
    if (isLoop) {
      isLoop = 1
    } else {
      isLoop = 0
    }
    if (
      !isNumber(x) ||
      !isNumber(y) ||
      !isNumber(w) ||
      !isNumber(h) ||
      x < 0 ||
      y < 0 ||
      w < 0 ||
      h < 0
    ) {
      return
    }
    return this.mPlayer.open({
      filename: filename,
      decoder: decoder,
      loop: isLoop,
      pos_x: x,
      pos_y: y,
      pos_w: w,
      pos_h: h,fps:fps,aoenable:aoenable,volumn:volumn
    })
  }
  // videoOpen 后 执行videoStart才可以播放
  videoStart(cb) {
    console.log("========================>videoStart")
    this.mPlayer.start()
    this.playFinish = cb
  }

  videoClose() {
    console.log("========================<videoClose")
    this.mPlayer.close()
  }
}

export default new Media()

```

