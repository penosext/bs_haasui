# 系统配置说明

配置文件cfg.json位于/etc/miniapp/resources目录下，可根据需要，对功能进行配置。

| 可配置项            | 子属性                                                       | 默认值                                                       |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| screen              | "width": 屏幕分辨率宽度，单位px<br>"height": 屏幕分辨率高度，单位px<br>"xoffset": 屏幕跟fb的x偏移，单位px<br>"yoffset": 屏幕跟fb的y偏移，单位px<br>"dbuffer": 是否尝试启用双buffer<br>"tp_xoffset": 触屏的坐标x偏移<br>"tp_yoffset": 触屏的坐标y偏移<br>"direction": fb顺时针旋转的方向，有0度、90度、180度和270度(<font color=red>**video模块比fellow该字段进行横竖屏判断**</font>)<br>"fps_max": 最大刷新帧率 | "width": fb_width<br/>"height": fb_height<br/>"xoffset": 0<br/>"yoffset": 0<br/>"dbuffer": false<br/>"tp_xoffset": 0<br/>"tp_yoffset": 0<br/>"direction": 0<br/>"fps_max": 60 |
| device              | "fb": 帧缓冲<br/>"tp": 触屏<br/>"mouse": 鼠标<br/>"draw_cursor" ：是否开启触摸光标显示（<font color=red>**可以查看触摸坐标是否有偏移**</font> ） | "fb": "/dev/fb0",<br/>"tp": "/dev/input/event0",<br/>"mouse": ""<br/>"draw_cursor" : false |
| debugger(Linux)     | "enable": 是否启用调试功能<br/>"port_devtool": devtool调试端口<br/>"port_httpd": httpd调试端口 | "enable": false<br/>"port_devtool": 9307<br/>"port_httpd": 5556 |
| crash_report(Linux) | "enable": 是否启用功能<br/>"output": 输出栈回溯的文件目录    | "enable": false<br/>"output": "/data/miniapp/data/crash_report" |
| linksdk             | "one_device_one_secret": 一机一密<br/>"one_type_one_secret_pre_registration": 一型一密预注册<br/>"one_type_one_secret_no_pre_registration": 一型一密非预注册 | "one_device_one_secret": false<br/>"one_type_one_secret_pre_registration": false<br/>"one_type_one_secret_no_pre_registration": false |
| filemanager         | "max_cache_size": 磁盘缓存大小<br/>"big_file_size"：大文件大小，文件大小超过此大小后下载操作会做特殊处理 | "max_cache_size": 4194304,<br/>"big_file_size": 524288       |
| imageloader         | "image_cache_size": 内存中的图片缓存大小                     | "image_cache_size": 4194304                                  |

```json
{
    "screen": {
        "width": 800,
        "height": 480,
        "xoffset": 0,
        "yoffset": 0
        "direction": 0,
        "fps_max": 60
    },
    "device": {
        "fb": "/dev/fb0",
        "tp": "/dev/input/event0",
        "mouse": ""
    },
    "debugger": {
        "enable": true,
        "port_devtool": 9307,
        "port_httpd": 5556
    },
    "linksdk": {
        "one_device_one_secret": false,
        "one_type_one_secret_pre_registration": false,
        "one_type_one_secret_no_pre_registration": true
    },
    "filemanager": {
        "max_cache_size": 4194304,
        "big_file_size": 524288
    },
    "imageloader": {
        "image_cache_size": 4194304
    }
}
```

