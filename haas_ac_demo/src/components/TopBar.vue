//主界面顶部栏，左侧显示联网状态，连服务器状态，功能标识图标
//中间显示时间，右侧显示日期或者其它信息
<template>
  <div class="wrapper">
    <div class="status_wrapper">
      <image class="status-icon" :src="ethIcon" />
      <image class="status-icon" :src="netIcon" />
    </div>
    <div class="timer_wrapper" @click="clickForConf">
      <text class="hours">{{ hours }}</text>
      <text class="colon">{{ showColon ? ":" : "" }}</text>
      <text class="minutes">{{ minutes }}</text>
    </div>
    <div class="date_wrapper">
      <text class="date_text">{{ month + "-" + day + " " + week }}</text>
    </div>
    <adminPass ref="adminPass" @result="adminCheckResult"></adminPass>
  </div>
</template>
<script>
import conf from "../pages/conf/conf"
import netmanager from "../pages/netmanager/netmanager"
import { DEFINE } from "../utils/define"
import adminPass from "./AdminPass.vue"

export default {
  components: { adminPass },
  data() {
    const now = new Date()
    return {
      now,
      showColon: true,
      weeks: {
        en: ["Sun.", "Mon.", "Tues.", "Wen.", "Thur.", "Fri.", "Sta."],
        cn: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      },
      timerId: 0, //时间更新的定时器
      timerNet: 0, //网络状态更新的定时器
      netType: "",
      isConnectCloud: false,
      confTimer: 0,
      confIndex: 0,
    }
  },
  created() {
    this.$page.on("show", this.onPageShow)
    this.$page.on("hide", this.onPageHide)
    this.timerId = 0
    this.timerNet = 0
    this.test = 0
  },
  mounted() {
    if (!this.timerId) {
      this.updateTime()
    }
    if (!this.timerNet) {
      this.updateNetStatus()
    }
  },
  destroyed() {
    this.timerId && clearTimeout(this.timerId)
    this.timerNet && clearTimeout(this.timerNet)
    this.$page.off("show", this.onPageShow)
    this.$page.off("hide", this.onPageHide)
  },
  computed: {
    hours() {
      const hour = String(this.now.getHours())
      return hour.padStart(2, "0")
    },
    minutes() {
      const minutes = String(this.now.getMinutes())
      return minutes.padStart(2, "0")
    },
    month() {
      const month = String(this.now.getMonth() + 1)
      return month.padStart(2, "0")
    },
    day() {
      const day = String(this.now.getDate())
      return day.padStart(2, "0")
    },
    week() {
      return this.weeks.en[this.now.getUTCDay()]
    },
    netIcon() {
      return this.isConnectCloud
        ? require("../../assets/icon/mgmt.png?base64")
        : require("../../assets/icon/nomgmt.png?base64")
    },
    ethIcon() {
      switch (this.netType) {
        case "eth":
          return require("../../assets/icon/ether.png?base64")
        case "sta":
          return require("../../assets/icon/sta_hig.png?base64")
        case "lte":
          return require("../../assets/icon/lte.png?base64")
        case "ap":
        default:
          return require("../../assets/icon/ap.png?base64")
      }
    },
  },
  watch: {},
  methods: {
    onPageShow() {
      if (!this.timerId) {
        this.updateTime()
      }
      $falcon.on(DEFINE.event.LINK_CHANGE, this.updateConnect)
    },
    onPageHide() {
      if (this.timerId) {
        clearTimeout(this.timerId)
        this.timerId = 0
      }
      $falcon.off(DEFINE.event.LINK_CHANGE, this.updateConnect)
    },
    updateConnect(e) {
      this.isConnectCloud = e.data.state >= DEFINE.ui.STATE_ACTION
    },
    async updateTime() {
      this.timerId && clearTimeout(this.timerId)
      let tz = await conf.cfgGetInt(DEFINE.configCommon.timeZone)
      //由于获取到本地的时区是0时区，就手动改一下解析时间时的utc time
      this.now = new Date(Date.now() - tz * 60 * 1000)
      // console.log(this.now)
      this.showColon = !this.showColon
      this.timerId = setTimeout(
        () => {
          this.updateTime()
        },
        this.showColon ? 1300 : 700
      )
    },
    async updateNetStatus() {
      this.timerNet && clearTimeout(this.timerNet)
      //获取当前网络状态，并更新图标
      let res = await netmanager.getIp()
      this.netType = res[0]
      this.timerNet = setTimeout(() => {
        this.updateNetStatus()
      }, 8000)
    },
    clickForConf() {
      if (this.confIndex > 3) {
        this.$refs.adminPass.show()
        // $falcon.navTo("config", { from: "main" })
        //显示密码框
        return
      }
      this.confIndex = this.confIndex + 1
      this.confTimer && clearTimeout(this.confTimer)
      this.confTimer = setTimeout(() => {
        this.confIndex = 0
      }, 1000)
    },
    adminCheckResult(result) {
      console.log("adminCheckResult:" + result)
      if (result) {
        $falcon.navTo("config", { from: "main" })
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import "base.less";
.wrapper {
  display: flex;
  flex-direction: row;
  background-color: rgba(151, 151, 151, 0.7);
  // justify-content: "space-between";
}
.timer_wrapper {
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #fff;
  font-size: 38px;
  font-weight: bold;
}
.status_wrapper {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.date_wrapper {
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 5px;
}
.hours {
  font-size: 38px;
  color: #fff;
}
.minutes {
  font-size: 38px;
  color: #fff;
}
.colon {
  width: 20px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.date_text {
  color: #fff;
  font-size: 20px;
}
.status-icon {
  padding-left: 2px;
  width: 32px;
  height: 32px;
}
</style>
