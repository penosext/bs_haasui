<template>
  <text
    class="tips"
    :style="`background-color:${color ? color : 'rgba(9, 53, 201)'};`"
    v-show="tipText"
    :marquee="true"
    >{{ tipText }}</text
  >
</template>
<script>
import { DEFINE } from "../utils/define"
export default {
  data() {
    return {
      timerId: 0,
      tipText: "",
      color: "rgba(9, 53, 201)", //背景色
    }
  },
  created() {
    this.$page.on("show", this.onPageShow)
    this.$page.on("hide", this.onPageHide)
    this.timerId = 0
  },
  async mounted() {},
  destroyed() {
    this.$page.off("show", this.onPageShow)
    this.$page.off("hide", this.onPageHide)
  },

  watch: {},
  methods: {
    onPageShow() {
      $falcon.on(DEFINE.event.IDCARD_TIPS, this.updateTips)
    },
    onPageHide() {
      if (this.timerId) {
        clearTimeout(this.timerId)
        this.timerId = 0
      }
      $falcon.off(DEFINE.event.IDCARD_TIPS, this.updateTips)
    },
    updateTips(e) {
      // console.log(JSON.stringify(e))
      if (e.data.timeout <= 0) {
        if (this.timerId) {
          clearTimeout(this.timerId)
          this.timerId = 0
        }
        this.tipText = ""
        return
      }
      if (e.data.color) {
        this.color = e.data.color
      } else {
        this.color = "rgba(9, 53, 201)"
      }
      this.tipText = e.data.tips
      if (this.timerId) {
        clearTimeout(this.timerId)
      }
      this.timerId = setTimeout(() => {
        this.tipText = ""
      }, e.data.timeout)
    },
  },
}
</script>
<style lang="less" scoped>
@import "base.less";
.tips {
  width: 100vw;
  color: #fff;
  font-size: 60px;
  line-height: 80px;
  text-align: center;
  max-lines: 1;
}
</style>
