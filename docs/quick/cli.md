# miniapp_cli指令介绍

框架支持通过miniapp_cli指令快速执行一些能力，miniap_cli为设备上的命令

#### 开启miniapp_cli

需要在cfg.json里打开debugger属性(默认路径为resources/cfg.json)

```javascript
	"debugger": {
		"enable": true
	},
```

#### 截屏

```javascript
miniapp_cli capture {path}/a.png    //path 为指定设备板子上的截屏路径，保存文件为a.png
```

#### 安装应用

```javascript
miniapp_cli install {amrPath}  //amrPath amr应用在设备板子上所在的路径
```

#### 卸载应用

```javascript
miniapp_cli uninstall {appid} //appid 应用的appid
```

#### 启动应用

```javascript
miniapp_cli start {appId}  // appid  应用的appid
miniapp_cli start {appId} {page} //跳转到该应用的page页面 在app.json中定义的pageName
```

#### monkey测试

需要开启monkey功能才可使用

```javascript
miniapp_cli beginMonkey   //启动monkey
miniapp_cli stopMonkey    //关闭monkey
```

#### 内存打印

```javascript
miniapp_cli memoryUsage    //打印JS内存
miniapp_cli memoryUsageGC   //打印触发GC之后的JS内存
miniapp_cli dumpMemory      //将JS内存输出到/tmp/httpdump.snapshot中
```

#### 启动服务

该功能 需要基于框架V1.4版本，即API Version为 5 才可使用

```javascript
miniapp_cli startService {appId} {service}  //service 应用的具体服务名
```