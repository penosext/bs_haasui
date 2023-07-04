# 系统配置说明

配置文件cfg.json位于/etc/miniapp/resources目录下，可根据需要，对功能进行配置。

| 可配置项            | 子属性                                                       | 默认值                                                       |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| screen              | "width": 屏幕分辨率宽度，单位px"height": 屏幕分辨率高度，单位px"xoffset": 屏幕跟fb的x偏移，单位px"yoffset": 屏幕跟fb的y偏移，单位px"dbuffer": 是否尝试启用双buffer"tp_xoffset": 触屏的坐标x偏移"tp_yoffset": 触屏的坐标y偏移"direction": fb顺时针旋转的方向，有0度、90度、180度和270度"fps_max": 最大刷新帧率 | "width": fb_width"height": fb_height"xoffset": 0"yoffset": 0"dbuffer": false"tp_xoffset": 0"tp_yoffset": 0"direction": 0"fps_max": 60 |
| device              | "fb": 帧缓冲"tp": 触屏"mouse": 鼠标""draw_cursor" ：是否开启触摸光标显示（**可以查看触摸坐标是否有偏移**） | "fb": "/dev/fb0","tp": "/dev/input/event0","mouse": """draw_cursor" : false |
| debugger(Linux)     | "enable": 是否启用调试功能"port_devtool": devtool调试端口"port_httpd": httpd调试端口 | "enable": false"port_devtool": 9307"port_httpd": 5556        |
| crash_report(Linux) | "enable": 是否启用功能"output": 输出栈回溯的文件目录         | "enable": false"output": "/data/miniapp/data/crash_report"   |
| linksdk             | "one_device_one_secret": 一机一密"one_type_one_secret_pre_registration": 一型一密预注册"one_type_one_secret_no_pre_registration": 一型一密非预注册 | "one_device_one_secret": false"one_type_one_secret_pre_registration": false"one_type_one_secret_no_pre_registration": false |
| filemanager         | "max_cache_size": 磁盘缓存大小"big_file_size"：大文件大小，文件大小超过此大小后下载操作会做特殊处理 | "max_cache_size": 4194304,<br/>"big_file_size": 524288       |
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

