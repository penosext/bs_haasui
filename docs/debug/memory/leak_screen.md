# 应用内存泄露问题排查一

IoT小程序不同于传统的web开发,采用每个页面对应一个Vue对象方式.在一些复杂的场景下,可能会发生内存泄露现象.下面是一些常见的前端内存泄露场景:

### 1.事件监听未释放

如在以下组件中,在`created`监听了页面的事件,需要再destroyed中调用off注销监听.

注:`off(eventName, callback)`方法,如果不传callback,会注销被监听对象中的所有eventName对应的方法.

```javascript
export default {
  data() {
    return {};
  },
  created() {
    this.$page.on("show", this.onPageShow);
  },
  destroyed() {  // 不要忘记注销监听.
    this.$page.off("show", this.onPageShow);
  },
  methods: {
    onPageShow() {
      // do something
    },
  },
};
```

### 2.定时器未关闭

如下场景中,在组件的`mounted`生命周期中启动了定时器,在离开页面时,需要调用`clearTimeout`停止计时.

```javascript
export default {
  data() {
    return {};
  },
  created() {
    this.$page.on("show", this.onPageShow);
    this.$page.on("hide", this.onPageHide);
  },
  mounted() {
    if (!this.timerId) {
      this.updateTime();
    }
  },
  destroyed() {
    this.$page.off("show", this.onPageShow);
    this.$page.off("hide", this.onPageHide);
  },
  methods: {
    onPageShow() {
      if (!this.timerId) {
        this.updateTime();
      }
    },
    onPageHide() {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = 0;
      }
    },
    updateTime() {
      // do something
     	this.timerId = setTimeout(() => {
        this.updateTime();
      }, 1000);
    },
  },
};
```

### 3.多组件多页面共享数据

一份数据在多个组件实例中使用时,根据vue实现机制,会直接在数据上增加get/set方法对数据进行递归监听.会导致组件多次引用同一份数据时,重复的创建响应式监听且无法释放.

```javascript
import ShareData from "share-data.js";

// 请注意,及时在组件的vue文件中定义的对象,如果定义在组件外,全局也只有一份.
// 如果当前组件会被创建多个,也会引起内存泄露.
const DATA_OUT_OF_COMPONENT = { my: "data", foo: "foo" };

export default {
  data() {
    return {
      share: ShareData,
      my: DATA_OUT_OF_COMPONENT
    };
  }
};
```

如果要在模板中引用,则修改成通过`computed`引用,如:

```javascript
import ShareData from "share-data.js";
const DATA_OUT_OF_COMPONENT = { my: "data", foo: "foo" };

export default {
  data() {
    return {};
  },
  computed:{
    share(){
      return ShareData
    },
    my(){
      return DATA_OUT_OF_COMPONENT
    }
  }
};
```

