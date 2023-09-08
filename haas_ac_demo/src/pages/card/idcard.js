import {
  isString,
  isNumber,
  isObject,
  isFunction,
  isAsyncFunction,
} from "../../utils/util"
import { derk } from "pid"

class IdCard {
  card
  isInit = false
  lastCard = ""

  IDCARD_NOTIFY_ERROR_DECODE = -5 // 人脸图片解码失败
  IDCARD_NOTIFY_ERROR_SOCKET = -4 // SOCKET 通讯失败
  IDCARD_NOTIFY_LEAVE = 0 // 证件离开
  IDCARD_NOTIFY_FIND = 1 // 发现证件
  IDCARD_NOTIFY_SUCCESS = 2 // 证件信息提取成功

  constructor() {
    this.card = new derk()
  }

  /**
    初始化
    @param {Number} port 串口号
    @param {Function(boolean)} foundCb  检测到卡/卡离开的回调
    @param {Function(Object)} readCb 读信息成功的回调,返回 name uuid dma_addr dma_size
    @param {Function(Number,String)} errCb  异常的回调
   */
  init(port, foundCb, readCb, errCb) {
    if (this.isInit) {
      return
    }
    this.card.on("pid", (res) => {
      console.log("pid event")
      if (
        res.event === this.IDCARD_NOTIFY_FIND ||
        res.event === this.IDCARD_NOTIFY_LEAVE
      ) {
        if (isFunction(foundCb) || isAsyncFunction(foundCb)) {
          foundCb(res.event === this.IDCARD_NOTIFY_FIND)
        }
      } else if (res.event === this.IDCARD_NOTIFY_SUCCESS) {
        if (isFunction(readCb) || isAsyncFunction(readCb)) {
          readCb(res)
        }
      } else {
        let code = res.event
        let msg = ""
        if (code === this.IDCARD_NOTIFY_ERROR_SOCKET) {
          msg = "通讯失败，需检查网络"
        } else if (code === this.IDCARD_NOTIFY_ERROR_DECODE) {
          msg = "解码失败，需检查网络"
        }
        if (isFunction(errCb) || isAsyncFunction(errCb)) {
          errCb(code, msg)
        }
      }
    })
    this.card.init({
      port: port,
    })
    this.isInit = true
  }
}

export default new IdCard()
