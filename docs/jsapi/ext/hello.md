# JSAPI - hello模块封装讲解

  模块功能

hello是 JSAPI的开发案例，向用户演示最常用的三种调用模式，以及常用的入参出参C++用法：

1. **同步调用**（JS线程同步调用C++方法）
2. **异步调用**（调度到非JS线程调度C++方法）
3. **消息publish**（在任意时间和位置通过C++向JS发送相关消息数据）

## 同步调用

函数原型为 void functionName(JQFunctionInfo &info)

**例子中写法：**

```cpp
// 简单同步接口
void joinPath(JQFunctionInfo &info);
```

**注册方式：**

```cpp
tpl->SetProtoMethod("joinPath", &JSFoo::joinPath);
```

**线程调度：**

JSFoo::joinPath 被调度时在JS线程，因此不可以做阻塞操作，例如磁盘、网络IO等，不然会阻塞JS和卡UI

**入参和出参：**

入参：通过 info[0] 获取 JSValue 格式的参数，详细可以看《JSAPI - 入参和解析》

出参：通过 info.GetReturnValue().Set(result) 形式，可以返回原子类型，int bool string 等等，或者返回一个 JSValue

```cpp
void JSFoo::joinPath(JQFunctionInfo &info)
{
    JSContext *ctx = info.GetContext();
    std::vector<std::string> slices;

    for (unsigned idx=0; idx < info.Length(); idx++) {
        slices.push_back(JQString(ctx, info[idx]).getString());
    }

    info.GetReturnValue().Set(JQuick::pathjoin(slices));
}
```

**JS使用方法：**

```cpp
import {foo} from 'hello'

foo.joinPath('root', 'works', 'project')
console.log(`pathJoin result ${path}`)
```

## 异步调用

函数原型为 void functionName(JQAsyncInfo &info)

**例子中写法：**

```cpp
// 文件异步接口
void readFile(JQAsyncInfo &info);
```

**注册方式：**

```cpp
    tpl->SetProtoMethodPromise("readFile", &JSFoo::readFile);
```

**线程调度：**

JSFoo::readFile 被调度时在非JS线程，因此可以做一些阻塞操作，例如读写文件，不会影响JS线程和UI相关

**入参和出参：**

入参：通过 info[0] 获取 Bson 格式的参数，详细可以看《JSAPI - 入参和解析》

出参：

1. 正常返回值用 info.post(Bson result) 形式
2. 错误返回时用 info.postError("some error %d", errorCode) 形式

```cpp
void JSFoo::readFile(JQAsyncInfo &info)
{
    std::string path = info[0].string_value();
    LOGD("JSFoo::readFile path: %s", path.c_str());
    // read file from disk
    std::string content = "abcd1234";
    info.post(content);
}
```

**JS使用方法：**

```cpp
import {foo} from 'hello'

    async testReadFile() {
      const content = await foo.readFile('/some/path/of/file')
      console.log(`readFile result ${content}`)
    }
```

## 消息publish

**例子中写法：**

1. 继承于 JQPublishObject

```c++
class JSFooWifi: public JQPublishObject {
...
};
```

**注册方式：**

注意在最后需要写一句 JSFooWifi::InitTpl(tpl) 给类型初始化 on off 方法

```cpp
    JQFunctionTemplateRef tpl = JQFunctionTemplate::New(env, "fooWifi");

    // 设定 C++ 对象工厂函数
    tpl->InstanceTemplate()->setObjectCreator([]() {
      return new JSFooWifi();
    });
    tpl->SetProtoMethodPromise("scanWifi", &JSFooWifi::scanWifi);
    JSFooWifi::InitTpl(tpl);
```

**线程调度：**

在某些方法中（可以是JS线程或非JS线程），直接调用 JQPublishObject::publish 函数，会将该数据发送到JS空间，调用on方法注册的某些topic的回调中。

**入参出参：**

出参原型：void publis(string topic, Bson bson)

这里我们以一种类 JSON 的格式 Bson 来传递C++数据，该数据会自动转换成 JS 变量，并抛送到 JS 对应的监听函数中去，用法示例：

```cpp
    void scanWifi(JQAsyncInfo &info)
    {
        // 模拟通知 JS 空间扫描结果
        Bson::array result;
        result.push_back("ssid0");
        result.push_back("ssid1");
        result.push_back("ssid2");
        publish("scan_result", result);
        // 异步接口必须回调
        info.post(0);
    }
```

**JS使用方法：**

注意fooWifi.off 可以立即解除数据监听，入参为 fooWifi.on 函数的返回值（token）

原型分别为：

- int on(string topic, function callback) -> 返回 token
- void off(int token)

```cpp
import {fooWifi} from 'hello'

    testScanWifi() {
      fooWifi.on('scan_result', (res) => {
        console.log(`got scan_result ${JSON.stringify(res)}`)
      })
      fooWifi.scanWifi()
    },
```

## 其他

### JS模块定义

#### 单例方式

目前推荐以类的形式导出，C++如下：

```cpp
    JQFunctionTemplateRef tpl = JQFunctionTemplate::New(env, "foo");

    // 设定 C++ 对象工厂函数
    tpl->InstanceTemplate()->setObjectCreator([]() {
      return new JSFoo();
    });

    tpl->SetProtoMethod("joinPath", &JSFoo::joinPath);
    tpl->SetProtoMethodPromise("readFile", &JSFoo::readFile);
    tpl->SetProtoMethodPromise("requestHttp", &JSFoo::requestHttp);

    // 导出该类的一个实例
	env->setModuleExport("foo", tpl->CallConstructor());
```

**JS中调用方式**

1. 导出该类的一个实例用法：

```cpp
import {foo} from 'hello'
foo.joinPath('some', 'path')
```



C++如下

#### new 对象方式

参考C++

```cpp
JQFunctionTemplateRef tpl = JQFunctionTemplate::New(env, "foo");

// 设定 C++ 对象工厂函数
tpl->InstanceTemplate()->setObjectCreator([]() {
    return new JSFoo();
});

tpl->SetProtoMethod("joinPath", &JSFoo::joinPath);
tpl->SetProtoMethodPromise("readFile", &JSFoo::readFile);
tpl->SetProtoMethodPromise("requestHttp", &JSFoo::requestHttp);

// 导出该类原型
env->setModuleExport("foo", tpl->GetFunction());
```

**JS中调用方式**

```javascript
import {foo} from 'hello'
var tt = new foo();
tt.on('scan_result', (res) => {
        console.log(`got scan_result ${JSON.stringify(res)}`)
      })
```

