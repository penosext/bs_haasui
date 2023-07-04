# 模拟器混入 mock jsapi 代码

  模拟器 mock JSAPI

有一些设备 JSAPI，比如 GPIO 需要在设备才能验证。

如下介绍如何使用模拟器 mock 这些 JSAPI。

有两种混入方法：

1. simulator 方式启动模拟器默认混入 mock jsapi 代码
2. build 命令时通过 --mock 选项强制混入 mock jsapi 代码

## 编写 mock 逻辑

- 在vue工程根目录下的 api-mock 文件夹中加入 JSAPI mock 文件，比如 qjs-dbus.js

```javascript
// qjs-dbus.js

export default {
  getBus(name) {
    console.log(`invoking mock JSAPI of qjs-dbus name: ${name}`)
    return {}
  }
}
```

## 在 JS 中使用

与真实设备 JSAPI 使用一样

```javascript
import dbus from 'qjs-dbus'
dbus.getBus('wlan0')
// invoking mock JSAPI of qjs-dbus name: wlan0
```

## simulator 方式运行

配置 simulator

通过 aiot-cli s . 命令运行，s 是 simulator 命令的缩写

```javascript
// 修改 package.json 配置模拟器路径
  "simulator": {
    "path": "/Users/netsec/works/haasui/miniapp_falcon/cmake-build-debug/usr/bin",
    "page": ""
  },
```

##  build --mock 方式

通过 aiot-cli build --mock 来支持混入 api-mock 代码，任意方式加载运行 app