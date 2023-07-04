# `<image>`

## 显示效果

无

## 简介

`<image-frame>` 用于在界面中显示序列帧动画。

- 在代码中请使用 `<image-frame>` 标签, 。
- 序列帧图片需选用本地图片，不支持从网络下载。
- `<image-frame>` 不支持内嵌子组件。

## 基本用法

```plain
<image-frame ref="images" class="image" 
        :src="[require('../../images/0.png'), 
              require('../../images/1.png'), 
              require('../../images/3.png'), 
              require('../../images/5.png'), 
              require('../../images/6.png'), 
              require('../../images/7.png'), 
              require('../../images/8.png')]" />
```



## 子组件

`<image-frame>`不支持子组件。

## 样式

支持**通用样式**。

WARNING

`width`, `height` 和 `src`必须被提供，否则图片无法渲染。

## 属性

| 属性名       | 类型       | 值           | 默认值        |
| ------------ | ---------- | ------------ | ------------- |
| `src`        | String数组 | {imagePath } | -             |
| `auto-play`  | Boolean    | 是否自动播放 | false         |
| `loop-count` | Integer    | 循环播放次数 | -1 (永久循环) |
| `interval`   | Integer    | 帧间隔(ms)   | 100(ms)       |



#### 图片扩展功能

[详细见文档](app/pic)



## 事件

- **通用事件**. 参见**通用事件**

### `end`

当动画运行结束时，`end`事件将被触发。

### 处理 `end` 事件

在 `<image-frame>` 标签上绑定 `end` 事件：

```plain
<image-frame @end="onAnimationEnd"/>
```

增加事件处理函数：

```plain
export default {
  methods: {
    onAnimationEnd (event) {
    }
  }
}
```

### `repeat`

当动画循环播放开始时，`repeat`事件将被触发。

## 扩展

### `start()`

开始播放动画。

### `stop()`

停止播放动画。

### `pause()`

暂停动画。

### `resume()`

恢复播放动画。
