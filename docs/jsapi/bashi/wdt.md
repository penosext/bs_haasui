# 看门狗

## 1.概述

封装的看门狗相关接口

## 2.模块使用方式

```javascript
import { wdt } from "wdt"
```

## 3.方法

### 3.1  autorun 启用

#### 返回值

- 系统运行时间

#### 用法示例

```javascript
wdt.autorun()
```

### 3.2  autostop 停用

#### 返回值

- 系统运行时间 

#### 用法示例

```javascript
wdt.autostop ()
```
