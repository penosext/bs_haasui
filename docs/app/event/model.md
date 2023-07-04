# 模块事件

模块事件:由扩展模块通过c++接口触发.当前所有存活的应用皆可监听.



对应jsapi中的不同模块，可按照模块维度进行事件监听

示例：

```c++
// jsapi模块发送事件的方法
ariver::iot::ExtensionProxyBase* extensionProxy = ariver::iot::getJSApiExtensionProxy();
// 模块名，事件名，参数json
extensionProxy->sendCustomEvent("pm", "packageUninstalled", "{\"appId\": \"" + appId + "\"}");
```

```javascript
// 前端使用方法
const pm = $falcon.jsapi.pm;
const callback = (e) => {
	//do something
}
pm.on('packageInstalled', callback);
pm.off('packageInstalled', callback);
```

