# Linux系统库依赖

小程序框架V1.5版本以上提供一些Linux系统通用能力的扩展，**系统侧可以根据业务需要**，增加以下通用库的集成

#### 基础服务

- curl (http 网络请求)
- wpa_suppliant （wifi配网）
- framebuffer (推荐有vsync)
- tinyalsa驱动 或alsa-lib驱动 (音频驱动框架)
- v4l2驱动 (有camera场景，摄像头驱动框架)
- 视频场景：目前暂未提供JSAPI，客户可以自己选择ffmpeg 或 GStreamer 对接



#### 开发调试

- ssh 
- adb 强烈推荐有，方便开发调试