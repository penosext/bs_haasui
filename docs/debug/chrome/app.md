# App调试技巧

## JS层产生异常traceback时如何定位

1. 需要关闭压缩选项（-c -q -p），即使用 npm run build:dev 编译

如果开启 -c 则生成 js 文件变为一行，且符号混淆压缩，因此无法准确定位

```c
  -c, --compress  是否压缩脚本 (default: false)
  -q, --qjsc      是否使用qjsc预编译 (default: false)
  -p, --pack      是否打包 (default: false)
```

2. 运行复现崩溃可以查看到完整堆栈

通过查看堆栈可以定位 js 产物中的具体位置，从而定位逻辑问题



## 编译选项说明

- "build": "aiot-cli -p"，编译并打包（不压缩，不生成bin）
  - **用于调试环境**，有完整堆栈，amr 包可推送设备
- "build:dev": "aiot-cli"，编译（不压缩，不生成bin，不打包）
  - **用于调试环境**，有完整堆栈
- "build:bin": "aiot-cli -q -p"，编译，生成bin，打包（不压缩）
- "build:prod": "aiot-cli -c -q -p"，编译，压缩，生成bin，打包
  - **用于测试/线上环境**，高性能，低内存
- "build:bin-nopack": "aiot-cli -q"，编译，生成bin（不压缩，不打包）