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
    if (!this.gpioMap[id]) {
      return -1
    }
    return this.gpioMap[id].write({ value: value })
  }

  /**
   *
   * @param {Gpio.GPIO} id
   * @returns >=0
   */
  read(id) {
    if (!this.gpioMap[id]) {
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
    if (!this.gpioMap[id]) {
      return
    }
    this.gpioMap[id].close()
    this.gpioMap[id] = null
  }
}

export default new Gpio()
