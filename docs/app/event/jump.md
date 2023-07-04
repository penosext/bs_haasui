# 页面跳转

# 简介

页面/应用跳转相关api，主要封装在一个全局对象$falcon上

# $falcon

$falcon下的接口均为全局接口

## $falcon.navTo

页面/应用跳转.跳转到应用内指定页面或者其他应用的指定页面

方法原型:`$falcon.navTo(target:String, options:Object)`

- target:需要跳转的页面名称或目标页面的uri.

- - **应用内跳转**：参数为 页面名称 .如:"index", "xxPage"
  - **应用间跳转**：参数为uri,如:"falcon://appid/index?param1=xxx".schema必须为falcon
  - **Category跳转**：参数同**应用间跳转**，如"falcon://{Category}/index?param1=xxx"，具体Category如何配置参考[local_packages.json中的amr包配置](system_env_compile/preset)（请确保配置Category的唯一性）

- options:页面参数,跳转到下一个页面所需要的参数.如果target为uri且带有参数,则会合并后传给下一个页面；参数格式为key/value字符串JSON格式

- - KV格式：如  { data: "data1" }

```javascript
$falcon.navTo("pageName", { data: "data1" });    //应用内页面跳转，pageName为应用页面名
$falcon.navTo("falcon://HOME/index");             //Category跳转，且指定index页面

$falcon.navTo("falcon://8180000000000020");      //不推荐通过appid进行，应用间跳转，默认跳转到index页面
$falcon.navTo("falcon://8180000000000020/index"); //不推荐通过appid进行，应用间跳转，且指定index页面

// 新页面page.js在onLoad生命周期中接收参数
onLoad(options) {
}
```

## $falcon.closeApp

在应用不需要继续存活时退出应用

方法原型:`$falcon.closeApp()`

## $falcon.closePageByName

根据页面名称关闭页面

方法原型:`$falcon.closePageByName(pageName:String)`

参数说明:

pageName:页面名称.页面名称可通过对应页面实例的$pageName属性获取

## $falcon.closePageById

根据页面id关闭页面

方法原型:`$falcon.closePageById(pageId:String)`

参数说明:

pageId:页面id.页面id可通过对应页面实例的$pageId属性获取



# App

App的方法不是全局,是应用对应的App类实例化后的方法.该实例可通过`$falcon.$app`属性获取

## app.finish

退出当前应用.

方法原型:`app.finish()`

```javascript
$falcon.$app.finish();	// 可以通过$falcon全局对象获取当前应用App对象的实例
```

# Page

Page的方法不是全局的,只在页面生命周期内以及页面的根组件和子组件中可访问.

组件中可通过在组件中`this.$page` 或者 `$falcon.getPage(component:Component)`获取当前页面的引用。page 实例中存放的对象如下：

| **属性**         | **类型** | **说明**                                     |
| ---------------- | -------- | -------------------------------------------- |
| $falcon          | Object   | 全局$falcon引用                              |
| $root            | Object   | 页面根组件引用                               |
| $pageName        | String   | 页面名称                                     |
| $pageId          | String   | 页面id                                       |
| loadOptions      | Object   | 页面首次启动时的参数(注1)                    |
| newOptions       | Object   | 页面重新启动时的参数(注1)                    |
| setRootComponent | function | 设置根组件                                   |
| loadOptions      | Object   | 页面首次启动时的参数                         |
| newOptions       | Object   | 页面重复打开时的参数(只保留最后一次打开参数) |
| finish           | function | 关闭当前页面                                 |
| $animation       | Object   | 页面动画模块(jsapi扩展,只支持容器中使用)     |
| $dom             | Object   | 页面节点信息模块(jsapi扩展,只支持容器中使用) |

```javascript
// 使用方式例如
  methods: {
    onShow() {
      console.log('loadOptions: ', this.$page.loadOptions)
      console.log('newOptions: ', this.$page.newOptions)
      this.page_loadOptions = this.$page.loadOptions
      this.page_newOptions = this.$page.newOptions
    }
  }
```

## page.setRootComponent

设置页面的根组件.每个页面都需要对应一个根组件.此方法在页面的onLoad生命周期中调用.

方法原型:`page.setRootComponent(component:Component)`

参数说明:

component:Vue组件对象

```javascript
import IndexComponent from './index.vue';

class PageIndex extends $falcon.Page {
  onLoad(options) {
    super.onLoad(options);
    this.setRootComponent(IndexComponent);
  }
}
export default PageIndex;
```

## page.finish

关闭当前页面

方法原型:`page.finish()`



# 关键字

页面跳转、路由
