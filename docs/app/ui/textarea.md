# \<textarea>

## 简介

 `<textarea>` 组件用来创建接收用户输入字符的多行输入组件。 `textarea` 组件的工作方式目前只支持 普通文本，暂不支持比如 url，email，tel 等。

**基本用法**

```html
<template>
	<textarea ref="textarea" class="textarea" @input="input" @confirm="confirm" :value="value" />
</template>
<script>

export default {
  data() {
    return {
      value: 'textarea'
    };
  },
  mounted() {
    this.$refs.textarea.getCursorPosition(r => {
			console.log('cursorPosition=' + r);
    });
  },
  methods: {
    input(v) {
      console.log('input', v);
    },
    confirm(v) {
      console.log('confirm', v);
    }
  },
};
```

## 子组件

`<textarea>` 不支持子组件。

## 属性

| key             | 类型    | 描述                                                     | 默认值                | 备注 |
| --------------- | ------- | -------------------------------------------------------- | --------------------- | ---- |
| value           | string  | 组件的默认内容                                           |                       |      |
| autofocus       | boolean | 布尔类型的数据，表示是否在页面加载时控件自动获得输入焦点 |                       |      |
| cursorColor     | Color   | 设置光标的颜色                                           | rgba(255,255,255,0.5) |      |
| cursorSize      | number  | 设置光标的宽度                                           | 2                     |      |
| softInputEnable | boolean | 是否支持弹出系统软键盘                                   | false                 |      |
| showCursor      | boolean | 是否持续显示光标                                         | false                 |      |

## 样式

#### color {color}

字符颜色。默认值是 #000

#### font-size {px}

字符颜色。默认值是 32px

#### 通用样式

支持所有通用样式

- 盒模型
- flexbox 布局
- position
- opacity
- background-color

查看 **组件通用样式**

## 事件

- **通用事件** 支持所有**通用事件**。
- **input**. 当输入状态时，会不断触发。

- - @param value: 当前文本。

- **confirm**. 当输入完成时触发。

- - @param value: 当前文本。

- **focus**. 当输入框获得焦点时。
- **blur**. 当输入框丢失焦点时。

约束

目前不支持 this.$el(id).value = '' 这种方式改写 input value。只支持在 `<textarea>` 组件的 input、change 事件中改写。

## 扩展

### appendText(text)

从当前光标位置追加文本。

### popBack()

从当前光标位置往前删除一个字符。

### commitText(text)

替换全部文本。

### commitComplete()

触发confirm事件。

### getValue(callback)

获取当前文本内容。

### getCurrentLineValue(callback)

获取当前光标位置所在行的文本内容。

### getCurrentLine(callback)

获取当前光标位置所在行的文本内容，文本index以及光标在当前行中的位置。

### setCurrentLineValue(text)

设置当前光标所在行的文本内容，会触发文本重新布局。

### replaceValue(pos, len, text)

替换部分文本内容。

### getCursorPosition(callback)

获取当前光标位置。

### setCursorPosition(index)

设置当前光标位置。

### moveCursor(direction)

移动指针位置，prev/next/up/down。
