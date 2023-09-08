import { isString, isNumber, isObject } from "../../utils/util"
import { ytwl } from "nfc"
import misc from "../misc/misc"

class Card {
  card
  isInit = false
  lastCard = ""

  constructor() {
    this.card = new ytwl()
  }

  init(port, cb) {
    if (this.isInit) {
      return
    }
    this.card.on("cardid", (res) => {
      console.log("cardid read")
      let hex = misc.toHexString(new Uint8Array(res))
      console.log(hex)
      cb(hex)
    })
    this.card.init({
      port: port,
    })
    this.isInit = true
  }

  readLastCard() {
    if (this.isInit) {
      return this.lastCard
    }
    return ""
  }
}

export default new Card()
