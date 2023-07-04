## Less支持

## 简介

框架预置Less支持.Less 是一门 CSS 预处理语言,它扩展了 CSS 语言,增加了变量、Mixin、函数等特性.详细的Less内容可参考:[Less官方文档](http://lesscss.org/).

## 启用Less

在框架工程中启动Less只需要设置vue文件中的style标签的lang属性为less即可.支持内联和外联

```plain
<template>
  ...
</template>
<script>
  ...
</script>

<!-- 外联less -->
<style lang="less" src="./default.less" scoped></style>

<!-- 内联less -->
<style lang="less" scoped>
@text-color-default:#cccccc;
.text-common{
  color:@text-color-default;
}
.text-content{
  .text-common();
}
</style>
```

## 注意

- Less： @import 路径不支持@开头的缩写,请使用相对路径引入
