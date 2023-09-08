//弹出，选择item
<template>
  <scroller
    class="config-scroller"
    scroll-direction="vertical"
    show-scrollbar="false"
    over-scroll="40"
  >
    <div v-for="(item, index) in configs" :key="'conf_' + index" class="item">
      <div class="item-main">
        <text class="item-title">{{ item.itemTitle }}</text>
        <div class="item-value-wrap" @click="clickListChoose(item, index)">
          <text
            v-if="item.input === 'select'"
            :class="'item-value' + (item.is_modify ? ' item-value-modify' : '')"
            >{{ getShowValue(item) }}</text
          >
          <text
            v-else-if="item.input === 'range'"
            :class="'item-value' + (item.is_modify ? ' item-value-modify' : '')"
            >{{
              (item.is_modify ? item.value_m : item.value) || "未填写"
            }}</text
          >
          <text
            v-else-if="item.input === 'number'"
            :class="'item-value' + (item.is_modify ? ' item-value-modify' : '')"
            >{{
              (item.is_modify ? item.value_m : item.value) || "未填写"
            }}</text
          >
          <text
            v-else-if="item.input === 'text'"
            :class="'item-value' + (item.is_modify ? ' item-value-modify' : '')"
            >{{
              (item.is_modify ? item.value_m : item.value) || "未填写"
            }}</text
          >
          <text
            v-else-if="item.input === 'ip'"
            :class="'item-value' + (item.is_modify ? ' item-value-modify' : '')"
            >{{
              (item.is_modify ? item.value_m : item.value) || "未填写"
            }}</text
          >
        </div>
      </div>

      <text v-if="item.input === 'select'"></text>
      <div v-else-if="item.input === 'range'" class="rang-wrap">
        <!-- <text>{{ item.value }}</text> -->
        <div style="flex: 1"></div>
        <fl-seekbar
          :value="
            item.is_modify ? parseInt(item.value_m) : parseInt(item.value)
          "
          :min="item.rangStart"
          :max="item.rangeEnd"
          :step="item.rangStep"
          @change="onRangeChange($event, item, index)"
        />
        <fl-button
          class="icon-button"
          @click="clickRemove(item, index)"
          icon="remove-outline"
        >
        </fl-button>
        <fl-button
          class="icon-button"
          @click="clickAdd(item, index)"
          icon="circle-plus-outline"
        >
        </fl-button>
      </div>
      <div v-else-if="item.input === 'number'" class="rang-wrap">
        <div style="flex: 1"></div>
        <fl-seekbar
          :value="
            item.is_modify ? parseInt(item.value_m) : parseInt(item.value)
          "
          :min="item.rangStart"
          :max="item.rangeEnd"
          :step="item.rangStep"
          @change="onRangeChange($event, item, index)"
        />
        <fl-button
          class="icon-button"
          @click="clickRemove(item, index)"
          icon="remove-outline"
        >
        </fl-button>
        <fl-button
          class="icon-button"
          @click="clickAdd(item, index)"
          icon="circle-plus-outline"
        >
        </fl-button>
      </div>
    </div>

    <div class="save-wrap">
      <fl-button type="primary" @click="clickSave()"> 保存 </fl-button>
    </div>
    <listChoosePop ref="listChoosePop" @result="listChooseResult" />
    <inputPop ref="inputPop" @result="inputResult"></inputPop>
  </scroller>
</template>
<script>
import { FlSeekbar, FlButton } from "falcon-ui"
import listChoosePop from "./ListChoosePop.vue"
import inputPop from "./InputPop.vue"
import conf from "./conf"

export default {
  name: "commonConfigList",
  components: { FlSeekbar, FlButton, listChoosePop, inputPop },
  data() {
    return {
      configs: [], //当前页面的配置们
      rangeTimer: null,
    }
  },

  watch: {},
  methods: {
    show(list) {
      this.configs = JSON.parse(JSON.stringify(list))
      this.$forceUpdate()
    },
    getShowValue(item) {
      if (item && Array.isArray(item.items)) {
        let valueShow = item.items.find((element) => {
          if (item.is_modify) {
            if (element.value === item.value_m) {
              return true
            }
          } else {
            if (element.value === item.value) {
              return true
            }
          }
        })
        return valueShow.show
      } else {
        return ""
      }
    },
    onRangeChange(value, item, index) {
      if (this.rangeTimer != null) {
        clearTimeout(this.rangeTimer)
      }
      this.rangeTimer = setTimeout(() => {
        this.configs[index].value_m = value + ""
        this.configs[index].is_modify =
          this.configs[index].value !== this.configs[index].value_m
        this.$forceUpdate()
      }, 500)
    },
    clickAdd(item, index) {
      console.log(JSON.stringify(item))
      let value = item.is_modify ? parseInt(item.value_m) : parseInt(item.value)
      console.log(value)
      if (value >= item.rangeEnd) {
        console.log("return")
        return
      } else {
        this.configs[index].value_m = value + item.rangStep + ""
        this.configs[index].is_modify =
          this.configs[index].value !== this.configs[index].value_m

        this.$forceUpdate()
      }
    },
    clickRemove(item, index) {
      let value = item.is_modify ? parseInt(item.value_m) : parseInt(item.value)
      if (value <= item.rangStart) {
        return
      } else {
        this.configs[index].value_m = value - item.rangStep + ""
        this.configs[index].is_modify =
          this.configs[index].value !== this.configs[index].value_m
        this.$forceUpdate()
      }
    },
    clickListChoose(item, index) {
      if (item.input === "select") {
        this.$refs.listChoosePop.show(item, index)
      } else if (item.input === "text" || item.input === "ip") {
        //输入文本
        this.$refs.inputPop.show(item, index)
      }
    },
    listChooseResult(value, item, index) {
      console.log(value)
      this.configs[index].value_m = value
      this.configs[index].is_modify =
        this.configs[index].value !== this.configs[index].value_m
      this.$forceUpdate()
    },
    inputResult(value, item, index) {
      console.log(value)
      this.configs[index].value_m = value
      this.configs[index].is_modify =
        this.configs[index].value !== this.configs[index].value_m
      this.$forceUpdate()
    },
    clickSave() {
      this.configs.forEach((element) => {
        if (element.is_modify) {
          console.log(JSON.stringify(element))
          conf.cfgSet(element.key, element.value_m)
        }
      })
      this.$emit("saved")
    },
  },
}
</script>
<style lang="less" scoped>
@import "base.less";
.config-scroller {
  flex: 1;
}
.item {
  margin: 10px 20px;
  border-width: 3px;
  border-style: solid;
  border-color: rgba(146, 156, 155, 0.3);
  border-radius: 6px;
  padding: 10px 10px;
}
.item-main {
  flex-direction: row;
  align-items: center;
}
.item-title {
  font-size: 32px;
  flex: 1;
  // background-color: aqua;
}
.item-value-wrap {
  flex: 1;
  flex-direction: row-reverse;
  // background-color: antiquewhite;
}
.item-value {
  font-size: 24px;
  // background-color: aquamarine;
  align-items: center;
}
.item-value-modify {
  color: #f0821b;
}
.rang-wrap {
  flex-direction: row;
}
.icon-button {
  margin-left: 20px;
}
.save-wrap {
  margin-top: 80px;
  margin-bottom: 80px;
  padding-left: 80px;
  padding-right: 80px;
}
</style>
