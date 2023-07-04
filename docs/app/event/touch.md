# 左滑事件

#### 监听左滑事件

```javascript
// 禁用左滑退出
this.$page.$npage.setSupportBack(false);
// 监听backpressed（左滑事件）
let backpressed = () => {
    this.$page.finish();
};
this.$page.$npage.on("backpressed", backpressed);

// 注销
this.$page.$npage.off("backpressed", backpressed);
```

