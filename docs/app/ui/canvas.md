# \<canvas>

## 简介

`<canvas>` 组件用来创建画布组件。

**基本用法**

```html
<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script>
export default {
  mounted() {
    let context = typeof createCanvasContext === 'function' ? createCanvasContext(this.$refs.canvas) : this.$refs.canvas.getContext('2d');
    context.fillStyle = "red";
    context.fillRect(0, 0, 100, 100);
  },
};
</script>
```

## 子组件

`<canvas>` 不支持子组件。

## 属性

| key      | 类型   | 描述     | 默认值 | 备注 |
| -------- | ------ | -------- | ------ | ---- |
| `width`  | number | 画布宽度 | 300    | 需>0 |
| `height` | number | 画布高度 | 150    | 需>0 |

## 样式

#### 通用样式

支持所有**通用样式**

- 盒模型
- `flexbox` 布局
- `position`
- `opacity`
- `background-color`

## 事件

- **通用事件** 支持所有**通用事件**。

## canvas接口

### 颜色、样式

| 接口                     | 类型           | 描述                                    | 备注                                                         |
| ------------------------ | -------------- | --------------------------------------- | ------------------------------------------------------------ |
| `fillStyle`              | Color/Gradient | 设置填充绘画的样式                      | ctx.fillStyle="white"\|grad                                  |
| `strokeStyle`            | Color/Gradient | 设置线条绘画的样式                      | ctx.strokeStyle="white"\|grad                                |
| `createLinearGradient()` | function       | 创建线性渐变（用在画布内容上）          | ctx.createLinearGradient(x0,y0,x1,y1)x0: 渐变开始点的 x 坐标y0: 渐变开始点的 y 坐标x1: 渐变结束点的 x 坐标y1: 渐变结束点的 y 坐标 |
| `createRadialGradient()` | function       | 创建放射状/环形的渐变（用在画布内容上） | ctx.createRadialGradient(x0,y0,r0,x1,y1,r1)x0: 渐变开始圆的 x 坐标y0: 渐变开始圆的 y 坐标r0: 开始圆的半径x1: 渐变结束圆的 x 坐标y1: 渐变结束圆的 y 坐标r1: 结束圆的半径 |
| `addColorStop()`         | function       | 规定渐变对象中的颜色和停止位置          | grad.addColorStop(stop,color)stop: 介于 0.0 与 1.0 之间的值，表示渐变中开始与结束之间的位置。color: 在结束位置显示的 CSS 颜色值 |

### 线条样式

| 接口         | 类型   | 描述                                   | 备注                               |
| ------------ | ------ | -------------------------------------- | ---------------------------------- |
| `lineWidth`  | number | 设置线条宽度，单位px                   | ctx.lineWidth=5                    |
| `lineCap`    | Enum   | 设置线条的结束线帽样式                 | ctx.lineCap='butt\|round\|square'  |
| `lineJoin`   | Enum   | 设置线条交叉的拐角样式                 | ctx.lineJoin='bevel\|round\|miter' |
| `miterLimit` | number | 设置最大斜接长度，lineJoin=miter时生效 | ctx.miterLimit=10                  |

### 矩形

| 接口           | 类型     | 描述             | 备注                        |
| -------------- | -------- | ---------------- | --------------------------- |
| `rect()`       | function | 创建矩形         | ctx.rect(0,0,100,100)       |
| `fillRect()`   | function | 填充矩形         | ctx.fillRect(0,0,100,100)   |
| `strokeRect()` | function | 绘制矩形(无填充) | ctx.strokeRect(0,0,100,100) |
| `clearRect()`  | function | 清除矩形像素     | ctx.clearRect(0,0,100,100)  |

### 路径

| 接口                 | 类型     | 描述                                                   | 备注                                                         |
| -------------------- | -------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `fill()`             | function | 填充当前路径                                           | ctx.fill()                                                   |
| `stroke()`           | function | 绘制当前路径(无填充)                                   | ctx.stroke()                                                 |
| `beginPath()`        | function | 开始或重置一条路径                                     | ctx.beginPath()                                              |
| `closePath()`        | function | 关闭路径(从当前点到起始点)                             | ctx.closePath()                                              |
| `moveTo()`           | function | 把路径移动到画布中的指定点，不创建线条                 | ctx.moveTo(100,100)                                          |
| `lineTo()`           | function | 添加一个新点，然后在画布中创建从该点到最后指定点的线条 | ctx.lineTo(100,200)                                          |
| `clip()`             | function | 从原始画布剪切当前路径尺寸的区域                       | ctx.clip()                                                   |
| `quadraticCurveTo()` | function | 创建二次贝塞尔曲线                                     | ctx.quadraticCurveTo(cpx,cpy,x,y)cpx: 控制点的 x 坐标cpy: 控制点的 y 坐标x: 结束点的 x 坐标y: 结束点的 y 坐标 |
| `bezierCurveTo()`    | function | 创建三次贝塞尔曲线                                     | ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y)cp1x: 第一个控制点的 x 坐标cp1y: 第一个控制点的 y 坐标cp2x: 第二个控制点的 x 坐标cp2y: 第二个控制点的 y 坐标x: 结束点的 x 坐标y: 结束点的 y 坐标 |
| `arc()`              | function | 创建弧/曲线（用于创建圆形或部分圆）                    | ctx.arc(x,y,r,sAngle,eAngle)x: 圆的中心的 x 坐标。y: 圆的中心的 y 坐标。r: 圆的半径。sAngle: 起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。eAngle: 结束角，以弧度计。 |
| `arcTo()`            | function | 创建两切线之间的弧/曲线                                | ctx.arcTo(x1,y1,x2,y2,r)x1: 弧的起点的 x 坐标。y1: 弧的起点的 y 坐标。x2: 弧的终点的 x 坐标。y2: 弧的终点的 y 坐标。r: 弧的半径。 |

