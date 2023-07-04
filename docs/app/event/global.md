# 全局事件

全局事件用于监听持久性事件,如设备蓝牙事件.全局事件分类:

1.用户自定义事件:由javascript通过`$falcon.trigger()`手动触发.作用于当前应用

2.底层全局事件:由底层jsapi模块触发的全局事件,作用于全局

3.tip：**使用全局事件功能，需要严格遵循 on/off 流程，否则会存在内存泄漏问题**

## 全局事件监听

全局事件通过`$falcon.on(eventName, callback)`方法监听,指定监听名称与回调函数即可,例如:

```javascript
$falcon.on('blechanged', (e) => {
  console.log(e.type, e.timestamp, e.data);
})
```

全局事件回调参数包含以下信息:

```json
{
	type:String,	// 事件类型
  timestamp: Integer,	// 事件触发时间
  data:Object	// 事件参数
}
```

通过`$falcon.off(eventName, callback)`方法注销监听

```javascript
const callback = (e) => {
	//do something
}

// 注册监听
$falcon.on('blechanged', callback)

// 取消监听
$falcon.off('blechanged', callback)
```

如果callback不传或者传空值(null,undefined),则取消当前应用所有eventName对应的监听,如:

```
$falcon.off("blechanged")
```



## 全局事件触发

### 1)用户自定义事件

应用中可手动触发全局事件.通过javascript手动触发的全局事件仅限作用于当前应用,不会被其他应用收到.

```javascript
const eventOptions = {data1,data2};
$falcon.trigger('eventName', eventOptions);
```

### 2)底层全局事件

底层可通过事件接口触发全局事件,底层触发的全局事件所有应用都可监听收到.

```c++
// jsapi模块发送事件的方法
ariver::iot::ExtensionProxyBase* extensionProxy = ariver::iot::getJSApiExtensionProxy();
// 事件名，参数json
extensionProxy->sendCustomEvent("packageUninstalled", "{\"appId\": \"" + appId + "\"}");
```

