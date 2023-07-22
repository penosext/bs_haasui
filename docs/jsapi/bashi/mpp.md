# 音视频

## 1.概述

封装了基本的音视频的使用

## 2.模块使用方式

```javascript
import { mpp, audio } from "mpp"
let mDisplay = new mpp()
let mAudio = new audio()
```

## 3.视频方法

### 3.1 vishow 显示视频

#### 参数

- mode ： 显示模式 0 可见光，1 红外

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mDisplay.vishow({ mode: 0 })
```

### 3.1 set_brightness 设置显示亮度

#### 参数

- brightness ： 0-100亮度

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mDisplay.set_brightness({ brightness: 100 })
```

## 4.音频方法

### 4.1 open 打开音频通道

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mAudio.open()
```

### 4.2 close 关闭音频通道

#### 返回值

- promise 成功0 不会抛出失败

#### 用法示例

```javascript
mAudio.close()
```

### 4.3 play 播放mp3

#### 参数

- filename ： 播放的文件路径
- flag ： 0默认队列播放，1立即播放

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mAudio.play({ filename: "/home/walos/test.mp3", flag: 1 })
```

### 4.3 setvol 设置音量

#### 参数

- vol ： 0-100

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
mAudio.setvol({ vol: 100 })
```

## 5.简单封装

```javascript
import { mpp, audio } from "mpp"
import conf from "../conf/conf"
import { DEFINE } from "../../utils/define"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"

class Mpp {
    mDisplay
    mAudio

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
}

export default new Mpp()

```

