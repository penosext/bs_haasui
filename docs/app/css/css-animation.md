## CSS动画

## 简介

应用支持通过Animation模块动画,也支持css3动画

Animation动画参考文档:页面模块-Animation

## css3动画

注意:

1.暂时不支持多个动画属性分开设置.如果有类似的需求,需要写成两个css样式.

2.transition不支持多个属性连写.

```css
/*多个属性动画使用不同的配置,请分开使用多个样式写*/
.transition-demo1{
	transition: width 2000ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
.transition-demo2{
	transition: height 2000ms linear;
}

/*下面的写法在打包时会提示错误*/
.transition-demo-wrong{
	transition: width 2000ms linear, height 1000ms ease;	/*编译提示错误*/
}
```



示例:

```html
<template>
  <div class="main">
    <text class="title">css动画</text>
    <div class="anim-obj-wrap">
      <div :class="'anim-obj ' +  cls "></div>
    </div>
    <div class="button-wrap">
      <div
        class="button"
        @click="doAnim('anim-obj-move')">
        <text class="button-text">移动</text>
      </div>
      <div
        class="button"
        @click="doAnim('anim-obj-rotate')">
        <text class="button-text">旋转</text>
      </div>
      <div
        class="button"
        @click="doAnim('anim-obj-size')">
        <text class="button-text">尺寸</text>
      </div>
      <div
        class="button"
        @click="doAnim('anim-obj-bg')">
        <text class="button-text">背景颜色</text>
      </div>
      <div class="button" @click="reset()">
        <text class="button-text">复原</text>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cls: "",
    };
  },
  methods: {
    doAnim(cls) {
      this.cls = cls;
    },

    reset() {
      this.cls = '';
    },
  },
};
</script>
<style scoped>
.main {
  justify-content: flex-start;
  align-items: flex-start;
  position:relative;
  background: #f7f7f7;
  display:flex;
  flex-direction: column;
}
.button-text{
  font-size:22px;
  line-height: 40px;
  color:#ffffff;
}
.button-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  background-color: #eee;
  margin-bottom: 20px;
}

.button{
  background-color: #7B72E9;
  border-color:#7B72E9;
  border-radius: 50px;
  height:40px;
  padding:0 20px;
  display: flex;
  align-items: center;
  color:white;
  margin:5px;
}

.title{
  font-weight: bold;
  font-size: 30px;
}
.anim-obj-wrap {
  height: 400px;
  display: flex;
  position: relative;
}

.anim-obj {
  position: relative;
  width: 100px;
  height: 100px;
  margin-left: 200px;
  margin-top: 200px;
  background-color: #999;
  justify-content: center;
  transition: all 2000ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

.anim-obj-move {
  margin-left: 0px;
  margin-top: 0px;
}

.anim-obj-bg {
  background-color: #7b72e9;
}

.anim-obj-size {
  width: 200px;
  height: 200px;
}

.anim-obj-rotate {
  transform: rotate(360deg);
  transform-origin: center center;
}

</style>
```

