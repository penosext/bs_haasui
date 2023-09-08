//弹出，选择item
<template>
  <fl-popup v-model="isPop" position="center">
    <div class="popup-content" @click="clickTest">
      <textarea
        placeholder="请输入"
        :value="p_item.is_modify ? p_item.value_m : p_item.value"
        class="input"
        cursor-color="black"
        :softInputEnable="true"
        :showCursor="true"
        :autofocus="true"
        @input="input"
        @confirm="inputConfirm"
      />
    </div>
    <Toast ref="toast" position="middle" />
  </fl-popup>
</template>
<script>
import { FlPopup, Toast } from "falcon-ui"
import { isIP } from "@/utils/util"
export default {
  name: "inputPop",
  components: { FlPopup, Toast },
  data() {
    return {
      isPop: false,
      p_item: {},
      inputType: "text",
      isIpMode: false,
    }
  },

  watch: {},
  methods: {
    show(item, index) {
      if (item.input !== "text" && item.input != "ip") {
        return
      }
      this.isIpMode = item.input === "ip"
      this.inputType = item.input
      this.p_item = item
      this.p_index = index
      this.isPop = true
    },
    clickTest() {
      console.log("click")
    },
    inputConfirm(e) {
      const value = e.value
      if (this.inputType == "ip") {
        if (!isIP(value)) {
          this.$refs.toast.show("ip格式错误")
          return
        }
      }
      this.$emit("result", e.value, this.p_item, this.p_index)
      this.isPop = false
      t
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
