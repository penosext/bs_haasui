# gpio

## 1.概述

封装了基本的gpio调用

## 2.模块使用方式

```javascript
import { gpio } from "gpio"
let g1 = new gpio()
```

## 3.方法

### 3.1 open 

#### 参数

- type ： 0 逻辑（建议使用这个） ，1物理
- gpio ： gpio编号
- dir ： 0输入，1输出

#### 返回值

- 0成功，失败返回错误信息

#### 用法示例

```javascript
g1.open({ type: 0, gpio: 128, dir: 1 })
```

### 3.2 close 

#### 返回值

- 0成功

#### 用法示例

```javascript
g1.close()
```

### 3.3 write 

#### 参数

- value ： 0 低 1高

#### 返回值

- 0成功，失败返回错误信息

#### 用法示例

```javascript
g1.write({ value: 1 })
```

### 3.4 read 

#### 返回值

- 0/1 ，失败返回错误信息

#### 用法示例

## 4.简单封装示例

```javascript
import { gpio } from "gpio"
import { isString, isNumber, isObject, isFunction } from "../../utils/util"


class Gpio {
  GPIO_TYPE_LOGICAL = 0
  GPIO_TYPE_PHYSICAL = 1


  GPIO = {
    PUSH: 1,
    RELAY: 128,
    SWITCH: 129,
    WLED: 130,
    IRLED: 131,
    LCD: 132,
  }


  DIR = {
    GPIO_INPUT: 0,
    GPIO_OUTPUT: 1,
  }
  LEVEL = {
    GPIO_LOW: 0,
    GPIO_HIGH: 1,
  }


  gpioMap = {}


  constructor() {}


  /**
   *
   * @param {Gpio.GPIO} id
   * @param {Gpio.DIR} dir
   * @returns
   */
  init_gpio(id, dir) {
    if (this.gpioMap[id]) {
      return
    }
    this.gpioMap[id] = new gpio()
    this.gpioMap[id].open({ type: this.GPIO_TYPE_LOGICAL, gpio: id, dir: dir })
  }


  /**
   *
   * @param {Gpio.GPIO} id
   * @param {Gpio.LEVEL} value
   */
  write(id, value) {
    if (this.gpioMap[id]) {
      return
    }
    this.gpioMap[id].write({ value: value })
  }


  /**
   *
   * @param {Gpio.GPIO} id
   * @returns >=0
   */
  read(id) {
    if (this.gpioMap[id]) {
      return
    }
    let rc = this.gpioMap[id].read()
    if (!isNumber(rc)) {
      return -1
    }
    return rc
  }


  /**
   *
   * @param {Gpio.GPIO} id
   */
  close(id) {
    if (this.gpioMap[id]) {
      return
    }
    this.gpioMap[id].close()
    this.gpioMap[id] = null
  }
}


export default new Gpio()
```

