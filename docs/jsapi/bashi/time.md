# 时间

## 1.概述

封装的时间相关接口

## 2.模块使用方式

```javascript
import { time } from "time"
```

## 3.方法

### 3.1  uptime 系统运行时间

#### 返回值

- 系统运行时间

#### 用法示例

```javascript
time.uptime()
```

### 3.2  uptimeMs 系统运行时间毫秒

#### 返回值

- 系统运行时间 

#### 用法示例

```javascript
time.uptime()
```

### 3.3 getMillisecond 获取时间戳

#### 返回值

- 时间戳

#### 用法示例

```javascript
time.getMillisecond()
```

### 3.4 setUTC 设置时间

#### 参数

- utc：时间戳 秒

#### 返回值

- 0 成功

#### 用法示例

```javascript
time.setUTC({ utc: 1691657073 })
```

### 3.5 hwclock_write 设置系统时间到rtc

#### 返回值

- 0 成功

#### 用法示例

```javascript
time.hwclock_write()
```

### 3.6 hwclock_read 读取rtc时间到系统

#### 返回值

- 0 成功

#### 用法示例

```javascript
time.hwclock_read()
```

