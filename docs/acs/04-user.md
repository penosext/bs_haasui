# 帐户管理
-----------

#### 说明

>请求类型: POST
>HTTP头：token = , 使用登陆时返回的token
>请求消息体:JSON
>返回消息体:JSON, retcode = 0时正确， 非0时出错

独立模式时：
>请求URL: http://dev-ip-addr:port:/api/v3.x/acm
>HTTP头：token = , 使用登陆时返回的token

**限制条件： userid 不超过32字节， name不超过32字节， desc不超过64字节**

#### 用户对象

```json
{
    "userid": "1avsoHu2EeqZmH943F8eUg",     // 必填：用户ID，全局唯一，小于32位
    "name": "李四",     // 必填：用户姓名，小于32位
    "desc": "研发部",   // 可选，小于64位
    "idno": "22018720060819101X", //可选：
    "effect": 1619019996,       // 用户生效时间，不填则默认为0
    "expire": 1619519996,       // 用户过期时间，不填则为-1，-1为不限制过期
    
    "state": 0,                 // 用户状态，正常用户是正值，负值为黑名单，定制产品使用，可不填写
    
    "face":{
        "vendor":"jz",        // 人脸算法供应商，double check使用
        "version":"0.1",     // 人脸算法版本, double check使用
        "feature": "data....",  // base64编码的用户特征值，由设备计算，同类型设备，算法版本一致的可以直接下载，节省时间
        "data":"base64 data...", // base64编码的用户底图，如果填写此项，侧忽略feature，并由此项数据生成特征值
    },
    "cards":[   // 添加与用户绑定的卡信息，也可以单独绑定卡，详情见门卡管理章节
        {
            "id":"EeqZmH943F8",
            "type": "ic",       // 卡类型，默认IC卡，可以为CPU，crypto等
            "userid": "1avsoHu2EeqZmH943F8eUg",   // 卡对应的用户ID
            "hex": "AABBCCDD"   // 卡数据
        }
    ],
    "rules":[
        {
            "type": 1, // 1, 计数； 2, cron格式;
            "rid":0,    // 当前规则序号，规则按序号核验，首个通过即放行 
            "count":100,    // 定制版本，常规不用此项数据。计次规则，归零后，此条规则无效 
            "effect":1619019996,    // 规则使能时间，不填为0
            "expire":1619119996,    // 规则失效时间，不填为-1
            "cron":"30-59 2 * * *", // cron格式的规则，采用分 时 日 周 月方式，细节请参考cron规则    
            // 如 30-59 8,9 1,30 1-5,7,8 *   表示1到5月、7月、8月的每个1号和30号的8点30到8点59、9点30到9点59可通行
            //如 * 7,8,15,16 * 2-6 1-5   表示 2到6月的每周一到周五的7点到8点59 15点到16点59可通行
        }
    ],
}
```

> 对用户的操作与数据库的CRUD类似，增加了枚举设备中的所有用户，所有的信息以此为准
> 后续行文为了简化，直接给出用户信息的缩略版本


#### 添加用户流程
1. 调用算法管理中的fdr-extract指令，生成用户的特征值，并备份在平台软件数据库；
2. 设备好等添加用户的信息，即配置好用户对象数据，并将用户数据写入平台软件数据库；
3. 调用user-insert指令，下发用户信息到设备，完成设备中的用户添加功能。

#### 修改用户流程
1. 从平台软件数据库读取用户信息；
2. 修改用户信息项；
3. 如果用户修改了人脸图片，需要执行算法管理中的fdr-extract指令，重新生成用户特征值 ；
4. 调用user-insert指令，下发用户信息到设备，完成设备中的用户修改功能。


#### 列举用户

- 请求

```json
{
    "action": "user-fetch",
    "header":{
        "reqid":"129393"       
    },
    "body":{
        "offset": 1,
        "limit": 20
    }
}
```

>offset : 本次列表开始的位置；
>limit : 本次列表的数量;


- 响应

```json
{
    "retcode":0,              
    "header":{
        "reqid":"129393",
    },
    "body":{
        "users": [
            {
                "userid": "1avsoHu2EeqZmH943F8eUg",
            },
            {
                "userid": "1aw6wHu2EeqZmH943F8eUg",
            }
        ],
    }
```

#### 添加用户

- 请求

```json
{
    "action": "user-insert",
    "header":{
        "reqid":"129393"         
    },
    "body":{
        "users": [
            {
                "userid": "1avsoHu2EeqZmH943F8eUg",
                ... // 用户的其它信息，请参照本章的用户对象说明
            },
            {
                "userid": "1aw6wHu2EeqZmH943F8eUg",
                ... // 用户的其它信息，请参照本章的用户对象说明
            }
        ]
    }
}
```

- 响应

```json
{
    "retcode": 0,   // 当有任意一项成功时，返回成功
    "header":{
        "reqid":"129393"         
    },
    "body":{
        "users": [
            { 
                "userid":"1avsoHu2EeqZmH943F8eUg",
                "retcode": 0    // 本用户操作结果
            },
            {
                "userid":"1aw6wHu2EeqZmH943F8eUg",
                "retcode": 0    // 本用户操作结果
            }
        ]
    }
}
```

#### 删除用户

- 请求

```json
{
    "action": "user-remove",
    "header":{
        "reqid":"129393"        
    },
    "body":{
        "users": [
        {
            "userid": "1avsoHu2EeqZmH943F8eUg"
        },
        {
            "userid": "1aw6wHu2EeqZmH943F8eUg"
        }
        ]
    }
}
```

>userid : 唯一标志用户的ID，不超过32字节的文本字符串；必填

- 响应

```json
{
    "retcode": 0,   // 当有任意一项成功时，返回成功
    "header":{
        "reqid":"129393"         
    },
    "body":{
        "users": [
        {
            "userid": "1avsoHu2EeqZmH943F8eUg",
            "retcode": 0    // 本用户操作结果
        },
        {
            "userid": "1aw6wHu2EeqZmH943F8eUg",
            "retcode": 0    // 本用户操作结果
        }
        ]
    }
}
```

#### 查询用户

- 请求

```json
{
    "action": "user-lookup",

    "header":{
        "reqid":"129393"      
    },
    "body":{
        "users": [
        {
            "userid": "1avsoHu2EeqZmH943F8eUg",
            "card":1,//查询卡信息
            "face":1,//查询特征信息
        },
        {
            "userid": "1aw6wHu2EeqZmH943F8eUg",
        }
        ]
    }
}
```

- 响应

```json

{
    "retcode": 0,   // 当有任意一项成功时，返回成功
    "header":{
        "reqid":"129393"         
    },
    "body":{
        "users": [
        {
            "userid": "1avsoHu2EeqZmH943F8eUg",
            ... // 用户的其它信息，请参照本章的用户对象说明
        },
        {
            "userid": "1aw6wHu2EeqZmH943F8eUg",
            ... // 用户的其它信息，请参照本章的用户对象说明
        }
        ]
    }
}
```


#### 清除用户

- 请求

```json
{
    "action": "user-clear",
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
    "retcode": 0,   // 当有任意一项成功时，返回成功
    "header":{
        "reqid":"129393"        
    },
    "body":{
    }
}
```
