# Transition

## 简介

现在您可以在 CSS 中使用 `transition` 属性来提升您应用的交互性与视觉感受，`transition` 中包括布局动画，即 LayoutAnimation，现在布局产生变化的同时也能使用 `transition` 带来的流畅动画。`transition`允许 CSS 的属性值在一定的时间区间内平滑地过渡。



## 参数

- `transition-property`：设置过渡动画的属性名，设置不同样式 `transition` 效果的键值对，默认值为空，表示不执行任何过渡效果，下表列出了所有合法的参数属性：

| 参数名             | 描述                           |
| ------------------ | ------------------------------ |
| `width`            | 设置组件的宽度参与过渡动画     |
| `height`           | 设置组件的高度参与过渡动画     |
| `top`              | 设置组件的顶部距离参与过渡动画 |
| `bottom`           | 设置组件的底部距离参与过渡动画 |
| `left`             | 设置组件的左侧距离参与过渡动画 |
| `right`            | 设置组件的右侧距离参与过渡动画 |
| `background-color` | 设置组件的背景颜色参与过渡动画 |
| `opacity`          | 设置组件的不透明度参与过渡动画 |
| `transform`        | 设置组件的变换类型参与过渡动画 |

- `transition-duration`：指定过渡的持续时间 (单位是毫秒)，默认值是 `0`，表示没有动画效果。
- `transition-delay`：指定请求过渡操作到执行过渡之间的时间间隔 (单位是毫秒或者秒)，默认值是 `0`，表示没有延迟，在请求后立即执行过渡。
- `transition-timing-function`：描述过渡执行的速度曲线，用于使过渡更为平滑。默认值是 `ease`。下表列出了所有合法的属性：

| 属性名                       | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| ease                         | transition 过渡逐渐变慢的过渡效果                            |
| ease-in                      | transition 过渡慢速开始，然后变快的过渡效果                  |
| ease-out                     | transition 过渡快速开始，然后变慢的过渡效果                  |
| ease-in-out                  | transition 过渡慢速开始，然后变快，然后慢速结束的过渡效果    |
| linear                       | transition 过渡以匀速变化                                    |
| cubic-bezier(x1, y1, x2, y2) | 使用三阶贝塞尔函数中自定义 transition 变化过程，函数的参数值必须处于 0 到 1 之间。更多关于三次贝塞尔的信息请参阅 [cubic-bezier](http://cubic-bezier.com/) 和 [Bézier curve](https://en.wikipedia.org/wiki/Bézier_curve). |

## 示例

```css
<style scoped>
  .panel {
    margin: 10px;
    top:10px;
    align-items: center;
    justify-content: center;
    border: solid;
    border-radius: 10px;
    transition-property: width, height, background-color;
    transition-duration: 0.3s;
    transition-delay: 0s;
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  }
</style>
```

