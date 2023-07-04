# 开发环境安装

 

## 安装 NodeJS(必须) 

- [英文官网](https://nodejs.org/)，建议版本 v16 + 或更高 
- [中文官网下载](https://nodejs.org/zh-cn/download/) 
- 安装后系统具有 node/ npm 两个命令 
- 查看 nodejs 版本号，在终端中输入： 

```shell
node -v
```

tip: NodeJS 版本建议 16 稳定版本即可，具体可以[访问官网](https://nodejs.org/zh-cn/) 

- 查看 npm 版本号，在终端中输入： 

```shell
npm -v
```

- [NodeJS 教程](https://www.runoob.com/nodejs/nodejs-tutorial.html) (仅参考) 
- [npm 教程](https://www.runoob.com/nodejs/nodejs-npm.html) (仅参考) 

## 安装 cnpm(推荐) 

- 由于 npm 服务器不在国内，所以有时下载 JS 包时速度会慢一点，建议安装一下 cnpm 命令  

- 安装命令： 

```shell
Linux/MacOS X:
sudo npm install -g cnpm --registry=https://registry.npmmirror.com

Windows:
npm install -g cnpm --registry=https://registry.npmmirror.com
```

- 查看 cnpm 版本号，在终端中输入：cnpm -v 

- 后面可以用 cnpm 命令替代 npm 

## 安装 VSCode 开发 IDE(推荐) 

- JS 前端开发推荐安装 VSCode 
- [官网地址](https://code.visualstudio.com/)，推荐在官网下载 
- MacOS 系统 stable 版本国内加速[下载地址](https://vscode.cdn.azure.cn/stable/899d46d82c4c95423fb7e10e68eba52050e30ba3/VSCode-darwin-universal.zip) 
- Window 系统 stable 本国内加速[下载地址](https://vscode.cdn.azure.cn/stable/899d46d82c4c95423fb7e10e68eba52050e30ba3/VSCodeUserSetup-x64-1.63.2.exe) 
- Linux 系统 stable deb 国内加载[下载地址](https://vscode.cdn.azure.cn/stable/899d46d82c4c95423fb7e10e68eba52050e30ba3/code_1.63.2-1639562499_amd64.deb) 

## 安装框架脚手架 

框架脚手架提供项目创建、构建 Debug & Release 包、运行模拟器等能力 

```shell
Linux/MacOS X:
sudo cnpm i aiot-vue-cli -g     //-g 表示全局安装，必须输入

Windows:
cnpm i aiot-vue-cli -g     //-g 表示全局安装，必须输入
```

- 查看 aiot-cli 版本号，在终端中输入: 


```shell
aiot-cli -V     //大写的V
```

- windows 系统：如果无法打印版本，需要配置环境变量 

- tip：强制安装某个版本 

```shell
cnpm install -g aiot-vue-cli@1.0.23  //当前cli最新版本我1.0.23
```

> 如果运行 cli 出现错误：Error: Cannot find moudle 'request' 
> 可以尝试运行命令修复：cnpm install -g request semver prompts pump 

## 删除框架脚手架 

```shell
cnpm uninstall aiot-vue-cli
```



## 模拟器下载 (推荐) 

- 模拟器自带一个演示 Demo，可以下载浏览 

- [Mac 模拟器下载](https://hli.aliyuncs.com/o/config/simulator/haas-ui-simulator-mac-v2.zip) 

	- 由于 Mac 电脑权限限制，zip 压缩包解压之后，在终端控制台进入模拟器文件夹下面，输入 ./appx 可运行该模拟器 

	![](../_images/mac_simulator.png)


- [Windows 模拟器下载](https://hli.aliyuncs.com/o/config/haasui/simulator/windows_x64/haasui-simulator-windows-64_v1.4.zip) 
	- 解压之后，进入模拟器文件夹下面，输入 .\appx.exe 可运行该模拟器 
- [Ubuntu (Linux PC) 模拟器下载](https://hli.aliyuncs.com/o/config/miniapp/haas-ui-simulator-ubuntu.zip) 
	- 安装 sdl2： sudo apt-get install libsdl2-dev 
- 模拟器配置及运行注意事项请参考 [https://www.yuque.com/wcye0k/haasui/uymera](app/simulator/intro)