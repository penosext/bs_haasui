# 卡片圆角性能损耗

## 涉及样式

border-radius

### 性能损耗点

卡片圆角的抗锯齿特性

### 卡片圆角抗锯齿能力的开关

device/{target}/{target}.mk

```cmake
# border边缘抗锯齿 
add_definitions(-DENABLE_BORDER_ANTIALIAS)
```

### 自带抗锯齿的场景

- 背景色圆角
- 背景图圆角
- 文字
- img图片圆角

### 性能损耗的抗锯齿场景

- 带圆角的卡片内部内容

```vue
<template>
  <div>
    <div ref="card_container" style="border-radius: 10px; background-color: yellow;">
      <div ref="card_content" style="background-color: red; width: 100px; height: 100px;"></div>
    </div>
  </div>
</template>
```

以上card_container的背景色是自带抗锯齿效果的

以上card_content的背景色抗锯齿是依赖宏开关ENABLE_BORDER_ANTIALIAS，有较大性能损耗

### 优化思路

1. 去掉宏开关ENABLE_BORDER_ANTIALIAS
2. 扁平化，圆角样式直接指向到具体带背景色/图片等组件上



以下case都是自带抗锯齿效果的。

```javascript
<template>
  <div>
    <img ref="img" style="border-radius: 10px;" src="xxx.png"></img>
    <div ref="card_container" style="border-radius: 10px; background-color: red; width: 100px; height: 100px;"></div>
    <div ref="card_container" style="border-radius: 10px; background-image: url(xxx.png); width: 100px; height: 100px;"></div>
  </div>
</template>
```

