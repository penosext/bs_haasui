# am-应用栈管理

  1. 概述

提供应用栈的管理机制

# 2. 模块使用方式

```javascript
import am from 'am'
```

## 2.1 应用预加载

为支持应用在开机启动时预加载，通过如下app.json配置（系统级应用生效），会在启动home前预启动该app

```javascript
{
  "props": {
    "Preload": true
  }
}
```

# 3方法

## 3.1 getTopApp()

获取栈顶appid
**入参**
无

**调用示例**

```javascript
import am from '$am';

let topApp = am.getTopApp();
```

## 3.2 moveToBack

将app在应用栈中下移，隐藏到后台（还在应用栈中）

**权限**

移动本应用可授权，移动其他应用需系统应用权限
**入参**

| 属性  | 类型   | 必填                   | 描述                  |
| ----- | ------ | ---------------------- | --------------------- |
| appId | String | 否(为空表示移动本应用) | 要移动的应用的appId。 |

**调用示例**

```javascript
import am from '$am';

am.moveToBack();
```

## 3.3 hide

将app移动到隐藏应用栈中，其他app退栈不会自动显示该app（需通过startApp重新加入）

**权限**

移动本应用可授权，移动其他应用需系统应用权限
**入参**

| 属性  | 类型   | 必填                   | 描述                  |
| ----- | ------ | ---------------------- | --------------------- |
| appId | String | 否(为空表示移动本应用) | 要移动的应用的appId。 |

**调用示例**

```javascript
import am from '$am';

am.hide();
```

## 3.4 closeApp

关闭指定app

**权限**

关闭本应用可授权，关闭其他应用需系统应用权限
**入参**

| 属性        | 类型   | 必填                   | 描述                                                         |
| ----------- | ------ | ---------------------- | ------------------------------------------------------------ |
| appId       | String | 否(为空表示移动本应用) | 要移动的应用的appId。                                        |
| forceFinish | bool   | 否                     | 是否强制退出，为false时，如果app存在持久化后台服务，app不会退出，只会界面退出 |

**调用示例**

```javascript
import am from '$am';

am.closeApp(undefined, false);
```

## 3.5 hasWindowFocus

本应用是否具有焦点窗口
**入参**

| 属性 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
|      |      |      |      |

**调用示例**

```javascript
import am from '$am';

let focused = am.hasWindowFocus();
```

## 3.6 isAttachedToWindow

本应用当前是否有界面打开
**入参**

| 属性 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
|      |      |      |      |

**调用示例**

```javascript
import am from '$am';

let attached = am.isAttachedToWindow();
```

# 4. 事件

## 4.1 topApp

栈顶应用变化

**调用示例**

```javascript
import am from '$am';

am.on('topApp', r => {});
```

## 4.2 windowAttachState

本应用界面开启关闭事件

**调用示例**

```javascript
import am from '$am';

am.on('windowAttachState', r => {});
```



