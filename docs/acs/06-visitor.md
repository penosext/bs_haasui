# 访客管理
----------

#### 说明
设备访客功能主要有两种机制实现：

#### 在屏幕上显示动态二维码图标，通过微信直接扫码实现
> 1. 可跳转到小程序，访客开门；
> 2. 可跳转到小程序，用户开门；
> 3. 可跳转到小程序，申请加入；
> 4. 可跳转到小程序，语音呼叫；


由第三方小程序根据扫描的二维码，进行逻辑判断并做远程开门，实现访客功能。


##### 二维码格式
https://api.bashisense.com/d/[customer]/[devid]/[timestamp]/[sign]

该二维码格式中的前缀（https://api.bashisense.com/d）可配置manager-qrcode修改

为第三方小程序的跳转地址
customer = 客户代号, [0~9,a~z,A~Z]，默认bashi
devid = 设备ID号
timestamp = 时间戳字符串
sign = 验证码前4字节的HEX值，验证方案：SHA256(devid, timestamp，secret), secret为激活时返回的secret值--
如：https://api.bashisense.com/d/zk/0014Bt12QQ422/1633148592/EF02CAB0

