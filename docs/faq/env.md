# 开发环境

  Windows系统开发环境安装问题

#### 脚手架无法安装问题

在Windows系统上部署开发环境是，存在脚手架无法装问题

- vscode装机完毕后，cmd命令把前期部署的都搞完
- 手脚架无法安装问题：解决办法：cnpm install -g request semver prompts pump，验证办法：aiot-cli -V出版本号

#### 模拟器路径配置

模拟器配置设置地址，一定要指向虚拟机dome下.exe上一层的地址

#### 部署完相关项目后选择编译和执行后，一直让重试

- 建议在vsxode终端切换cmd命令，执行aiot-cli simulator --simpath C:\Users\issuser\Downloads\haasui-simulator-windows-64，这个地址选择demo虚拟机的地址

