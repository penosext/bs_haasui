# \<qrcode>

## 简介

`<qrcode>` 用于在界面中显示二维码。

- 在代码中请使用 `<qrcode>` 标签, 。
- `<qrcode>` 不支持内嵌子组件。

## 基本用法

```plain
<qrcode
    class="qrcode"
    ref="qrcode"
    value="https://haas.iot.aliyun.com/haasui"
    level="Q"
    color="black"
    />
```



## 子组件

`<qrcode>`不支持子组件。

## 样式

支持**通用样式**。

WARNING

`value`必须被提供。

## 属性

| 属性名  | 类型          | 值         | 默认值 |
| ------- | ------------- | ---------- | ------ |
| `value` | String        | 二维码内容 | -      |
| `level` | enum(L/M/Q/H) | 纠错级别   | Q      |
| `color` | Color         | 二维码颜色 | black  |



## 事件

- **通用事件**. 参见**通用事件**

## 扩展
