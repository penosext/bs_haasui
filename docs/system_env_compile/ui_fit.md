# 不同系统适配要求

  框架已支持的系统

嵌入式系统：Linux、阿里云AliOS 3.1 & 3.3、 平头哥Yoc

PC系统：Windows、MacOS、ubuntu

#### 开发语言

C++ 11 

#### Posix接口

- 线程操作：pthread，包含mutex、condition
- 文件IO：fopen/fread等，stdout/printf等
- 库函数：包括数学库、字符串库等
- 时间：timer/clock
- 内存分配：malloc/free等
- 网络操作：socket（debug模式依赖）非必须

#### 调试方面

- adb：安装应用和调试，非必须，**但强烈建议支持**