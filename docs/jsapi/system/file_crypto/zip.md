# zip-压缩/解压

  1. 概述

zip 模块可以操作zip格式的压缩文件，暂时仅支持解压操作

# 2. 模块使用方式

```javascript
import zip from 'zip'
```

# 3. 方法

## 3.1 extractall()

**参数**

- outPath：解压目录

**返回值**

- 异步方法，返回0为成功，非0 为失败

**用法：**可以解压zip文件到指定目录，递归解压所有文件

```javascript
const zfile = new zip.ZipFile('/tmp/test.zip')
let ret = await zfile.extractall('/tmp/test_extract')
console.log(`zip.extractall ret ${ret}`)
```