### 转换

| 接口             | 类型     | 描述                                          | 备注                                                         |
| ---------------- | -------- | --------------------------------------------- | ------------------------------------------------------------ |
| `scale()`        | function | 缩放当前绘图至更大或更小                      | ctx.scale(0.5,0.5)                                           |
| `rotate()`       | function | 旋转当前绘图                                  | ctx.rotate(angle)angle: 旋转弧度                             |
| `translate()`    | function | 平移当前绘图                                  | ctx.translate(10,10)                                         |
| `transform()`    | function | 替换绘图的当前转换矩阵                        | ctx.transform(a,b,c,d,e,f)a: 水平缩放绘图b: 垂直倾斜绘图c: 水平倾斜绘图d: 垂直缩放绘图e: 水平移动绘图f: 垂直移动绘图 |
| `setTransform()` | function | 将当前转换重置为单位矩阵。然后运行transform() | ctx.setTransform(a,b,c,d,e,f)                                |

### 文本

| 接口            | 类型     | 描述                       | 备注                                                         |
| --------------- | -------- | -------------------------- | ------------------------------------------------------------ |
| `font`          | String   | 设置当前文字样式           | ctx.font="font-style font-weight font-size"font-style: normal/italic(可选)font-weight: normal/bold(可选)font-size: 字号，像素单位 |
| `fillText()`    | function | 在画布上绘制“被填充的”文本 | ctx.fillText(text,x,y,maxWidth)text: 文本字符串x: 开始绘制文本的 x 坐标位置y: 开始绘制文本的 y 坐标位置maxWidth: 可选。允许的最大文本宽度，以像素计。 |
| `strokeText()`  | function | 在画布上绘制文本（无填充） | ctx.strokeText(text,x,y,maxWidth)同fillText                  |
| `measureText()` | function | 返回包含指定文本宽度的对象 | ctx.measureText(text).widthtext: 要测量的文本字符串result: width 测量的文本宽度 |

### 图像

| 接口        | 类型     | 描述             | 备注                                                         |
| ----------- | -------- | ---------------- | ------------------------------------------------------------ |
| `drawImage` | function | 向画布上绘制图像 | ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)img: 要使用的图像(image标签)sx: 可选。开始剪切的 x 坐标位置。sy: 可选。开始剪切的 y 坐标位置。swidth: 可选。被剪切图像的宽度。sheight: 可选。被剪切图像的高度。x: 在画布上放置图像的 x 坐标位置。y: 在画布上放置图像的 y 坐标位置。width: 可选。要使用的图像的宽度。（伸展或缩小图像）height: 可选。要使用的图像的高度。（伸展或缩小图像） |

### 像素操作

| 接口              | 类型     | 描述                                                      | 备注                                                         |
| ----------------- | -------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| `createImageData` | function | 创建新的、空白的 ImageData 对象                           | ctx.createImageData(width,height)                            |
| `getImageData()`  | function | 返回 ImageData 对象，该对象为画布上指定的矩形复制像素数据 | ctx.getImageData(x,y,width,height)                           |
| `putImageData()`  | function | 把图像数据（从指定的 ImageData 对象）放回画布上           | ctx.putImageData(imgData,x,y)x: ImageData 对象左上角的 x 坐标，以像素计。y: ImageData 对象左上角的 y 坐标，以像素计。 |

### 合成

| 接口                       | 类型   | 描述                                       | 备注                                                         |
| -------------------------- | ------ | ------------------------------------------ | ------------------------------------------------------------ |
| `globalAlpha`              | Number | 设置当前透明值，全局生效                   | ctx.globalAlpha=0.5                                          |
| `globalCompositeOperation` | Enum   | 设置混合模式，新图像如何绘制到已有的图像上 | ctx.globalCompositeOperation="source-over\|source-atop\|source-in\|source-out\|destination-over\|destination-atop\|destination-in\|destination-out\|lighter\|copy\|xor"source-over: 默认值，在目标图像上显示源图像。 |

### 其他

| 接口        | 类型     | 描述                           | 备注          |
| ----------- | -------- | ------------------------------ | ------------- |
| `save()`    | function | 保存当前环境的状态             | ctx.save()    |
| `restore()` | function | 返回之前保存过的路径状态和属性 | ctx.restore() |
