# monkey测试

## 开启方式

在 cmake 配置文件中开启 ENABLE_MONKEY

比如：

```javascript
// simulator_mac.mk
add_definitions(-DENABLE_MONKEY)
```

## 运行时启动/停止monkey

1. 首先需要开启调试模式

```javascript
// simulator_mac.mk
set(ENABLE_DBG true)
add_definitions(-DENABLE_DBG)
```

1. 使用命令开启 monkey 模式

```javascript
miniapp_cli beginMonkey
```



1. 使用命令关闭 monkey 模式

```javascript
miniapp_cli stopMonkey
```

