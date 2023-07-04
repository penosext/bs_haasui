# pm-应用包管理

# 1. 概述

pm模块用于本地amr包的管理，包括安装、卸载amr包，获取指定/所有amr包的安装信息，监听amr包安装、卸载和升级的事件。

# 2. 模块使用方式

```javascript
import pm from 'pm'
```

# 3.方法

## 3.1 installPackage

安装amr应用包(框架打包工具的后缀统一为.arm)
**入参**
Object 类型，属性如下：

| 属性     | 类型     | 必填 | 描述                |
| -------- | -------- | ---- | ------------------- |
| path     | String   | 是   | amr的绝对安装路径。 |
| callback | function | 否   | 回调函数。          |

**callback中的状态码**

```javascript
SUCCESS = 0,                                 /* Success */

INS_ERROR_FILE_NOT_EXIST = 2,
INS_ERROR_FAILED_INVALID_AMR = 3,
```

**调用示例**

```javascript
import pm from 'pm';

pm.installPackage(path, r => {
  if (r.res === pm.SUCCESS) {
    console.log('install succeess')
  } else {
    console.log('install failed, error code: ', r.res)
  }
});
```

## 3.2 removePackage

卸载amr包
**入参**
Object 类型，属性如下：

| 属性     | 类型     | 必填 | 描述                  |
| -------- | -------- | ---- | --------------------- |
| appId    | String   | 是   | 要删除的应用的appId。 |
| callback | function | 否   | 回调函数。            |

**callback中的状态码**

```javascript
SUCCESS = 0,                                 /* Success */

RM_ERROR_NOT_EXIST = 50,
RM_ERROR_NOT_ALLOWED = 51,
```

**调用示例**

```javascript
import pm from 'pm';

pm.removePackage(appId, r => {
  if (r.res === pm.SUCCESS) {
    console.log('remove succeess')
  } else {
    console.log('remove failed, error code: ', r.res)
  }
});
```

## 3.3 getPackageInfo

获取指定appId的安装信息
**入参**
Object 类型，属性如下：

| 属性  | 类型   | 必填 | 描述                          |
| ----- | ------ | ---- | ----------------------------- |
| appId | String | 是   | 要获取安装信息的应用的appId。 |

**调用示例**

```javascript
import pm from 'pm';

let packageInfo = pm.getPackageInfo(appId);
console.log(packageInfo)
```

**返回值**

object

```json
{
	"appid": "8001000000000001",
	"name": "app1",
	"version": "1.0.0",
	"icon": "",
	"installPath": "/etc/miniapp/data/mini_app/pkgs/8001000000000001/a/",
	"flag": 1
}
```

## 3.4 getInstalledPackages

获取指定appId的安装信息
**入参**
Object 类型，属性如下：

| 属性 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| 无   |      |      |      |

**调用示例**

```javascript
import pm from 'pm';

let packageInfos = pm.getInstalledPackages();
console.log(packageInfos)
```

**返回值**

array

```json
[{
	"appid": "8001000000000001",
	"name": "app1",
	"version": "1.0.0",
	"icon": "",
	"installPath": "/etc/miniapp/data/mini_app/pkgs/8001000000000001/a/",
	"flag": 1
}, {
	"appid": "8001000000000002",
	"name": "app2",
	"version": "1.0.0",
	"icon": "",
	"installPath": "/etc/miniapp/data/mini_app/pkgs/8001000000000002/a/",
	"flag": 1
}]
```

## 3.5 package事件监听

**事件类型**

| 事件名称  | 描述        |
| --------- | ----------- |
| installed | amr安装事件 |
| removed   | amr删除事件 |
| updated   | amr更新事件 |

**调用示例**

```json
// 监听
let token = pm.on('package', r => {
    if (r.type === 'installed') {
    } else if (r.type === 'removed') {
    } else if (r.type === 'updated') {
    }
});

// 取消监听
pm.off(token);
```



# 安装失败

| 错误码 | 说明                    |
| ------ | ----------------------- |
| 1      | 安装失败，amr包不存在   |
| 2      | 安装失败，amr包解析失败 |
| 3      | 安装失败，解压失败      |
