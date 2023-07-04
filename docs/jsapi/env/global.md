# 容器全局信息

## 环境变量 $falcon.env 

说明：环境变量对象 API

参数：

| 参数列表     | 参数类型 | 描述                                                        |
| ------------ | -------- | ----------------------------------------------------------- |
| platform     | string   | 运行平台：Darwin、Linux、Windows                            |
| version      | string   | UI框架版本，比如1.5.0                                       |
| apiVersion   | int      | api版本，比如**版本1** 会有对应的通用功能api，以及jsapi接口 |
| deviceModel  | string   | 设备信息型号                                                |
| deviceWidth  | int      | 设备分辨率-宽度                                             |
| deviceHeight | int      | 设备分辨率-高度                                             |

```javascript
let sysPlatform = $falcon.env.platform;
let sysVersion = $falcon.env.version;
let apiVersion = $falcon.env.apiVersion;
let deviceModel = $falcon.env.deviceModel;
let deviceWidth = $falcon.env.deviceWidth;
let deviceHeight = $falcon.env.deviceHeight;
```

## 其他

| 参数       | 参数类型 | 描述               |
| ---------- | -------- | ------------------ |
| $workspace | string   | 应用包安装路径     |
| $dataDir   | string   | 应用自己的data路径 |
| $appid     | string   | 应用appid          |

```javascript
let workspacePath = $falcon.$workspace;
let dataDir = $falcon.$dataDir;
let appid = $falcon.$appid;
```

