# 应用和页面管理

  1.概述

应用和页面的退出方案，合理退出可以有效降低设备的内存资源的占用

# 2.App

App的方法不是全局,是应用对应的App类实例化后的方法.该实例可通过`$falcon.$app`属性获取

## 2.1 app.finish()

**用法**

退出当前应用，应用退到后台时调用

```javascript
$falcon.$app.finish();	// 可以通过$falcon全局对象获取当前应用App对象的实例
```

# 3.Page

Page的方法不是全局的,只在页面生命周期内以及页面的根组件和子组件中可访问.

组件中可通过在组件中`this.$page` 或者 `$falcon.getPage(component:Component)`获取当前页面的引用

## 3.1 page.finish

**用法**

关闭当前页面

```javascript
this.$page.finish();	
```

## 3.2 page.setRootComponent

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

