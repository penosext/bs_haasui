# 文件操作扩展

  1.概述

封装了基本的文件操作

## 2.模块使用方式

```javascript
import { wfs } from "wfs"
const f = new wfs()
```

## 3.方法

### 3.1 open 打开文件

#### 参数

- filename ： 文件路径
- mode ： 标准fopen的mode，搜索‘fopen函数mode参数详解’了解详情 

#### 返回值

- 成功返回0
- 失败返回异常信息

#### 用法示例

```javascript
let ret = f.open({ filename: "/home/walos/test.text", mode: "wb" })
```

### 3.2 close 关闭

#### 返回值

- 成功返回0

#### 用法示例

```javascript
f.close()
```

### 3.3 read 读取

#### 参数

- size ： 读取长度

#### 返回值

- promise 成功返回二进制数据，失败返回0

#### 用法示例

```javascript
let data = await f.read({ size: size })
if (data == 0) {
  f.close()
  return null
}
console.log(String.fromCharCode.apply(null, new Uint8Array(data)))
```

### 3.4 write_bin 写文件

#### 参数

- 二进制数据

#### 返回值

- promise 成功返回0，失败抛出异常

#### 用法示例



```javascript
stringToUint8Array(str) {
  var arr = []
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i))
  }
  var tmpUint8Array = new Uint8Array(arr)
  return tmpUint8Array
}

let data="1234"
ret = await f.write_bin(stringToUint8Array(data))
```

### 3.5 fseek 读写文件时指定偏移量，同linux的fseek

```javascript
f.fseek({ offset: offset, whence: 0 })
```

