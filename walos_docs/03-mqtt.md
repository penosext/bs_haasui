# 接入第三方MQTT服务前需要修改配置
--------

##### MQTT连接配置：
1. 心跳(mqtt协议心跳，非应用层心跳)：MQTT本身的心跳设置为1分钟；
2. QOS：QOS设为0
3. Retain：Retain设为0
4. Cleansession：Cleansession设为1
5. 重连时间：30秒

##### MQTT服务器信息
需要通过mqtt-set指令或工具配置MQTT服务器信息，如下：

```json 
{
    "host":"192.168.20.102",
    "port":1883,

    "client_id":"client_id_xxx", // 如果为空，则使用device id
    "user":"user-name",// 如果为空，则使用device id
    "passwd":"passwd",// 如果为空，则使用deviceid的默认加密方式

    "topic_pub":"topic/service", // 以/结尾则自动加设备id
    "topic_sub":"topic/device", // 以/结尾则自动加设备id
}
```

#### MQTT接入
类似Websocket接入过程包括以下步骤：

​	同步时间：设备向平台发送同步时间请求

​	同步时间正常响应之后，设备才会进入正常工作状态

当设备连接后，设备每10秒向平台发送一次心跳信息，连续3次平台没有响应心跳，则设备断开连接。


##### 同步时间

- 请求

```json
{
    "action":"sync-time", // webapi模式请求设备时为device-synctime
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
    },
    "body":{
        "timezone":-480,        // 时区；与格林尼治时间差的分钟数，负数为东区，正数为西区，如不填写，则使用出厂默认设备东8区
        "timestamp":161589233   // 1970.1.1 开始的秒数；
    }
}
```

> **至此，设备进入被动模式，接收来自平台的指令，完成任务并返回响应**
>
> 被动模式下，设备仅会向设备发送三种消息：
>
> 1. 心跳，每10秒一次； 
>
> 2. 同步时间，不定期，间隔1小时以上； 
>
> 3.  事件上报；
>
>    除上述指令外，设备执行平台的指令


##### 心跳消息

- 请求：

```json
{
    "action":"ping",
    "header":{
        "reqid":"192839",       
    },
}
```

- 响应：

```json
{
    "retcode":0,                 // 激活成功
    "header":{
        "reqid":"192839",         
    }
}
```



#### 配置MQTT服务器信息
- 请求

```json 
{
    "action": "mqtt-set",
    "header":{
        "reqid":"129393"        
    },

    "body":{
        "host":"192.168.20.102",
        "port":1883,

        "client_id":"client_id_xxx", // 如果为空，则使用device id
        "user":"user-name",// 如果为空，则使用device id
        "passwd":"passwd",// 如果为空，则使用deviceid的默认加密方式

        "topic_pub":"topic/service", // 以/结尾则自动加设备id
        "topic_sub":"topic/device", // 以/结尾则自动加设备id
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
    }
}
```

##### 获取MQTT服务器信息

- 请求

```json 
{
    "action": "mqtt-get",
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
        "host":"192.168.20.102",
        "port":1883,

        "client_id":"client_id_xxx", // 如果为空，则使用device id
        "user":"user-name",// 如果为空，则使用device id
        "passwd":"passwd",// 如果为空，则使用deviceid的默认加密方式

        "topic_pub":"topic/service", // 以/结尾则自动加设备id
        "topic_sub":"topic/device/client_id_xxx", // 以/结尾则自动加设备id
    }

}
