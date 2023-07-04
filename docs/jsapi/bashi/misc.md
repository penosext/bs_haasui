# 其它杂项

  1.概述

封装的其它接口

## 2.模块使用方式

```javascript
import { misc } from "misc"
```

## 3.方法

### 3.1  reboot 重启

#### 返回值

- 0

#### 用法示例

```javascript
misc.reboot()
```

### 3.2  chipid 获取设备唯一id

#### 返回值

- promise 

#### 用法示例

```javascript
misc.chipid().then(res=>{
  console.log(res.cid)
}).catch(err=>{})
```

### 3.3 gbk_to_utf8 gbk字符串转为utf8

#### 参数

- input ：输入字符串

#### 返回值

- promise 

#### 用法示例

```javascript
misc.gbk_to_utf8({input:""}).then(res=>{
  console.log(res.output)
}).catch(err=>{})
```

### 3.4 utf8_to_gbk utf8字符串转为gbk

#### 参数

- input ：输入字符串

#### 返回值

- promise 

#### 用法示例

```javascript
misc.utf8_to_gbk({input:""}).then(res=>{
  console.log(res.output)
}).catch(err=>{})
```

