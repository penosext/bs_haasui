# JSAPI - 入参和解析

  JS 入参方式

接口入参方式分两种：

- 参数列表：类似C函数，列表参数，例如 testMethod(arg0, arg1, arg2,...)；

- - 偏简单的接口传递方案，参数固定，但如果后期参数要修改，则需要改动代码

- 字典参数（有名参数）：例如 testMethod({arg0: "val0", arg1: "val1", ...})；

- - options方案且方便扩展，类似C/C++结构体

字典参数可参考 Node.js 的参数定义文档：

例如 fs.readFile：https://nodejs.org/api/fs.html#fspromisesreadfilepath-options

接口定义为：fsPromises.readFile(path[, options])



对于字典参数，JS有一种简略的写法：字面量对象，例如

let arg0 = "val0"

let arg1 = "val1"

testMethod({arg0, arg1})

上面等价于

testMethod({"arg0": arg0, "arg1": arg1})



## C++解析方式

1. JQFunctionInfo 一般用 JQTypes.h 中的 JQString JQObject 等等辅助方法从JS变量解析到C++类型。
2. JQAsyncInfo 就非常简单，会事先将 JS 入参变量序列化成类似json对象的Bson类型（支持binary），操作方式与JSON一致

### 第一种，参数列表

1. JQAsyncInfo 解析方式

```cpp
// 假如 js 写法
let arg0 = "some string";
let arg1 = 100;
let arg2 = true;
testMethodAsync(arg0, arg1, arg2);
// C++ 解析方法
void testMethodAsync(JQAsyncInfo &info)
{
	// 因为是异步调用，因此参数已经序列化成与JS变量无关的Bson结构，通过 info[] 下标的方式获取
    std::string arg0 = info[0].string_value();
    int arg1 = info[1].int_value();
    bool arg2 = info[2].bool_value();

    // 更多参数类型获取方式可以查看 bson.h
}
```

1. JQFunctionInfo 解析方式

```cpp
// 假如 js 写法
let arg0 = "some string";
let arg1 = 100;
let arg2 = true;
testMethod(arg0, arg1, arg2)

// C++ 解析，方法 1
void testMethod(JQFunctionInfo &info)
{
	JSContext *ctx;  // js 运行环境
    std::string arg0 = JQString(ctx, info[0]).getString();  // 从JS变量中解析出字符串
    int arg1 = JQNumber(ctx, info[1]).getInt32();  // 从JS变量中解析出int32
    bool arg2 = JQBool(ctx, info[2]).getBool();  // 从JS变量中解析出 bool

    // 更多解析辅助方式，可以参考 JQTypes.h
}
// C++ 解析，方法2
// 可以看到async获取方式是非常简单的，因此同步方法这里也提供了对应形式，但是效率会略低点
void testMethod(JQFunctionInfo &info)
{
    // 下面这句会将JS入参序列化成与JS无关的 Bson 结构，然后用法与async一致
    JQParamsHolder params = info.toParamsHolder();
    std::string arg0 = params[0].string_value();
    int arg1 = params[1].int_value();
    bool arg2 = params[2].bool_value();
}
```

### 第二种，字典参数

1. JQAsyncInfo 解析方式

```cpp
// 假如 js 写法
let path = "/some/path"
let arg0 = "some string";
let arg1 = 100;
let arg2 = true;
testMethodAsync(path, {arg0, arg1, arg2});
// C++ 解析方式
void testMethodAsync(JQAsyncInfo &info)
{
	// 因为是异步调用，因此参数已经序列化成与JS变量无关的Bson结构，通过 info[] 下标的方式获取
    std::string path = info[0].string_value();
    Bson::object opts = info[1].object_items();
    std::string arg0 = opts["arg0"].string_value();
    int arg1 = opts["arg1"].int_value();
    bool arg2 = opts["arg2"].bool_value();

    // 更多参数类型获取方式可以查看 bson.h
}
```

1. JQFunctionInfo 解析方式

```cpp
// 假如 js 写法
let path = "/some/path"
let arg0 = "some string";
let arg1 = 100;
let arg2 = true;
testMethod(path, {arg0, arg1, arg2})

// C++ 解析，方法 1
void testMethod(JQFunctionInfo &info)
{
	JSContext *ctx;  // js 运行环境
    std::string path = JQString(ctx, info[0]).getString();

    JQObject opts(ctx, info[1]);  // JS的第二个参数是一个object
    std::string arg0 = opts.getString("arg0");
    int arg1 = opts.getInt32("arg1");
    bool arg2 = opts.getBool("arg2");

    // 更多解析辅助方式，可以参考 JQTypes.h
}
// C++ 解析，方法2
// 可以看到async获取方式是非常简单的，因此同步方法这里也提供了对应形式，但是效率会略低点
void testMethod(JQFunctionInfo &info)
{
    // 下面这句会将JS入参序列化成与JS无关的 Bson 结构，然后用法与async一致
    JQParamsHolder params = info.toParamsHolder();
    std::string path = params[0].string_value();
    Bson::object opts = params[1].object_items();  // JS 的第二个参数是object
    std::string arg0 = opts["arg0"].string_value();
    int arg1 = opts["arg1"].int_value();
    bool arg2 = opts["arg2"].bool_value();

    // 更多参数类型获取方式可以查看 bson.h
}
```

### 其他使用方法列举：

1. 判断参数类型

1. 1. JQTypes 辅助方法：JQObject(ctx, info[0]).isObject()
   2. Bson 方法：params[0].is_object()

其他复杂类型待列举，主要是 Object、Array，可以对应查看 JQTypes.h bson.h