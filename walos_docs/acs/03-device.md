# 设备管理
------------

#### 说明

>请求类型: POST
>HTTP头：token = , 使用登陆时返回的token
>请求消息体:JSON
>返回消息体:JSON, retcode = 0时正确， 非0时出错

独立模式时：
>请求URL: http://dev-ip-addr:port:/api/v3.x/device
>HTTP头：token = , 使用登陆时返回的token
#### 获取设备信息

- 请求

```json
{
    "action":"device-info", 
    "header":{
        "reqid":"129393"      
    },
    "body":{
    }
}
```

- 响应

```json
{
    "retcode":0,
    "header":{
        "reqid":"129393"         
    },
    "body":{
        "device-id":"",
        "product-id":"",//产品名
        "hardware-version":"x2500-v100",
        "walos-version":"v1.0.0",//软件版本
        "algm-version":"jz",
        "algm-vendor":"0.1",
        "ip":"",
        "total_user":0,//用户数
        "total_face":0//特征数
    }
}
```
#### 设置时间

- 请求

```json
{
    "action":"device-synctime", 
    "header":{
        "reqid":"129393"      
    },
    "body":{
        "timezone":-480,
        "timestamp":161589233
    }
}
```

> timezone : 时区；与格林尼治时间差的分钟数，负数为东区，正数为西区，如不填写，则使用出厂默认设备东8区
> timestamp ： 1970.1.1 开始的秒数；

- 响应

```json
{
    "retcode":0,
    "header":{
        "reqid":"129393"         
    }
}
```

#### 设备重启

- 请求

```json
{
    "action":"device-reboot",
    "header":{
        "reqid":"129393"        
    }
}
```

- 响应

```json
{
    "retcode":0,
    "header":{
        "reqid":"129393"        
    }
}
```


#### 设备重置

- 请求

```json
{
    "action":"device-reset",

    "header":{
        "reqid":"129393"        
    }
}
```

>清空用户信息、日志信息等

- 响应

```json
{
    "retcode":0,
    "header":{
        "reqid":"129393"         
    }
}
```

#### 远程开门

- 请求

```json
{
    "action":"device-opendoor",
    "header":{
        "reqid":"129393"        
    },
    "body":{
        "userid":"1avsoHu2EeqZmH943F8eUg==",
        "type":"open", // "open" - 开门动作(不填默认为开门); "close“关门动作；"silent"开门但不播放声音
        "delay":12,    // 延时多久关门，不填只默认5s，-1为常开或常闭
    }
}
```

- 响应

```json
{
    "retcode":0,
    "header":{
        "reqid":"129393"        
    }
}
```

#### 上传文件

**上传文件，单次数据长度必须在64kB以内，其data数据在转base64前应以64kB长度切片**

- 请求

```json
{
    "action":"device-upload",
    "header":{
        "reqid":"129393"       
    },
    "body":{
        "type":"upgrade",
        "filesize":32678,
        "filename":"walos-v2.3.4.bin",
        "offset":4096,
        "size": 4096,
        "data":"base64-encoded file data"
    }
}
```

>type : 上传数据的类型，升级文件
>filename : 升级文件名
>filesize : 文件总的长度
>offset : 当前数据片段起始位置
>size : 当前数据片段长度
>data : base64编码的数据

- 响应

```json
{
    "retcode":0,
    "header":{
        "reqid":"129393"         
    }
}
```

#### ~~升级设备~~

- 请求

```json
{
    "action":"device-upgrade",

    "header":{
        "reqid":"129393"        
    },

    "body":{
        "filename":"walos-v2.3.4.bin"   // 选填，暂时不启作用
    }
}
```

- 响应

```json
{
    "retcode":0,

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    }
}
```

#### ~~传感器快照~~

- 请求

```json
{
    "action":"device-snapshot",

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },
}
```

> 获取设备摄像头的快照图片

- 响应

```json
{
    "retcode":0,

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },

    "body":{
        "timestamp": "1587985190"   // 快照时间戳，用于读取快照的ID
    }
}
```

>timestamp 为获取快照的时间戳，下载快照时需要此数据

#### 下载文件

- 请求

```json
{
    "action":"device-download",

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },
    
    "body":{
        "type":"snapshot",      // snapshot,快照图片； logr,识别日志图片；
        "chanel":0,
        "offset":0,
        "size": 32000,
        "timestamp":1584518255389,  // 生成快照的时间或识别日志图片生成时间
        "seqnum": 6,                // 事件编号，下载识别日志图片时填写，当填写seqnum时，忽略timestamp值
    }
}
```

> timestamp : 生成快照时返回的时间戳
> chanel : 准备获取的摄像头通道，目前仅支持chanel 0，红外通道暂不支持

- 响应

```json
{
    "retcode":0,

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },
    
    "body": {
        "type":"snapshot",
        "filesize":32678,
        "filename":"SNAP0-1584518255389.jpg",
        "offset":0,
        "size": 32000,
        "data":"base64-encoded file data"
    }
}
```







