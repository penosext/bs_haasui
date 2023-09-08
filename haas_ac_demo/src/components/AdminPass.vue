//弹出，选择item
<template>
  <fl-dialog
    v-model="isPop"
    title="请验证管理员密码"
    center
    cancelText="取消"
    confirmText="验证"
    :handleConfirmClick="inputConfirm"
  >
    <div class="popup-content" @click="clickTest">
      <input
        placeholder="管理员密码"
        :value="pass"
        class="input"
        cursor-color="black"
        :softInputEnable="true"
        :showCursor="true"
        :autofocus="true"
        @input="input"
      />
    </div>
    <Toast ref="toast" position="middle" />
  </fl-dialog>
</template>
<script>
import { FlPopup, Toast, FlDialog } from "falcon-ui"
import storage from "storage"
import { DEFINE } from "../utils/define"
import { isString } from "../utils/util"

export default {
  name: "adminPass",
  components: { FlPopup, Toast, FlDialog },
  data() {
    return {
      isPop: false,
      pass: "",
    }
  },

  watch: {},
  methods: {
    show() {
      this.pass = ""
      this.isPop = true
      //todo 检查是否短时间内多次失败，多次失败则一段时间内不允许再次输入
    },
    clickTest() {
      console.log("click")
    },
    input(e) {
      this.pass = e.value
    },
    async inputConfirm() {
      console.log("inputConfirm")
      let mpass = await storage.getStorage(DEFINE.default.configPassword)
      console.log("mpass1:" + mpass)
      if (isString(mpass) && mpass != "") {
        console.log("mpass:" + mpass)
        if (mpass === this.pass) {
          this.$emit("result", true)
          this.isPop = false
          return false
        }
      } else {
        console.log("this.pass:" + this.pass)
        if ("bsadmin" === this.pass) {
          this.$emit("result", true)
          this.isPop = false
          return false
        }
      }
      this.$refs.toast.show("密码错误")
      this.$emit("result", false)
      return true
      // this.isPop = false
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

.popup-content {
  position: relative;
  width: 600px;
  height: 200px;
  align-items: center;
  align-self: center;
  background-color: #fff;
}
.input {
  width: 560px;
  height: 160px;
  // font-size: 28px;
  // color: black;
  // border-width: 1px;
  // border-style: solid;
  // border-color: rgba(146, 156, 155, 0.3);
  // border-radius: 6px;
  margin: 20px 20px;
  // margin-top: 10px;
}
</style>
