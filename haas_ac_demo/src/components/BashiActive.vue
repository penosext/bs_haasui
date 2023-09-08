//顶层，中间显示激活二维码用，右上角显示开门二维码用
<template>
  <div class="wrapper">
    <div class="active" v-show="isShowActive">
      <qrcode class="acvtiveqr" :value="activeQr" />
      <text class="active-text">{{ `未激活的设备` }}</text>
    </div>

    <div class="door" v-show="isShowDoorOpen">
      <qrcode class="doorqr" :value="doorQr" />
      <image
        class="wechat"
        resize="contain"
        :src="require('../../assets/icon/wechat.png?base64')"
      />
    </div>
  </div>
</template>
<script>
import conf from "../pages/conf/conf"
import { DEFINE } from "../utils/define"
export default {
  data() {
    return {
      timerId: 0, //定时更新开门二维码的定时器
      isShowActive: false,
      isShowDoorOpen: false,
      activeQr: "",
      doorQr: "",
    }
  },
  created() {
    this.$page.on("show", this.onPageShow)
    this.$page.on("hide", this.onPageHide)
    this.timerId = 0
  },
  async mounted() {
    this.activeQr = "BSDACT:" + (await conf.cfgDeviceId())
  },
  destroyed() {
    this.timerId && clearInterval(this.timerId)
    this.$page.off("show", this.onPageShow)
    this.$page.off("hide", this.onPageHide)
  },
  computed: {
    // hours() {
    //   const hour = String(this.now.getHours())
    //   return hour.padStart(2, "0")
    // },
  },
  watch: {},
  methods: {
    onPageShow() {
      if (!this.timerId && this.isShowDoorOpen) {
        this.showDoorQr()
      }
      $falcon.on(DEFINE.event.ACTIVE_SHOW, this.updateConnect)
      this.resetDoorQr()
    },
    onPageHide() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = 0
      }
      $falcon.off(DEFINE.event.ACTIVE_SHOW, this.updateConnect)
    },
    updateConnect(e) {
      this.isShowActive = e.data.isShow
      if (e.data.client) {
        this.client = e.data.client
      }

      if (!this.isShowActive && this.client) {
        //开始显示开门二维码
        this.isShowDoorOpen = true
        this.showDoorQr()
      } else {
        this.isShowDoorOpen = false
      }
    },
    showDoorQr() {
      this.resetDoorQr()
      this.timerId = setInterval(() => {
        this.resetDoorQr()
      }, 1000 * 10)
    },
    async resetDoorQr() {
      if (this.client) {
        let qr = await conf.cfgGet(DEFINE.configCloud.manageQr)
        let did = await conf.cfgDeviceId()
        let ts = Math.floor(new Date().getTime() / 1000)
        qr = qr + "/" + this.client + "/" + did + "/" + ts + "/XXXXXXXX"
        this.doorQr = qr
        // console.log(this.doorQr)
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import "base.less";
.wrapper {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
.active {
  position: absolute;
  width: 70vw;
  background-color: #fff;
  left: 15vw;
  top: 20vh;
  align-items: center;
  padding: 5vw;
}
.acvtiveqr {
  width: 60vw;
  height: 60vw;
}
.active-text {
  font-size: 40px;
  margin-top: 5vw;
}

.door {
  position: absolute;
  width: 20vw;
  background-color: #fff;
  right: 2vw;
  top: 8vh;
  align-items: center;
  justify-content: center;
}
.doorqr {
  width: 20vw;
  height: 20vw;
}
.wechat {
  position: absolute;
  width: 4vw;
  height: 4vw;
  left: 8vw;
  top: 8vw;
}
</style>
