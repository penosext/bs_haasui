# 设备预置包配置说明

  关键字

启动、系统应用、预置包



# 应用appid 标识说明

- 目前该框架上跑的应用appid 开头为80， 且为12位，例如 8080231029760206， 建议一起遵守该标识
- vscode插件创建的应用会创建唯一appid，所以大家可以放心使用

## 说明

- home应用：**必须配置**
- 系统第一次启动后会去解压local_package.json配置的应用包，解压到{MINIAPP_DATAROOT}/data/mini_app/pkg下
- 支持amr解压后的预置应用包启动方案

# 预置包配置

预置包配置文件:local_packages.json

在该文件中配置预置包信息.刷机包需要修改对应刷机包工程下的local_packages.json文件.

设备端对应的文件为:/etc/miniapp/resources/local_packages.json

注意:

- 请把所有本地预置包都在这里配上,并且设置好对应的应用包"Path"路径.
- Path如果是amr文件，安装时会进行解压安装到/data缓存目录；如果是已解压好的文件夹，则直接在当前目录安装。
- 本地应用创建时会默认创建appid，且可修改





配置说明:

```json
{
  
  "version": "0.0.2",	//当前预置包配置版本.如果做整包升级,请更新此版本号.包管理模块会检查版本号判断是否需要重新安装预置包
  "PackageList": [	//预置包信息列表.把所有本地预置包都配上
    {
      "id": "8080231029760206",		//包id,请和服务端包id保持一致
      "Name": "home",	//应用名
      "Category": "HOME",	//标识,如果是桌面请配置为"HOME",标识开机时默认启动应用.
      "Path": "path/to/packages/8180000000000020.amr"	//预置包路径
    },
    {
      "id": "8180000000000023",
      "Name": "guide",
      "Category": "GUIDE", //开机向导，如果是开机向导,请配置为"GUIDE"，第一次开机时会启动
      "Path": "resources/presetpkgs/8180000000000023"  //应用包路径（已解压的目录，配合Zip:false一起使用）
      "Zip": false     // 预置应用是否为压缩Zip模式（安装是否免解压）
    },
    {
      "id": "8180000000000021",
      "Name": "setting",
      "Category": "",
      "Path": "resources/presetpkgs/8180000000000021.amr"
    },
    {
      "id": "8180000000000022",
      "Name": "下拉面板",
      "Category": "TOP_PANEL",
      "Path": "resources/presetpkgs/8180000000000022.amr"
    }
  ]
}
```



# 桌面和开机向导说明

**开机向导**："Category": "GUIDE"； 如果存在该应用，在设备第一次开机时会进入该应用，在完成开机向导流程并进入桌面应用后，不会再启动(还原出厂设置后，首次启动还会继续启动开机向导)

**桌面**："Category": "HOME"，默认开机后进入的应用

# 支持Category跳转

当系统应用配置

[参考页面跳转文档](app/event/jump)

# 预置包包更新

如果local_packages.json里面配置的包发生了更改，需要改一下version（+1即可），包管理模块会检查版本号以判断是否需要重新安装预置包。