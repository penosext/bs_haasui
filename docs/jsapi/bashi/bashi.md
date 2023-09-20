# Walos扩展JSAPI简介

  

##### **需要使用Walos扩展jsapi，必须将libjsapi_wos.so置于项目中**

在src同级目录中创建libs文件夹，将libjsapi_wos.so放置于其中即可调用

![image.png](../../_images/bashi-jsapi.png)

##### 项目的资源文件：

在libs同级目录下新建名为 *assets* 的文件夹，资源文件可放此处，其它名称则无法被打包

![img](../../_images/bashi-assest.png)

##### 相关说明：

在真机调试时，请通过ssh登录设备、或者通过串口1登录设备，

正常调试流程：

1.ssh/串口登录设备，root     fasys2023

2.cd /home/walos

3.修改/home/walos/haasui/data/miniapp/data/mini_app/pkg中的 packages.json，

将其中的项，将自己的appid填入`"category":"HOME"`那一项中，这样后续启动的时候就是启动自己的调试程序了（若已经是了，则忽略这步）

4.进入/home/walos目录，输入 killall walos 杀死程序

5.输入 ./startup.sh 启动程序

6.通过vscode中的Miniapp:Upload 写一下程序

7.写成功可以看到自己的程序死了，这是正常的，输入 ./startup.sh 重新启动程序

##### 相关下载：

libjsapi_wos.so [[下载](https://gitee.com/mzrui/bs_haasui/blob/master/libjsapi_wos.so)]

打包为Walos刷机包和升级包,需在linux环境下，详见[打包仓库](https://gitee.com/WalOS/haasui-package)

人脸识别demo [查看](https://gitee.com/mzrui/bs_haasui/tree/master/haas_ac_demo)

一些其它demo[查看](https://gitee.com/walosx/haasui-test-example)