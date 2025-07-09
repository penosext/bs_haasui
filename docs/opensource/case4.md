# 时钟案例

## 展示效果 

### gif 效果展示 

![test.gif](../_images/case4.gif)



 示例代码下载 

[下载](https://raw.githubusercontent.com/penosext/bs_haasui/refs/heads/master/timer-examples.zip)

 简单讲解 

时钟显示分为两段文字（时分），和一个闪烁的分隔符。

文字随着变量的修改，通过 MVVM 特性刷新显示。

分隔符随着变量 showColon 的 true false 变化而显示隐藏，产生闪烁效果。

通过 setInterval 接口在 1s 周期进行上述变量的更新，驱动显示变化。
