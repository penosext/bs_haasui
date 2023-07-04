# 应用生命周期

## 介绍 

应用由多个页面组成.应用运行的各个阶段,可通过应用对象和页面对象获得应用生命周期回调.

注：通过VSCode创建工程后，对应生命周期代码已被创建

### 应用

应用入口为app.js.应用启动时会先执行该脚本.执行后导出一个继承自$falcon.App的子类.容器在拿到该类后开始执行应用生命周期.
应用生命周期:onLaunch,onShow,onHide,onDestroy.详细介绍和示例:

```javascript
class App extends $falcon.App {
  /**
   * 构造函数,应用生命周期内只构造一次
   */
  constructor() {
    super();
  }
  /**
   * 应用生命周期:应用启动. 初始化完成时回调,全局只触发一次.
   * @param {Object} options 启动参数
   */
  onLaunch(options) {
    super.onLaunch(options);
  }
  /**
   * 应用生命周期,应用启动或应用从后台切换到前台时触发
   */
  onShow() {
    super.onShow();
  }
  /**
   * 应用生命周期:应用退出前或者应用从前台切换到后台时触发
   */
  onHide() {
    super.onHide();
  }
  /**
   * 应用生命周期:应用销毁前触发
   */
  onDestroy() {
    super.onDestroy();
  }
}

export default App;
```

#### 应用全局配置

应用配置文件为app.json
在应用配置文件中指定当前页面名称及页面路径.配置项为一个Object. key为页面名称,value为页面路径.
页面可以为一个继承自$falcon.Page的js,也可以直接指定一个vue组件.
每个应用必须配置一个index页面.该页面为应用启动时的默认页面.

```json
{
  "pages": {
    "index": "pages/index/index.js",
    "page2": "pages/page2/page2.vue"
  }
}
```

### 页面

应用的每个页面对应一个Page实例.如果在应用配置中页面路径直接指向一个Vue组件,框架会为页面自动创建一个对应的Page实例.
页面启动时先执行对应的页面[page].js脚本,得到导出的Page对象后后执行页面的生命周期.
**注:**页面展示以前(生命周期onShow被调用之前)需要通过setRootComponent方法给页面设置根组件(在生命周期onLoad中设置).



```javascript
import IndexComponent from './index.vue';

class PageIndex extends $falcon.Page {
  /**
   * 构造函数,页面生命周期内只执行一次
   */
  constructor() {
    super();
  }
  /**
   * 页面生命周期:首次启动
   * @param {Object} options 页面启动参数
   */
  onLoad(options) {
    super.onLoad(options);
    
    // 在onLoad方法中设置当前页面的根组件
    this.setRootComponent(IndexComponent);
  }
  /**
   * 页面生命周期:页面重新进入
   * 其他应用或者系统通过$falcon.navTo()方法重新启动页面.可以通过这个回调拿到新启动的参数
   * @param {Object}} options 重新启动参数
   */
  onNewOptions(options) {
    super.onNewOptions(options);
  }
  /**
   * 页面生命周期:页面进入前台
   */
  onShow() {
    super.onShow(); //调用父类生命周期
    //onLoad生命周期之后,可以调用到根组件的方法
    this.$root.sayHello();
  }
  /**
   * 页面生命周期:页面进入后台
   */
  onHide() {
  }
  /**
   * 页面生命周期:页面卸载
   */
  onUnload() {
  }
}
export default PageIndex;
```

