# \<lottie>

## 简介

`<lottie>` 用于在界面中显示lottie矢量动画。

- 在代码中请使用 `<lottie>` 标签, 。
- lottie动画的json文件，只支持在本地加载。
- `<lottie>` 不支持内嵌子组件。
- 暂不支持image、text以及mask功能

## 基本用法

```plain
<lottie
    class="lottie"
    ref="lottie"
    lottieFile="/assets/lotties/lottie.json"
    :loopCount="100"
    :autoPlay="true"
    />
```



## 子组件

`<lottie>`不支持子组件。

## 样式

支持**通用样式**。

## 属性

| 属性名        | 类型    | 值           | 默认值        |
| ------------- | ------- | ------------ | ------------- |
| `lottie-file` | String  | {jsonPath }  | -             |
| `auto-play`   | Boolean | 是否自动播放 | false         |
| `loop-count`  | Integer | 循环播放次数 | -1 (永久循环) |
| `speed`       | float   | 动画播放速度 | 1             |



## 事件

- **通用事件**. 参见**通用事件**

### `end`

当动画运行结束时，`end`事件将被触发。

#### 处理 `end` 事件

在 `<lottie>` 标签上绑定 `end` 事件：

```plain
<lottie @end="onAnimationEnd"/>
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

### `cancel`

当动画取消开始时，`cancel`事件将被触发。

## 扩展

### `play()`

开始播放动画。

### `cancel()`

停止播放动画。

### `pause()`

暂停动画。

### `resume()`

恢复播放动画。
