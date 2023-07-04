# sqlite-数据库

  1. 概述

sqlite3数据库操作，执行sql语句，返回数据和执行结果

部分参考 node-sqlite3 接口 https://github.com/TryGhost/node-sqlite3/wiki/API，比如 all、run、bind等

qjs-sqlite3 接口 https://github.com/ratboy666/qjs-sqlite3，比如 step 等

# 2. 模块使用方式

```javascript
import sqlite3 from 'sqlite3'
```

# 3. 方法

## 3.1 open()

**参数**

- path 数据库路径

**返回值**

- Promise，成功返回0，错误返回错误信息

**用法：**打开一个数据库时调用

```javascript
let db = new sqlite3.Database()
await db.open('tstSqlite3.db')
```

## 3.2 close()

**参数**

- 无

**返回值**

- Promise，只有成功，返回"OK"表示关闭操作有效，"CLOSED"表示数据库已关闭

**用法：**关闭数据库

```javascript
await db.close()
```

## 3.3 exec()

**参数**

- sql：待执行的sql语句

**返回值**

- Promise，成功返回0，错误返回错误信息

**用法：**执行sql语句

```javascript
let sql = `CREATE TABLE IF NOT EXISTS tst_table(
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      FILE_ID   TEXT    NOT NULL,
      DIR       TEXT    NOT NULL,
      NAME      TEXT    NOT NULL
);
`
await db.exec(sql)
```

## 3.4 prepare()

**参数**

- sql：待编译的sql语句

**返回值**

- Promise，成功返回 Statement 对象，错误返回错误消息

**用法：**编译sql语句，生成 Statement 对象，供后续绑定参数或执行sql使用

```javascript
let sql = `INSERT INTO tst_table (ID,FILE_ID,DIR,NAME) VALUES (?, ?, ?, ? );`
let st = await db.prepare(sql)
```

## 3.5 path

**属性值**

**返回值**

- 当前数据库路径

**用法：**获取当前数据库路径

```javascript
console.log(db.path)
```



## 3.6 Statement.columnNameList()

**参数**

- 无

**返回值**

- Promise，返回string列表

**用法：**获取当前 Statement 的列名称列表

```javascript
let columnNameList = await st.columnNameList()
```

## 3.7 Statement.bindParameterList()

**参数**

- 无

**返回值**

- Promise，返回string列表

**用法：**获取当前 Statement 绑定参数的名称列表

```javascript
let bindParameterList = await st.bindParameterList()
```

## 3.8 Statement.bind()

**参数**

- 支持几种入参：
  - 参数列表，用于绑定参数列表
  - 数组，用于绑定参数列表
  - 字典，用于绑定具名参数值

**返回值**

- Promise，返回string列表

**用法：**绑定参数值

```javascript
let res
res = await st.bind(1, 'fid01', 'dir01', 'name01')
res = await st.bind({ ':fid': 'fid01' })
res = await st.bind(['fid01'])
```

## 3.9 Statement.step()

**参数**
- 无

**返回值**
- Promise
  - 如果是 select 语句返回行数据
  - 已完成所有执行时返回 null
  - 错误返回错误信息

**用法：**执行 Statement 对应的 sql，一般在bind参数值后调用

```javascript
let res = await st.step()
```

## 3.10 Statement.run()

**参数**

- 无

**返回值**

- Promise，成功返回0，失败返回错误信息

**用法：**执行 Statement 对应的 sql，完成所有行的执行直到完成状态

```javascript
let res = await st.run()
```

## 3.11 Statement.all()

**参数**

- 无

**返回值**

- Promise，成功返回所有select行数据（如果非select则返回空数组），错误返回错误信息

**用法：**执行 Statement 对应的 sql，直到完成状态，并返回所有行数据

```javascript
let res = await st.all()
```

## 3.12 Statement.reset()

**参数**

- 无

**返回值**

- Promise，成功返回0，错误返回错误信息

**用法：**重置 Statement 状态，使它变为可重新执行状态

```javascript
let res = await st.reset()
```

## 3.13 Statement.clearBindings()

**参数**

- 无

**返回值**

- Promise，成功返回0，失败返回错误信息

**用法：**重置 Statement 绑定参数值，可以再次绑定新的值使用

```javascript
let res = await st.clearBindings()
```

## 3.14 Statement.finalize()

**参数**

- 无

**返回值**

- Promise，成功返回0，重复释放返回“FINALIZED”，失败返回错误信息

**用法：**销毁 Statement，调用改 Statement 资源被释放，所有成员方法不能再次调用

> 注意finalize时需加 await，避免销毁时的内存占用问题

```javascript
let res = await st.finalize()
```

