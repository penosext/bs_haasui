## CSS单元

## 长度单位

我们**支持** `px` `rpx` `%` `vw` `vh`**长度单位**。对于不希望受屏幕宽度和 viewPortWidth 影响的尺寸，可使用rpx、%、vw、vh。

注意

- 不支持类似 `em`、`rem`、`pt`这样的 CSS 标准中的其他长度单位；
- 单位 `px`不可省略，否则在 H5 环境无法正确渲染；

## 数值单位

除了长度单位外，还有数值单位，仅仅一个数值，后面没有 `px` 等单位。用于 `opacity`，`lines`，`flex` 等属性指定一个纯数值。

**有时值必须是整数，例如：**`lines`

## 颜色单位

支持多种颜色单位：

- 精简写法的十六进制，如`#f00`
- 十六进制，如 `#ff0000`
- RGB， 如 `rgb(255, 0, 0)`
- RGBA，如 `rgba(255, 0, 0, 0.5)`
- 色值关键字，如 `red`

```plain
.classA {
  /* 3-chars hex */
  color: #0f0;
  /* 6-chars hex */
  color: #00ff00;
  /* rgba */
  color: rgb(255, 0, 0);
  /* rgba */
  color: rgba(255, 0, 0, 0.5);
  /* transparent */
  color: transparent;
  /* Basic color keywords */
  color: orange;
  /* Extended color keywords */
  color: darkgray;
}
```

注意

- 只有上面列出的颜色格式被支持，其他颜色格式均**不**被支持。
- `6-chars hex`*16进制颜色值* 是性能最好的颜色使用方式。除非有特殊原因，请使用`6-chars hex`格式。

### 颜色关键字列表

| 颜色名 | 十六进制RGB值 |
| ------ | ------------- |
| black  | #000000       |
| gray   | #808080       |
| white  | #FFFFFF       |
| red    | #FF0000       |
| purple | #800080       |
| green  | #008000       |
| yellow | #FFFF00       |
| blue   | #0000FF       |
