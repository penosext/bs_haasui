# ~~广告管理-x2500未实现该部分~~
----------

#### 说明

>请求类型: POST
>HTTP头：token = , 使用登陆时返回的token
>请求消息体:JSON
>返回消息体:JSON, retcode = 0时正确， 非0时出错

独立模式时：
>请求URL: http://dev-ip-addr:port:/api/v3.x/advt
>HTTP头：token = , 使用登陆时返回的token

**id 大小不超过32Bytes**

#### 添加广告图片

**上传广告文件，单次数据长度必须在128kB以内，其data数据在转base64前应以128kB长度切片**、

- 请求

```json
{
    "action":"advt-insert",

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },

    "body":{
        "id":"9ssosxlsiw",
        "effect":1929292,       // 广告长效时间
        "expire":1593282304,    // 广告过期时间
        "duration":30,          // 广告单次展示的秒数
        "filesize":329382,      // 广告图片文件大小，建议分片大小在64KB，最好不超过128KB
        "offset":0,             // 本次传输的图片的偏移
        "size":3200,            // 本次传输的数据片大小，base64编码前的大小
        "data":"base64 encoded data"    // 本次传输的数据片数据，base64编码
    }
}
```

>expire : 过期时间，EPOCH 秒值
>duration : 此广告播放时间时延，默认设备配置页中的广告时延值

- 响应

```json
{
    "retcode":0,
    
    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },
}
```

#### 删除广告图片

- 请求

```json
{
    "action":"advt-remove",

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },

    "body":{
        "id":"9ssosxlsiw"
    }
}
```

- 响应

```json
{
    "retcode":0,
    
    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },
}
```

#### 查询广告图片

- 请求

```json
{
    "action":"advt-lookup",

    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },

    "body":{
        "ads":[
            { "id":"9ssosxlsiw" },
            { "id":"isjdwew938" }
        ]
    }
}
```

- 响应

```json
{
    "retcode":0,
    
    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },
    
    "body":{
        "ads":[
            {
                "id":"9ssosxlsiw"
                ... // 其它信息，参考本章头部广告对象信息
            },
            {
                "id":"isjdwew938"
                ... // 其它信息，参考本章头部广告对象信息
            }
        ]
    }
}
```

#### 列举广告图片

- 请求

```json
{
    "action":"advt-fetch",
    
    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },

    "body":{
        "offset":0,
        "limit":10
    }
}
```

- 响应

```json
{
    "retcode":0,
    
    "header":{
        "reqid":"129393"         // 透传值，设备内唯一
    },

    "body":{
        "ads":[
            {
                "id":"9ssosxlsiw"
                ... // 其它信息，参考本章头部广告对象信息
            },
            {
                "id":"isjdwew938"
                ... // 其它信息，参考本章头部广告对象信息
            }
        ]
    }
}
```
