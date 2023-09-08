import { isString, isNumber, isObject } from "../../utils/util"
import { uart } from "uart"
import misc from "../misc/misc"

//初始化读取配置，初始化读取设备id
class Uart {
  com2
  constructor() {}

  init_com1() {
    this.com2 = new uart()
    this.com2.on("data", (res) => {
      console.log("read")
      console.log(misc.uint8ArrayToString(new Uint8Array(res)))
      console.log(misc.toHexString(new Uint8Array(res)))
      this.com2.write(new Uint8Array(res))
    })
    this.com2.open({
      port: 2,
      baudrate: 115200,
      nbits: 8,
      parity: "N",
      sbits: 1,
      mode: 1, //1 则通过on回调
    })
    // let arr = [0x01, 0x02]
    // let buf = new Uint8Array(arr)
    // const result = buf[0] ^ buf[1]
    // console.log(
    //   `计算${misc.toHexString(buf)}的异或校验值:${result
    //     .toString(16)
    //     .padStart(2, "0")}`
    // )
    // setInterval(() => {
    //   this.com2.write(misc.stringToUint8Array("test"))
    // }, 1000)
  }
}

export default new Uart()
