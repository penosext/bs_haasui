# \<input>

edit 组件、编辑组件

## 显示效果

![image.png](../../_images/input.gif)



### 示例代码下载

[代码下载](https://iotx-haas-linkin.oss-cn-shanghai.aliyuncs.com/o/config/public-examples/input.zip)

## 简介

`<input>` 组件用来创建接收用户输入字符的输入组件。 `<input>` 组件的工作方式目前只支持 `password`或普通文本，暂不支持比如 `url`，`email`，`tel` 等。

注意

此组件不支持 `click` 事件。请监听 `input` 或 `change` 来代替 `click` 事件。

## 子组件

`<input>` 不支持子组件。

## 属性

| key                | 类型    | 描述                                                     | 默认值                | 备注   |
| ------------------ | ------- | -------------------------------------------------------- | --------------------- | ------ |
| `type`             | string  | 控件的类型                                               | text                  | 待完善 |
| `value`            | string  | 组件的默认内容                                           |                       |        |
| `placeholder`      | string  | 提示用户可以输入什么。 提示文本不能有回车或换行          |                       |        |
| `placeholderColor` | Color   | 提示文本的颜色                                           |                       |        |
| `autofocus`        | boolean | 布尔类型的数据，表示是否在页面加载时控件自动获得输入焦点 |                       |        |
| `maxlength`        | nubmer  | 一个数值类型的值，表示输入的最大长度                     |                       |        |
| `cursorColor`      | Color   | 设置光标的颜色                                           | rgba(255,255,255,0.5) |        |
| `cursorSize`       | number  | 设置光标的宽度                                           | 2                     |        |

## 样式

#### color {color}

字符颜色。默认值是 `#000`

#### font-size {px}

字符颜色。默认值是 `32px`

#### 通用样式

支持所有通用样式

- 盒模型
- `flexbox` 布局
- `position`
- `opacity`
- `background-color`

查看 **组件通用样式**

## 事件

- **通用事件** 支持所有**通用事件**。
- **input**. 当输入状态时，会不断触发。
  - @param value: 当前文本。
- **focus**. 当输入框获得焦点时。
- **blur**. 当输入框丢失焦点时。

## 扩展

### appendText(text)

从当前光标位置追加文本。

### popBack()

从当前光标位置往前删除一个字符。

### commitText(text)

替换全部文本。

### commitComplete()

触发confirm事件。

### getCursorPosition(callback)

获取当前光标位置。

### setCursorPosition(index)

设置当前光标位置。



## 约束

目前不支持 this.$el(id).value = '' 这种方式改写 input value。只支持在 `<input>` 组件的 input、change 事件中改写。
