# 如何使用页面模块

页面模块可在页面对象$page 中获取
例如：

```
mounted() {
  this.$page.$dom.getComponentRect($refs.someRef)
}
```

## $dom模块

###  scrollToElement 

语法：$dom.scrollToElement(ref, options)

行为：页面滚动到该 ref 元素位置（left或top位置）

参数：

- ref 用 vue ref 特性持有的元素节点

- options

	- smooth 滚动行为是否支持过程动画

	- offset 滚动的位置增加的偏移像素

###  getComponentRect 

语法：this.$page.$dom.getComponentRect(ref)

行为：获取 ref 元素的布局信息，例如：

{"result":true,"size":{"left":601,"top":1,"right":801,"bottom":49,"width":200,"height":48}