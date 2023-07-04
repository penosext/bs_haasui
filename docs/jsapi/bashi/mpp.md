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

