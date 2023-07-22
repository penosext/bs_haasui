<!-- docs/_sidebar.md -->



- 介绍
  - [IoT小程序框架介绍](index)
  - [垂直产品演示效果](show)
  
- 快速开始

  - [简单上手流程](quick/simple)
  - [开发环境安装](quick/env)
  - [开发插件](quick/vscode)
  - [命令行工具](quick/commandline)
  - [miniapp_cli指令介绍](quick/cli)
  
- 应用开发

  - [生命周期](app/life)
  - UI组件

    - [前端基础组件](app/ui/base)
      - [\<div>](app/ui/div)
      - [\<text>](app/ui/text)
      - [\<image>](app/ui/image)
      - [\<scroller>](app/ui/scroller)
      - [\<image-frame>](app/ui/image-frame)
      - [\<input>](app/ui/input)
      - [\<textarea>](app/ui/textarea)
      - [\<slider>](app/ui/slider)
      - [\<richtext>](app/ui/richtext)
      - [\<canvas>](app/ui/canvas)
      - [\<lottie>](app/ui/lottie)
      - [\<qrcode>](app/ui/qrcode)
      - [\<modal>](app/ui/modal)
      - [\<seekbar>](app/ui/seekbar)
    - [图片扩展功能](app/pic)
  - CSS样式
    - [通用样式](app/css/common/common)
      - [盒模型](app/css/common/box)
      - [Flexbox](app/css/common/flex) 
      - [Transition](app/css/common/transition)
      - [Transform](app/css/common/transform)
      - [线性渐变](app/css/common/line_grad)
      - [阴影(box-shadow)](app/css/common/shadow)
      - [其它基本样式](app/css/common/other)
    - [文本样式](app/css/text)
    - [字库配置](app/css/font)
    - [CSS单元](app/css/css-base)
    - [CSS动画](app/css/css-animation)
    - [Less支持](app/css/less)
    - [CSS切换-多主题切换](app/css/theme)
    - [多分辨率自适应机制](app/css/css-screen)
  - 事件
    - [通用组件事件](app/event/common)
    - [页面跳转](app/event/jump)
    - [全局事件](app/event/global)
    - [模块事件](app/event/model)
    - [左滑事件](app/event/touch)
  - 模拟器
    - [模拟器介绍](app/simulator/intro)
    - [模拟器注意事项](app/simulator/attention)
  - 模块调用
    - [如何使用页面模块](app/modelUse/use)

- JSAPI

  - [系统级别JSAPI](jsapi/system/system)

    - 文件&加解密
      - [fs-文件操作](jsapi/system/file_crypto/fs)
      - [storage-kv存储](jsapi/system/file_crypto/storage-kv)
      - [sqlite-数据库](jsapi/system/file_crypto/sqlite)
      - [zip-压缩/解压](jsapi/system/file_crypto/zip)
      - [crypto-加解密](jsapi/system/file_crypto/crypto)
    - 容器框架服务
      - [nav-页面导航](jsapi/system/falcon/nav)
      - [应用和页面管理](jsapi/system/falcon/pages)
      - [am-应用栈管理](jsapi/system/falcon/am)
      - [pm-应用包管理](jsapi/system/falcon/pm)
      - [updater-应用升级](jsapi/system/falcon/updater)

  - [八识扩展JSAPI](jsapi/bashi/bashi)

    - [算法](jsapi/bashi/algm)
    - [文件操作扩展](jsapi/bashi/file)
    - [音视频](jsapi/bashi/mpp)
    - [gpio](jsapi/bashi/gpio)
    - [串口](jsapi/bashi/uart)
    - [mqtt](jsapi/bashi/mqtt)
    - [http](jsapi/bashi/http)
    - [httpserver](jsapi/bashi/httpserver)
    - [刷卡](jsapi/bashi/nfc)
    - [身份证](jsapi/bashi/pid)
    - [其它](jsapi/bashi/misc)

  - JSAPI扩展方案-v2

    - [JSAPI - hello模块封装讲解](jsapi/ext/hello)
    - [JSAPI - 入参和解析](jsapi/ext/params)
    - [JSAPI-如何编译](jsapi/ext/compile)

  - [容器框架服务](jsapi/env/main)

    - [容器全局信息](jsapi/env/global)

  - [模拟器混入mkck jsapi代码](jsapi/mock_jsapi)

  - [JSAPI私有库与共享库使用说明](jsapi/jsapi_use_mode)

  - [编译不同arch架构下私有库的amr包方案](jsapi/arch)

     

- 开源案例
  - [公版案例](opensource/case1)
  - [智能闹钟](opensource/case2)
  - [智能空调](opensource/case3)
  - [时钟](opensource/case4)
  - [智能手表](opensource/case5)
  - [厂测案例](opensource/case6)
- 优化&调试

  - chrome调试
    - [App调试技巧](debug/chrome/app)
    - [使用chrome浏览器调试](debug/chrome/chrome)
    - [DOM节点调试](debug/chrome/dom)

  - 性能优化
    - [性能调试分析](debug/performance/analysis)
    - [卡片圆角性能损耗](debug/performance/loss)

  - 内存调试
    - [内存泄漏分析](debug/memory/leak)
    - [应用内存泄漏问题排查一](debug/memory/leak_screen)

  - 测试相关
    - [monkey测试](debug/test/monkey)

- 系统环境&编译
  - [系统配置](system_env_compile/sys_conf)
  - [不同系统适配要求](system_env_compile/ui_fit)
  - [Linux系统库依赖](system_env_compile/linux)
  - [设备预置包配置说明](system_env_compile/preset)
  - [应用更新](system_env_compile/update)
- FAQ
  - [开发环境](faq/env)
  - [配置alias目录别名](faq/alias)

