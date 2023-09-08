<template>
  <div class="wrapper">
    <image class="init-img" :src="initImg" />
    <text class="tips-text">{{ failedText }}</text>
  </div>
</template>

<script>
import conf from "../conf/conf"
import mqtt from "../cloud/mqtt"
import bashiFace from "../face/face"
import mpp from "../mpp/mpp"
import mGpio from "../gpio/gpio"
import web from "../cloud/web"
import { DEFINE } from "../../utils/define"
import misc from "../misc/misc"
import wdt from "../misc/wdt"

export default {
  name: "index",
  // components: { screenPass },
  data() {
    return {
      initImg: require("../../../assets/img/init.png?base64"),
      failedText: "",
    }
  },
  created() {
    conf
      .cfgInit()
      .then((res) => {
        //初始化其它的
        this.init()
        web.init()
      })
      .catch((err) => {
        //异常
        console.log(err)
        this.failedText = err.msg
      })
  },
  async mounted() {
 
  },
  methods: {
    init() {
      conf
        .cfgHasLicence()
        .then((res) => {
          if (res) {
            //看门狗，指定文件内容为debug时，不启动看门狗，否则启动看门狗并判断是否连续多次重启
            wdt.init()
            // 初始化算法，算法初始化失败的话也无法使用
            return bashiFace.init()
          } else {
            return Promise.reject(new Error("nolicence"))
          }
        })
        .then((res) => {
          mpp.show()
          mGpio.init_gpio(mGpio.GPIO.RELAY, mGpio.DIR.GPIO_OUTPUT)
          conf.cfgGet(DEFINE.configCloud.manageMode).then((res) => {
            if (res === "mqtt") {
              mqtt.mqttInit()
            }
          })
          misc.initLogImgCheck(7)

          //初始化完成之后1200ms跳转主界面
          setTimeout(() => {
            this.jump()
            this.$page.finish()
          }, 1200)
        })
        .catch((err) => {
          this.failedText = err + "\n五秒后重新初始化"
          setTimeout(() => {
            this.init()
          }, 5000)
        })
    },
    jump() {
      $falcon.navTo("main", { from: "index" })
    },
  },
}
</script>

<style lang="less" scoped>
@import "../../styles/base.less";

.wrapper {
  background-color: rgba(0, 0, 0, 0);
}
.init-img {
  width: 800px;
  height: 100vh;
}
.tips-text {
  position: absolute;
  width: 800px;
  height: 100vh;
  font-size: 50px;
  text-align: center;
  color: #ff0000;
}
</style>
