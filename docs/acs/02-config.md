# 配置管理
------

## 说明

>请求消息体:JSON
>返回消息体:JSON, retcode = 0时正确， 非0时出错

独立模式时：
>请求URL: http://dev-ip-addr:port:/api/v3.x/device
>请求类型: POST
>HTTP头：token = , 使用登陆时返回的token

#### 查询设备的配置项：

- 请求

```json
{
    "action": "config-fetch",
    "header":{
        "reqid":"192839"        
    }
}
```

- 响应

```json
{
    "retcode": 0,
    "header":{
        "reqid":"192839"        
    },
    "body":{
        "configs":[
        {
            "key":"door-id",        //key 
            "value":"Build1 Door2", //值，所有值均为string，数字也是转为string
            "class":"baseConfig",   //分类
            "itemTitle" : "设备名字", //配置名
            "input" : "text"        //输入类型，文字，还是数字，ip，选择列表等
        },
        {
      		"key": "volume-out",
      		"value": "100",
      		"class": "baseConfig",
     		"input": "range",
      		"itemTitle": "音量",
      		"rangStart": 0,
      		"rangeEnd": 100,
      		"rangStep": 1,
    	},
        {
      		"key": "turnoff-screen",
      		"value": "disable",
      		"class": "baseConfig",
      		"input": "select",
      		"itemTitle": "空闲时是否关闭屏幕",
      		"items": [
        		{ "value": "disable", "show": "不关闭" },
      		],
    	},
        ],
    }
}
```

####  配置设备

- 请求

```json
{
    "action": "config-set",
    "header":{
        "reqid":"192839"        
    },
    "body":{
        "configs": [
            {
                "key":"door-id",
                "value":"大门门禁"
            },
            {
                "key":"volume-out",
                "value":"80"
            },
            {
                "key":"turnoff-screen",
                "value":"disable"
            }
        ]
    }
}
```

- 响应

```json
{
    "retcode": 0,
    "header":{
        "reqid":"192839"     
    },
    "body": {       // 返回成功配置好的配置项，配置失败的不返回
        "configs": [
            {
                "key":"relay-mode",
            },
            {
                "key":"therm-mode",
            }
        ]
    }
}
```

> 成功的配置项会返回，未成功的则不回返

####  配置说明

> 以下为可配置数据与说明，实际使用时，同一类型的配置项(class)最好一次下发，部分配置重启才能生效。对于多数场景，使用系统默认配置即可。
> 正确的配置步骤：1. 平台先获取设备当前配置； 2. 修改需要调整的配置项； 3. 整个下发配置到设备； 4.重启设备。

