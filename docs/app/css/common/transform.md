# Transform

1. ## 简介

   除了`perspective`和`transform-origin`，`transition`支持了`transform`的全部能力。 其中`transform`的`rotate` 和`rotatez` 等效.

   目前支持的 transform 声明格式:

   - `translateX({<length/percentage>})`：X 轴方向平移，支持长度单位或百分比。
   - `translateY({<length/percentage>})`：Y 轴方向平移，支持长度单位或百分比。
   - `translate({<length/percentage>} {<length/percentage>})`：X 轴和 Y 轴方向同时平移，`translateX` + `translateY` 简写。
   - `scaleX(<number>)`：X 轴方向缩放，值为数值，表示缩放比例，**不支持百分比**。
   - `scaleY(<number>)`：Y 轴方向缩放，值为数值，表示缩放比例，**不支持百分比**。
   - `scale(<number>)`：X 轴和 Y 轴方向同时缩放，`scaleX` + `scaleY` 简写。
   - `rotate(<angle/degree>)`：将元素围绕一个定点（由 `transform-origin` 属性指定）旋转而不变形的转换。指定的角度定义了旋转的量度。若角度为正，则顺时针方向旋转，否则逆时针方向旋转。
   - `rotateX(<angle/degree>)`：X 轴方向的旋转。
   - `rotateY(<angle/degree>)`：Y 轴方向的旋转。
   - `rotateZ(<angle/degree>)`：Z 轴方向的旋转。
   - `transform-origin {length/percentage/关键字(top/left/right/bottom)}:`：设置一个元素变形的原点，**仅支持 2D 坐标**。

   ## 示例

   ```plain
   <template>
     <div class="wrapper">
       <div class="transform">
        <text class="title">Transformed element</text>
       </div>
     </div>
   </template>
   <style>
     .transform {
       align-items: center;
       transform: translate(150px, 200px) rotate(20deg);
       transform-origin: 0 -250px;
       border-color:red;
       border-width:2px;
     }
     .title {font-size: 48px;}
   </style>
   ```

   

   在 native 端，给组件设置 `transform` 变换后，如果需要恢复原效果，不能直接删除对应的 `transform` 属性，而需要重新设置一个 `transform` 将元素变换恢复。