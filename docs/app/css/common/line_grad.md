# 线性渐变

## 简介

支持线性渐变背景，具体介绍可参考 [CSS 渐变介绍](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Using_CSS_gradients)。

所有组件均支持线性渐变。



### 使用

你可以通过 `background-image` 属性创建线性渐变。

```css
background-image: linear-gradient(to top, #a80077, #66ff00);
```

目前暂不支持 `radial-gradient`（径向渐变）。

目前只支持两种颜色的渐变，渐变方向如下：

- `to right`：从左向右渐变
- `to left`：从右向左渐变
- `to bottom`：从上到下渐变
- `to top`：从下到上渐变
- `to bottom right`：从左上角到右下角
- `to top left`：从右下角到左上角

WARNING

- `background-image` 优先级高于 `background-color`，这意味着同时设置 `background-image` 和 `background-color`，`background-color` 被覆盖。
- `background` 不支持简写。