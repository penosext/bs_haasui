# \<scroller>

## 显示效果

![image.png](../../_images/scroller.gif)



1. ## 简介

   `<scroller>` 是一个容纳子组件进行横向或竖向滚动的容器组件。如果你的组件需要进行滚动，可以将 `<scroller>` 当作根元素或者父元素使用，**否则页面无法滚动**。

   

   - `<scroller>` 需要显式的设置其宽高，可使用 `position: absolute;` 定位或 `width`、`height` 设置其宽高值。

   ```javascript
   <template>
     <scroller class="scroller">
       <div class="row" v-for="row in rows" :key="row.id">
         <text class="text">{{row.name}}</text>
       </div>
     </scroller>
   </template>
   <script>
     export default {
       data () {
         return {
           rows: []
         }
       },
       created () {
         for (let i = 0; i < 80; i++) {
           this.rows.push({id: i, name: 'row ' + i})
         }
       },
     }
   </script>
   ```

   ## 子组件

   `<scroller>` 支持任意类型的组件作为其子组件。 

   ## 属性

   | 参数                    | 说明                         | 类型                               | 默认值                 |
   | ----------------------- | ---------------------------- | ---------------------------------- | ---------------------- |
   | show-scrollbar          | 控制是否出现滚动条           | boolean                            | true                   |
   | scroll-direction        | 控制滚动的方向               | string（horizontal 或者 vertical） | vertical               |
   | over-scroll             | 控制是否支持边界回弹效果     | px （最大回弹距离）                | 0, 不支持回弹          |
   | over-fling              | 快划场景是否支持边界回弹效果 | px （最大回弹距离）                | 0, 不支持回弹          |
   | scrollEventInterval     | 控制 scroll 事件的触发间隔   | number（ms 毫秒）                  | 100                    |
   | scrollable              | 是否可滚动                   | boolean                            | true                   |
   | scrollWithAnimation     | 滚动是否有动画               | boolean                            | true                   |
   | scrollAnimationDuration | 滚动动画时间                 | number                             | -1, 按内容尺寸自动计算 |

   

   `scroll-direction` 定义了 scroller 的滚动方向，样式表属性 `flex-direction` 定义了 scroller 的布局方向，两个方向必须一致。例如：

   - `scroll-direction` 的默认值是 `vertical`，`flex-direction` 的默认值是 `column`；
   - 当需要一个水平方向的 scroller 时，使用 `scroll-direction="horizontal"` 和 `flex-direction: row`;
   - 当需要一个竖直方向的 scroller 时，使用 `scroll-direction="vertical"` 和 `flex-direction: column`，由于这两个值均是默认值，当需要一个竖直方向的 scroller 时，这两个值可以不设置。

   ## 事件

   - `scroll`
     列表发生滚动时将会触发该事件，事件的默认触发频率为 10px，即列表每滚动 10px 触发一次，可通过属性 `offset-accuracy` 设置抽样率。事件中 `Event` 对象有以下属性:

   | 属性            | 说明           | 类型   |
   | --------------- | -------------- | ------ |
   | `contentSize`   | 列表的内容尺寸 | Object |
   | `width`         | 列表内容宽度   | number |
   | `height`        | 列表内容高度   | number |
   | `contentOffset` | 列表的偏移尺寸 | Object |
   | `x`             | x 轴上的偏移量 | number |
   | `y`             | y 轴上的偏移量 | number |

   - `scrollstart`
     **H5 暂不支持该事件**，当列表开始滚动时触发，当前的内容高度和列表偏移会在 callback 中返回，示例参见 Demo。
   - `scrollend`
     **H5 暂不支持该事件**，与 `scrollstar` 类似，当列表结束滚动时触发，当前的内容高度和列表偏移会在 callback 中返回，示例参见 Demo。

   注：scrollEventInterval 可控制 scroll 事件的调用间隔，有时候不需要频发检测scroll滚动位置，特别是影响mvvm值发生重绘的场景，适当调大该值可

   ## 扩展

   ### `scrollToElement(ref, options)`

   `<scroller>` 支持滚动到某个指定的元素，可通过 `dom.scrollToElement()` 滚动到指定元素位置。

   #### 参数

   - `ref {refs}`：指定目标节点

   - `options {Object}`：可选项，属性为：

      - `offset {number}`：一个到其可见位置的偏移距离，默认是 0

       例如

```javascript
<template>
...
    <text ref="target-item">滚动到的目标元素</text>
</template>
<script>
  ...
    // 方法逻辑，滚动到目标元素
    onScrollTo() {
      const ref = this.$refs['target-item']
      this.$page.$dom.scrollToElement(ref, {offset: 0})
    },
  ...
</script>
```
