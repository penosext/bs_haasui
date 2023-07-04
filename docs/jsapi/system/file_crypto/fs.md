# fs-文件操作

# 概述

fs 提供文件操作接口（仅支持当前应用路的data目录操作）

# 2. 模块使用方式

```javascript
import fs from 'fs'
```

# 3. 方法

## 3.1 readdir接口

**参数**

- path: 读取的目录路径
- options：{withFileTypes: true}

**返回值**

- 如果 withFileTypes 为false （默认）则返回文件名称列表
- 如果 withFileTypes 为 true 则返回详细信息 fs.Dirent 列表

**用法**

读取某路径下所有文件名

```javascript
const flist = await fs.readdir('.')
for (let fname of flist) {
  console.log(`fname ${fname}`)
}
console.log(`== dirent case ==`)
const dirents = await fs.readdir('.', {
  withFileTypes: true
})
for (let dirent of dirents) {
  console.log(`fname ${dirent.name} isFile ${dirent.isFile()} isDir ${dirent.isDirectory()}`)
}
```

## 3.2 Dirent 结构体

**成员：**

- Dirent.name 文件名称

方法：

- isDirectory() 目录
- isFile() 文件

## 3.3 stat 接口

**参数**

- path：文件路径

**返回值**

- stat对象，字段与 linux struct stat 一致，见 3.4 stat 结构体

**用法**

读取某路径的stat 信息

```javascript
const stat = await fs.stat('.')
console.log(`stat . ${JSON.stringify(stat)}`)
```

## 3.4 stat 结构体

**成员：**

- size：file size, in bytes
- atimeMs：time of last access
- mtimeMs：time of last data modification
- birthtimeMs：time of file creation(birth)

## 3.5 exists 接口

**参数**

- path：文件路径

**返回值**

- 存在返回 true，不存在返回 false

**用法**

判断某路径是否存在

```javascript
const fpath = "/etc/resolv.conf"
const ret = await fs.exists(fpath)
console.log(`fs.exists ret ${ret}`)
```

## 3.6 readFile 接口

**参数**

- path：文件路径

**返回值**

- 返回文件内容（目前支持读取文本文件）

**用法**

读取某个文件

```javascript
const fpath = "/etc/resolv.conf"
const ret = await fs.readFile(fpath)
console.log(`fs.readFile ret ${ret}`)
```

## 3.7 mkdir 接口

**参数**

- path：文件路径，可递归创建

**返回值**

- 成功返回 true，失败返回 false

**用法**

递归创建文件夹

```javascript
const dir0 = './__test_fs_dir'
const dir1 = './__test_fs_dir/_inner'
let ret = await fs.mkdir(dir1)
console.log(`mkdir dir1 ret: ${ret}`)
ret = await fs.exists(dir0)
console.log(`exists dir0 ret: ${ret}`)
```

## 3.8 rm 接口

**参数**

- path：文件路径，可递归删除文件、文件夹

**返回值**

- 成功返回 true，失败返回 false

**用法**

递归创建文件夹

```javascript
const dir0 = './__test_fs_dir'
const dir1 = './__test_fs_dir/_inner'
ret = await fs.rm(dir0)
console.log(`rm dir0 ret: ${ret}`)
ret = await fs.exists(dir1)
console.log(`exists dir1 ret: ${ret}`)
```

