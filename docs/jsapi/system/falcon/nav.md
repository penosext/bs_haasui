# nav-页面导航

  1.概述

页面/应用跳转相关api，支持应用应用内、应用间、以及Category跳转；目前依托于全局的falcon对象

# $falcon

$falcon下的接口均为全局接口

# 2.方法

## 2.1 $falcon.navTo()

页面/应用跳转.跳转到应用内指定页面或者其他应用的指定页面

方法原型:`$falcon.navTo(target:String, options:Object)`

参数：

- target:需要跳转的页面名称或目标页面的uri.

- - **应用内跳转**：参数为[页面名称]().如:"index", "xxPage"
  - **应用间跳转**：参数为uri,如:"falcon://appid/index?param1=xxx".schema必须为falcon
  - **Category跳转**：参数同**应用间跳转**，如"falcon://{Category}/index?param1=xxx"，具体Category如何配置参考[local_packages.json中的amr包配置]()（请确保配置Category的唯一性）

- options:页面参数,跳转到下一个页面所需要的参数.如果target为uri且带有参数,则会合并后传给下一个页面；参数格式为key/value字符串JSON格式

- - KV格式：如  { data: "data1" }

用法

```javascript
$falcon.navTo("pageName", { data: "data1" });    //应用内页面跳转，pageName为应用页面名
$falcon.navTo("falcon://HOME/index");             //Category跳转，且指定index页面

$falcon.navTo("falcon://8180000000000020");      //不推荐通过appid进行，应用间跳转，默认跳转到index页面
$falcon.navTo("falcon://8180000000000020/index"); //不推荐通过appid进行，应用间跳转，且指定index页面

// 新页面page.js在onLoad生命周期中接收参数
onLoad(options) {
}
```

## 2.2 $falcon.closeApp()

**用法**

应用退出，一般用于应用不需要在后台的时候或者需要销毁的时候执行，**系统级应用才可有权限执行**

```javascript
$falcon.closeApp()
```

## 2.3 $falcon.closePageByName()

**参数**

- pageName：页面名；页面名称可通过对应页面实例的$pageName属性获取

**用法**

根据页面名称关闭页面，**系统级应用才可有权限执行**

```javascript
$falcon.closePageByName(pageName:String)
```

## 2.4 $falcon.closePageById

**参数**

- pageId：页面id.页面id可通过对应页面实例的$pageId属性获取

**用法**

根据页面id关闭页面，**系统级应用才可有权限执行**

```javascript
$falcon.closePageById(pageId:String)
```

# 关键字

页面跳转、路由





