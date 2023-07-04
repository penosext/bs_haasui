# \<richtext>

## 简介

`<richtext>` 组件用来创建图文混排的富文本组件。

**基本用法**

```html
<template>
  <div>
    <richtext @itemclick="listener" @click="click" style="color:red;font-size:20px;lines:3;background-color:green;">
      <span pseudoRef="1" style="text-decoration:line-through;font-size: 50">linklink</span>
      <image
        style="width: 150;"
        src="https://img.alicdn.com/tps/i2/TB1hRb1IXXXXXX3XVXXXQaP.pXX-87-87.jpeg"
      ></image>
      <span style="font-size: 42; color: yellow">TAOBAO</span>
      <image
        src="https://g.alicdn.com/iot_miniapp/falcon-ui-demo/0.0.13/images/gif.gif"
        pseudo-ref="23"
      ></image>
      <span style="text-decoration:underline;background-color:blue;line-height:40px"
        >IoT小程序是一套用在嵌入式设备上的轻量级应用开发框架,是AliOS Things系统上推荐的应用&显示框架,目前是JS开发为主、C/C++开发为辅.</span
      >
    </richtext>
  </div>
</template>

<script>
module.exports = {
  methods: {
    listener: function (foo) {
      console.log('itemclick', foo.pseudoRef);
    },
    click(e) {
    },
  },
};
</script>
```

## 子组件

`<richtext>` 富文本组件可以内嵌 `<span>``<br>``<image>`。同时它也支持 `<span>``<br>``<image>` 的嵌套。

只有 `<span>`, `<br>` and `<image>` 可以包含在 `<richtext>` 标签里。`<span>` 会被显示为 `display:inline`，而 `<image>` 会被显示为 `display:inline-block`。

`<richtext>` 的子节点分两种类型。

- `<span>` 可以再包含孩子节点。
- `<image>` `<br>`不能再包含孩子节点。
- 富文本组件自身不能嵌套。。

## 样式

#### 通用样式

支持所有通用样式
- 盒模型
- `flexbox` 布局
- `position`
- `opacity`
- `background-color`
- `lines` 最大行数
- text-overflow: ellipsis 设置文字超出省略号显示样式

## 子组件样式
富文本和它下面的 `<span>`, `<br>`, `<image>` 只支持有限的样式。
- `<span>`,`<br>`和`<richtext>`
	- 可以被继承
		- color
    	- font-family
    	- font-size
    	- font-style
    	- font-weight
    	- line-height
	- 不可被继承
		- background-color
- `<span>`
	- 可以被继承
		- text-decoration: none | underline | line-through, 默认值是 none
- `<richtext>`
	- 不可被继承
		- lines: 最大行数，必须为正数。
- `<image>`
	- 不可被继承
		- width
    	- height

## 事件

- **通用事件** 支持所有**通用事件**。
- **itemclick**. 触发时机是:
	- 选中的组件包含**pseudo-ref**属性，**pseudo-ref** 会作为参数传回来。
	- 若多个嵌套节点上均包含 `itemclick` 事件，则只有最外层节点上的 `itemclick` 会被触发
