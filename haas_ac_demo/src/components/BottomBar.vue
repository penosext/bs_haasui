// 主界面底部栏 分为上下两部分 上部分为提示信息，下部分为IP和设备id等信息
<template>
  <div class="wrapper">
    <div class="top_wrapper">
      <image class="status-img" :src="statusImg" />
      <div class="status-text">
        <text class="primary-text" :marquee="true">{{ primaryTips }}</text>
        <text class="second-text" :marquee="true">{{ secondTips }}</text>
      </div>
    </div>
    <div class="bottom_wrapper">
      <div class="bottom_text">
        <text class="btext">{{ leftText }}</text>
      </div>
      <div class="bottom_text2">
        <text class="btext">{{ ip }}</text>
      </div>
    </div>
  </div>
</template>
<script>
import conf from "../pages/conf/conf"
import { DEFINE } from "../utils/define"
import netmanager from "../pages/netmanager/netmanager"
export default {
  props: ["normal"],
  data() {
    return {
      devId: "null",
      devVersion: "0.0.0",
      ip: "",
      index: 0,
      timerBt: 0, //设备id和版本轮播的定时器
      timerId: 0, //ui恢复正常的定时器
      tipStatus: 0, //ui状态，0正常状态，1成功状态，2失败状态
      bottonLeftTips: "",
      primaryTips: "",
      secondTips: "",
    }
  },
  created() {
    this.$page.on("show", this.onPageShow)
    this.$page.on("hide", this.onPageHide)
    this.timerId = 0
    this.timerBt = 0
    this.index = 0
    this.primaryTips = "Welcome"
    // this.secondTips = "haas ui test"
    conf.cfgGet(DEFINE.configUi.doorId).then((res) => {
      this.secondTips = res
    })
  },
  async mounted() {
    this.onPageShow()
    this.devId = await conf.cfgDeviceId()
    // console.log("top-------" + this.devId)
  },
  destroyed() {
    this.timerId && clearTimeout(this.timerId)
    this.timerBt && clearTimeout(this.timerBt)

    this.$page.off("show", this.onPageShow)
    this.$page.off("hide", this.onPageHide)
  },
  computed: {
    leftText() {
      switch (this.index % 2) {
        case 1:
          return "version : " + conf.cfgSoftVersion()
        case 0:
        default:
          return "devId : " + this.devId
      }
    },
    statusImg() {
      switch (this.tipStatus) {
        case 1:
          return require("../../assets/tips/reco.png")
        case 2:
          return require("../../assets/tips/reco.png")
        case 0:
        default:
          return require("../../assets/tips/user.png")
      }
    },
  },
  watch: {},
  methods: {
    onPageShow() {
      if (!this.timerBt) {
        this.updateBLeft()
      }
      $falcon.on(DEFINE.event.ALGM_RECOG_SHOW, this.updateTips)
    },
    onPageHide() {
      if (this.timerBt) {
        clearTimeout(this.timerBt)
        this.timerBt = 0
      }
      $falcon.off(DEFINE.event.ALGM_RECOG_SHOW, this.updateTips)
    },
    async updateBLeft() {
      this.timerBt && clearTimeout(this.timerBt)
      this.index = this.index + 1
      let res = await netmanager.getIp()
      this.ip = res[2]
      this.timerBt = setTimeout(() => {
        this.updateBLeft()
      }, 5000)
    },
    updateTips(e) {
      // console.log(JSON.stringify(e))
      this.timerId && clearTimeout(this.timerId)
      if (e.data.uuid === "__hide") {
        this.tipStatus = 0
        this.primaryTips = "Welcome"
        conf.cfgGet(DEFINE.configUi.doorId).then((res) => {
          this.secondTips = res
        })
        return
      }
      if (e.data.uuid === DEFINE.default.stranger) {
        this.tipStatus = 2
        this.primaryTips = "陌生人"
      } else if (e.data.uuid === DEFINE.default.stranger + "waitting") {
        this.tipStatus = 0
        this.primaryTips = "识别中"
      } else {
        this.tipStatus = e.data.isSuccess ? 1 : 2
        this.primaryTips = e.data.name
      }
      this.timerId = setTimeout(() => {
        //恢复默认ui
        this.tipStatus = 0
        this.primaryTips = "Welcome"
        conf.cfgGet(DEFINE.configUi.doorId).then((res) => {
          this.secondTips = res
        })
        this.$emit("normal", "")
      }, 3000)
    },
  },
}
</script>
<style lang="less" scoped>
@import "base.less";
.wrapper {
  display: flex;
}
.top_wrapper {
  height: 200px;
  background-color: rgba(9, 53, 201, 0.76);
  flex-direction: row;
}
.bottom_wrapper {
  flex-direction: row;
  background-color: #000000;
}
.bottom_text {
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
}
.bottom_text2 {
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 20px;
}
.btext {
  color: #fff;
  font-size: 14px;
  line-height: 24px;
}
.status-img {
  margin-left: 20px;
  margin-top: 20px;
  width: 160px;
  height: 160px;
}
.status-text {
  flex: 1;
  padding-left: 20px;
}
.primary-text {
  margin-right: 20px;
  margin-top: 20px;
  font-size: 60px;
  color: #fff;
  max-lines: 1;
}
.second-text {
  margin-right: 20px;
  margin-top: 10px;
  font-size: 50px;
  color: #fff;
  max-lines: 1;
}
</style>
