# \<modal>

## 简介

`<modal>` 用于显示系统弹窗，应用处于后台也可弹出，可基于此组件封装全局弹出的alert、confirm、toast。

- 在代码中请使用 `<modal>` 标签, 。
- `<modal>` 支持内嵌其它子组件。
- `<modal>` 默认具有fixed样式。

## 基本用法

```plain
<modal
    class="modal"
    v-if="shown"
>
	<slot />
<modal>
```

## 样式

支持**通用样式**。

## 属性

| 属性名          | 类型    | 值                                                           | 默认值 |
| --------------- | ------- | ------------------------------------------------------------ | ------ |
| `floating`      | Boolean | 是否浮窗(浮窗背后的内容是否可见)如果为false，弹出后，后面的应用和页面会走onHide生命周期，并且显示为不可见。 | true   |
| `focusable`     | Boolean | 是否抢占用户焦点，alert/confirm类的弹窗应使用true，toast类使用false | true   |
| `cancelable`    | Boolean | 是否支持滑动退出(左滑)                                       | true   |
| `touch-through` | Boolean | 是否支持触屏事件穿透                                         | false  |



## 事件

- **通用事件**. 参见**通用事件**

### `dismiss`

当弹窗退出时，`dismiss`事件将被触发。

## 扩展
