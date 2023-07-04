## 字库配置

## 关键字

字体，字库



框架支持系统级自定义字库配置（暂不支持App自定义字体）

## 配置

fongconfig遵循xml配置（/etc/miniapp/resources/fonts/fonts.xml），配置内容参考如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<familyset>
    <!-- first font is default -->
    <family name="PuHuiTi">
        <font weight="400">Alibaba-PuHuiTi-Regular.otf</font>
        <font weight="800">Alibaba-PuHuiTi-Bold.otf</font>
    </family>
    <family name="宋体">
        <font weight="400">songti.ttf</font>
    </family>
    <!-- icon fonts -->
    <family name="falcon-icons">
        <font weight="400">falcon-icons.ttf</font>
    </family>
    <!-- Fallback fonts -->
    <family>
        <font weight="400">Fallback-R.ttf</font>
        <font weight="600">Fallback-M.ttf</font>
        <font weight="800">Fallback-B.ttf</font>
    </family>
</familyset>
```

### family

family对应一个具有相同字符集的字体系列，可包含多个字体文件分别对应多个字重。其中xml中的第一个family配置为系统默认字体（在前端未设置font-family，或者family在fonts.xml中未定义时，使用默认字体）。

#### name

字体系列名称，前端CSS可使用【font-family: PuHuiTi】样式来指定使用的字体。name为空表示该字体为fallback备选字体，作用是在指定字体中找不到对应字符时，会尝试降级到备选字体中（备选字体可以多个，按照xml配置顺序来查找）。

#### font

表示字体系列中的一个字体文件，可支持相对路径（/etc/miniapp/resources/fonts/目录）和绝对路径配置。其中font-weight表示字体的字重，对应前端CSS中的font-weight样式（100-900，bold，默认400），配置不全的会按照就近原则选择一个最接近的。

## 前端使用示例

```html
<template>
  <div>
    <text style="font-family: 宋体">宋体显示</text>
  </div>
</template>
```

