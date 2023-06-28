# 注册登陆
--------

#### 获取设备地址

向同网段的6543端口发送广播报文，可以获取到设备的信息响应，在任意模式下，设备都会响应扫描请求，扫描请求/响应与设备的管理模式无关

```json
{
    "action":"scan"
}       
```

如果该地址段有WalOS在网设备（通常接到同一个交换机，在二层网络上相通，IP地址在同一个网段），会响应：

```json
{
    "device-id":"device-id" // 设备ID
}
```

> 此时便可以获取到目标设备的ID以及设备的IP地址信息，当设备无licence时返回的设备id为no-licence

#### WebAPI服务
设备会启动WebAPI server，提供基于Http的API接口，此时对于接放的访问需要进行认证。

>请求URL: http://dev-ip-addr:port/api/v3.x/auth
>请求类型: POST
>请求消息体:JSON
>返回消息体:JSON, retcode = 0时正确， 非0时出错

##### 接入认证

- 请求：

```json
{
    "action":"auth-login",
    "header":{
        "reqid":"192839",   // 透传值，设备内唯一
    },
    "body":{
        "user":"admin", // 默认用户名
        "passwd":"9990BC737DD5B17E7A5F01B48B2C08AE" // 默认密码
    }
}
```

- 响应：

```json
{
    "retcode":0,
    "header":{
        "reqid":"192839",   // 透传值，设备内唯一
    },
    "body":{
        "token":"823lsefhw03slej",
        "timestamp":1560392020,
    }
}
```

> token用于后续api请求时的http header的Token字段，后续的访问必须设置 Token 字段
> 注意，HTTP Header中的Token字段大小写：Token


##### 修改管理员密码

- 请求：

```json
{
    "action":"auth-passwd",
    "header":{
        "reqid":"192839",         // 透传值，设备内唯一
    },
    "body":{
        "user":"admin",
        "passwd":"admin-new-passwd"
    }
}
```

- 响应：

```json
{
    "retcode":0,
    "header":{
        "reqid":"192839",         // 透传值，设备内唯一
    }
}
```

#### [接入MQTT服务](03-mqtt)

> 设备默认接入模式为MQTT协议接入
