# JSAPI私有库与共享库使用说明

不同应用之间的jsapi是应用级隔离的，启动每个amr时，miniapp会以dlopen的方式打开该amr的jsapi所依赖的so库文件，使用时会做不同应用间的隔离处理。

# 使用说明

1、首先在vue工程的根目录下，创建libs文件夹（脚手架默认没有创建），jsapi所有需要用到的so文件都放在libs文件夹下，打包时脚手架会自动将so库文件打包到amr包中。

```plain
├── configs
├── libs
│   ├── libxxx.so // libjsapi_xx.so依赖的so文件（可选）
│   └── libjsapi_xxx.so // jsapi_xxx.cpp生成的libjsapi_xx.so文件
├── node_modules
├── package.json
├── src
```

2、应用首次安装或升级时，miniapp会自动将so文件解压到amr的安装路径下。

3、jsapi对应的jsapi_xxx.cpp生成的so文件需要以libjsapi_开头命名，以生成libjsapi_xxx.so，miniapp会以dlopen的方式将其打开。

4、libjsapi_xxx.so如果有依赖的so库请不要以libjsapi_开头命名，如果是共有的，**将它们放到系统的公用lib库中**，方便所有的amr引用（例如wifi的so库可以放到/usr/lib下，需用wifi的amr都可以引用）。如果是私有的，也放到libs路径下即可，miniapp会自动去查找这些依赖库。

5、不同app包含的libjsapi_xxx.so彼此之间命名可以重复，miniapp已经做了应用层级的隔离。



# 使用须知

1、用户需要下载[patchelf](https://github.com/NixOS/patchelf/releases/tag/0.12)的0.12源码库，在common/patchelf/patchelf.cc文件中实现官方提供的如下接口：

```cpp
int patchelfSetRpath(const char *filename, const char *newrpath);
```

2、安装应用时，需以amr包的形式安装。

3、/etc/miniapp/jsapis下的jsapi为所有amr共有，amr自己libs下的jsapi为该amr私有。

4、私有jsapi的优先级大于共有的。