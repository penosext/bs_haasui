# crypto-加解密

  1. 概述

crypto 提供加解密算法，如哈希计算等

# 2. 模块使用方式

```javascript
import crypto from 'crypto'
```

# 3. 方法

## 3.1 Hash构造函数

参数：

- hashMethod： hash的方法，可选值目前只有 md5

返回值：

- Hash 对象

## 3.2 Hash.hashFile接口

**参数**

- path: 文件路径

**返回值**

- 返回hash值，具体的hash方法由 crypto.Hash 构造函数决定

**用法**

对某个文件计算 md5 值

```javascript
const md5 = new crypto.Hash('md5')
const fpath = '/etc/resolv.conf'
const hexdigest = await md5.hashFile(fpath)
console.log(`hash file ${fpath}, md5: ${hexdigest}`)
```





