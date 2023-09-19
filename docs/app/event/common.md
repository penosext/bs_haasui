# 通用组件事件

Dom和组件事件遵循Vue标准,可参考Vue事件文档:[事件处理](https://cn.vuejs.org/v2/guide/events.html),[组件自定义事件](https://cn.vuejs.org/v2/guide/components-custom-events.html)

事件对象:所有事件对象统一拥有以下参数

```json
{
	type:String, //事件类型
  target:Object,	//事件对象,交互事件为事件触发的元素.全局/模块事件为事件触发对应的全局/模块对象
  timestamp:number,	//事件触发时间戳
  data:Object|Number...	//可选,事件触发时需要传递的参数,参数名[data]根据事件类型可自定义
}
```

## 交互响应事件

| 事件类型  | 说明     |
| --------- | -------- |
| click     | 点击事件 |
| longpress | 长按事件 |

另外还有 touchstart touchend touchmove这些事件用于扩展使用

用户点击/长按/滑动等操作元素的事件,作用于元素/组件上.

```html
<template>
<div class="btn" @click="handleClick">
  <text class="btn-text">click</text>
</div>
<div class="btn" @longpress="handleLongPress">
  <text class="btn-text">longpress</text>
</div>
</template>
<script>
  export default {
  methods: {
    handleDisappear(e, id) {
      console.log(`
        ${e.timestamp}
        ${id} disappear
        ${e.direction}
      `);
    },
    handleClick(e) {
      console.log(e.timestamp + ': click');
    },
    handleLongPress(e) {
      console.log(e.timestamp + ': longpress');
    }
  }
};
</script>
```

