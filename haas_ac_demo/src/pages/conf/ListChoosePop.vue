//弹出，选择item
<template>
  <fl-popup v-model="isPop" position="bottom">
    <div class="popup-content" @click="clickTest">
      <slider
        class="scroller"
        :vertical="true"
        :infinite="true"
        :index="selectIndex"
        @change="(e) => (selectIndex = e.index)"
        previousMargin="140px"
        nextMargin="140px"
        :enableAcceleration="true"
      >
        <text
          v-for="(item, index) in list"
          :key="'conf_' + index"
          :class="'item' + (index === selectIndex ? ' item-selected' : '')"
          @click="itemSelected(item)"
          >{{ item.show }}</text
        >
      </slider>
      <!-- <text>popup content</text> -->
    </div>
  </fl-popup>
</template>
<script>
import { FlPopup } from "falcon-ui"

export default {
  name: "listChoosePop",
  components: { FlPopup },
  data() {
    return {
      isPop: false,
      list: [],
      selectIndex: 0,
    }
  },

  watch: {},
  methods: {
    show(item, index) {
      if (item.input !== "select") {
        return
      }
      this.p_item = item
      this.list = item.items
      this.p_index = index

      let selectIndex = 0
      for (let index = 0; index < this.list.length; index++) {
        const element = this.list[index]
        if (item.is_modify) {
          if (element.value === item.value_m) {
            selectIndex = index
          }
        } else {
          if (element.value === item.value) {
            selectIndex = index
          }
        }
      }

      this.selectIndex = selectIndex
      this.isPop = true
      console.log(JSON.stringify(this.list))
    },
    clickTest() {
      console.log("click")
    },
    itemSelected(item) {
      this.$emit("result", item.value, this.p_item, this.p_index)
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
.scroller {
  width: 800px;
  height: 400px;
}
.popup-content {
  position: relative;
  width: 800px;
  height: 400px;
  align-items: center;
  align-self: center;
  background-color: #fff;
}
.item {
  width: 800px;
  height: 60px;
  line-height: 60px;
  padding: 10px 20px;
  text-align: center;
  font-size: 28px;
  color: #000;
  opacity: 0.4;
}
.item-selected {
  opacity: 1;
  font-size: 32px;
}
</style>
