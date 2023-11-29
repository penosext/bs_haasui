# **全局&应用对象**

### 全局对象($falcon)

全局唯一暴露对象:$falcon.该对象上挂载全局信息,应用信息,应用基类,接口,事件相关内容. 每个应用拥有一个独立的$falcon实例.应用中任意位置可访问$falcon对象.该实例下挂载的对象和方法

| 属性     |        | 类型                  | 说明               |
| -------- | ------ | --------------------- | ------------------ |
| 应用基类 | App    | Object                | 应用基类           |
| Page     | Object | 页面基类              |                    |
| 应用全局 | env    | Object                | 当前的全局环境信息 |
| $app     | Object | 当前应用的app.js实例. |                    |

- [全局事件见文档](app/event/global)
- [页面跳转见文档](app/event/jump)

### 应用对象($app)

应用对象存放于工程src目录下的app.js中,继承$falcon.App.应用启动时框架会初始化出一个App实例.该实例可通过$falcon.$app访问.实例存放的对象和基类方法

| 属性          | 类型   | 说明                      |
| ------------- | ------ | ------------------------- |
| $meta         | Object | 应用meta信息引用          |
| launchOptions | Object | 应用启动参数              |
| $falcon       | Object | 当前应用的$falcon对象引用 |

##### $app下的方法说明

$app方法可在任意能够获取app对象的位置使用(页面或组件中)

##### app.finish()

关闭当前应用

### 页面对象($page)

页面对象由app-meta.js中的pages属性定义.每个pages属性对应一个页面.在页面启动时由框架实例化.
组件中可通过在组件中this.$page 或者 $falcon.getPage(component:Component)获取当前页面的引用.
实例中存放的对象如下

| 属性             | 类型     | 说明                                                   |
| ---------------- | -------- | ------------------------------------------------------ |
| $root            | Object   | 页面根组件引用                                         |
| $pageName        | String   | 页面名称                                               |
| $pageId          | String   | 页面id                                                 |
| loadOptions      | Object   | 页面首次启动时的参数(***注1**)                         |
| newOptions       | Object   | 页面重新启动时的参数(***注1**，只保留最后一次打开参数) |
| setRootComponent | function | 设置根组件                                             |
| $animation       | Object   | 页面动画模块(jsapi扩展,只支持容器中使用)               |
| $dom             | Object   | 页面节点信息模块(jsapi扩展,只支持容器中使用)           |

- ***注1**：页面首次启动参数为onLoad生命周期回调时获取的参数.页面重新启动参数为onNewOptions生命周期回调时获取的参数

##### page.setRootComponent(component)

设置页面的根组件.每个页面都需要对应一个根组件.此方法在页面的onLoad生命周期中调用.

- component:Vue组件对象

##### page.finish()

关闭当前页面

### 四.组件对象

每个页面都有一个根组件(Vue Component),根组件与页面绑定,是页面渲染的基础,页面中通过$page.$root可获取到根组件. 所有组件(包括根组件及所有子组件)中包含以下对象

| 属性    | 类型   | 说明                      |
| ------- | ------ | ------------------------- |
| $app    | Object | 当前应用实例              |
| $page   | Object | 组件所在页面实例          |
| $falcon | Object | 当前应用的$falcon对象引用 |

### 五. 其他全局变量

| 全局变量名 | 类型   | 说明               |
| ---------- | ------ | ------------------ |
| $workspace | string | 当前应用的安装目录 |
| $dataDir   | string | 当前应用数据目录   |
| $appid     | string | 当前应用的appid    |

$workspace 可用于读取assets时拼接路径使用，比如应用根目录的assets目录会被打包到amr中，assets中的sound.mp3文件可以按照如下方法获得路径：

```javascript
const soundMp3 = `${$workspace}/assets/sound.mp3`
```

$dataDir 在存储应用私有数据时使用，例如按照如下方法获得app私有存储路径：

```
const savePath = `${$dataDir}/downloads/tmp.txt`
```

