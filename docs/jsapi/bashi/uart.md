# **串口**

## 1.概述

封装了基本的音视频的使用

## 2.模块使用方式

```javascript
import { uart } from "uart"
let.com2 = new uart()
```

## 3.视频方法

### 3.1 open

#### 参数

- baudrate ： 波特率
- port ：串口编号
- nbits ：数据位
- parity ： 校验位
- sbits ：停止位
- mode ：0表示自行读取串口数据，1表示通过on回调串口数据

#### 返回值

- promise 成功0 失败抛出异常

#### 用法示例

```javascript
com2.open({
  port: 2,
  baudrate: 115200,
  nbits: 8,
  parity: "N",
  sbits: 1,
  mode: 0,
})
```

### 3.2 close

#### 返回值

- 0

#### 用法示例

```javascript
com2.close()
```

### 3.3 write

#### 参数

- 二进制数据

#### 返回值

- promise 返回写结果

#### 用法示例

```javascript
com2.write(new Uint8Array([0xa1,0xa2,0xa4]))
```

### 3.3 read

#### 参数

- bytes ：长度
- timeout :  超时时间 ms

#### 返回值

- promise 成功为读到数据，未读到数据抛出异常



若涉及中文则需注意编码格式

#### 用法示例

```javascript
function toHexString(bytes) {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  )
}

com2
  .read({ bytes: len, timeout: 30 })
  .then((res) => {
    let bufarry = new Uint8Array(res)
    console.log(toHexString(bufarry))
  })
  .catch(err=>{
    
  })
```

### 3.4 on("data")回调，open mode为1时生效

```javascript
com2.on("data", (res) => {
  console.log(toHexString(new Uint8Array(res)))
})
```

