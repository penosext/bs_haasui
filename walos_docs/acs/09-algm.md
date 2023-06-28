# 算法管理
------------

#### 说明

>请求类型: POST
>HTTP头：token = , 使用登陆时返回的token
>请求消息体:JSON
>返回消息体:JSON, retcode = 0时正确， 非0时出错

独立模式时：
>请求URL: http://dev-ip-addr:port:/api/v3.x/algm
>HTTP头：token = , 使用登陆时返回的token


> 因响应《个人信息保护法》，设备中不再存储用户人脸图片，平台通过fdr-extract指令获取人脸图片的特征值。原上传用户人脸图片+生成特征值的方式暂停使用。

#### 算法使能

用户使用小程序/app控制设备开始/停止人脸识别，用于特殊场景的人脸识别控制

- 请求

```json 
{
    "action":"fdr-enable",
    "header":{
        "reqid":"129393"        
    },
    "body": {
        "ops":"start" // start,开始； stop,暂停；
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

#### 特征提取


- 请求

```json 
{
    "action":"fdr-extract",
    "header":{
        "reqid":"129393"        
    },
    "body": {
        "source":"data",    // "data",从本指令附带的data数据中提取人脸特征值；"camera"，从摄像头中抓取人脸提取特征值
        "image":"jpg",      // jpg人脸图片格式，必须使用jpg
        "data": "data....",  // base64编码的图片数据，图片大小必须于小2000*2000像素，建议使用400x400像素图片，人脸最小宽度必须大于200像素，建议平台预先处理一次图片，判断人脸位置状态并裁剪缩放到合适大小
        "userid" : "asdfasdfwe" // 透传值，方便平台软件实现
    }
}
```

> source = camera 暂不支持


- 响应

```json
{
    "retcode":0,
    
    "header":{
        "reqid":"129393"         
    },
    "body":{
        "vendor":"jz",       // 人脸算法供应商，double check使用
        "version":"0.1",     // 人脸算法版本, double check使用
        "feature": "data....",   // base64编码的用户特征值，由设备计算，同类型设备，算法版本一致的可以直接下载，节省时间
        "userid" : "asdfasdfwe" // 透传值，方便平台软件实现。来自命令请求，原样返回
    }
}
```

#### 用户图片url下发、自动提取特征上报

当前模式需要先添加完用户之后，再推送url，设备提取完特征后，加入本地特征库并会将特征上报


- 请求

```json 
{
    "action":"user-upload-url",
    "header":{
        "reqid":"129393"         
    },
    "body": {
        "filename":"xxxx.jpg",    // 用户id，必须是 userid. 开头
        "data": "url",  //图片url
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
      
    }
}
```

- 提取完成的上报

  
      
      {
          "action":"user-gen-upload",
          "header":{
          	"reqid":"129393"         
      	},
      	"body":{
      		"face":{
      			"vendor":"jz",       // 人脸算法供应商，double check使用
          		"version":"0.1",     // 人脸算法版本, double check使用
          		"feature": "data....",   // base64编码的用户特征值
      		},
          	"userid" : "asdfasdfwe"
      	}
      }
  

