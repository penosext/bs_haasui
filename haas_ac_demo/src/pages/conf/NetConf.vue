//弹出，选择item
<template>
  <scroller
    class="config-scroller"
    scroll-direction="vertical"
    show-scrollbar="false"
    over-scroll="40"
  >
    <div class="type-radio">
      <fl-radio
        :items="netTypes"
        v-model="netTypeChoose"
        @onchange="typeChoose"
      />
    </div>
    <IpInputVue ref="ip" v-model="ipaddress" :value="ipaddress"> </IpInputVue>

    <div v-if="netTypeChoose === 'ether'">
      <div class="item">
        <div class="item-main">
          <text class="item-title">{{ "网络模式" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.ethMode, 0)"
          >
            <text :class="'item-value'">{{
              getShowValue(netData.ethMode)
            }}</text>
          </div>
        </div>
      </div>

      <div class="item" v-if="isNetStaticMode()">
        <div class="item-main">
          <text class="item-title">{{ "IP地址" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.ethIp, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.ethIp.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.ethIp.is_modify
                  ? netData.ethIp.value_m
                  : netData.ethIp.value) || "未填写"
              }}</text
            >
          </div>
        </div>
      </div>

      <div class="item" v-if="isNetStaticMode()">
        <div class="item-main">
          <text class="item-title">{{ "网关地址" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.ethGw, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.ethGw.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.ethGw.is_modify
                  ? netData.ethGw.value_m
                  : netData.ethGw.value) || "未填写"
              }}</text
            >
          </div>
        </div>
      </div>

      <div class="item" v-if="isNetStaticMode()">
        <div class="item-main">
          <text class="item-title">{{ "子网掩码" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.ethMask, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.ethMask.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.ethMask.is_modify
                  ? netData.ethMask.value_m
                  : netData.ethMask.value) || "未填写"
              }}</text
            >
          </div>
        </div>
      </div>

      <div class="item" v-if="isNetStaticMode()">
        <div class="item-main">
          <text class="item-title">{{ "Dns" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.ethDns, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.ethDns.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.ethDns.is_modify
                  ? netData.ethDns.value_m
                  : netData.ethDns.value) || "未填写"
              }}</text
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="netTypeChoose === 'mobile'">
      <div class="item">
        <div class="item-main">
          <text class="item-title">{{ "蜂窝网络是否启用" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.lteMode, 0)"
          >
            <text :class="'item-value'">{{
              getShowValue(netData.lteMode)
            }}</text>
          </div>
        </div>
      </div>
    </div>

    <div v-if="netTypeChoose === 'wifi'">
      <div class="item">
        <div class="item-main">
          <text class="item-title">{{ "WIFI模式" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.wifiMode, 0)"
          >
            <text :class="'item-value'">{{
              getShowValue(netData.wifiMode)
            }}</text>
          </div>
        </div>
      </div>

      <div class="item" v-if="isWifiStaMode()">
        <div class="item-main">
          <text class="item-title">{{ "设备连接的WiFi名称" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.wifiStaSsid, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.wifiStaSsid.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.wifiStaSsid.is_modify
                  ? netData.wifiStaSsid.value_m
                  : netData.wifiStaSsid.value) || "未填写"
              }}</text
            >
          </div>
        </div>
      </div>

      <div class="item" v-if="isWifiStaMode()">
        <div class="item-main">
          <text class="item-title">{{ "设备连接的WiFi密码" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.wifiStapasswd, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.wifiStapasswd.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.wifiStapasswd.is_modify
                  ? netData.wifiStapasswd.value_m
                  : netData.wifiStapasswd.value) || "未填写"
              }}</text
            >
          </div>
        </div>
      </div>

      <div class="item" v-if="isWifiApMode()">
        <div class="item-main">
          <text class="item-title">{{ "设备发出的WiFi热点名" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.wifiApSsid, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.wifiApSsid.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.wifiApSsid.is_modify
                  ? netData.wifiApSsid.value_m
                  : netData.wifiApSsid.value) || "未填写"
              }}</text
            >
          </div>
        </div>
      </div>

      <div class="item" v-if="isWifiApMode()">
        <div class="item-main">
          <text class="item-title">{{ "设备发出的WiFi热点的密码" }}</text>
          <div
            class="item-value-wrap"
            @click="clickListChoose(netData.wifiApPasswd, 0)"
          >
            <text
              :class="
                'item-value' +
                (netData.wifiApPasswd.is_modify ? ' item-value-modify' : '')
              "
              >{{
                (netData.wifiApPasswd.is_modify
                  ? netData.wifiApPasswd.value_m
                  : netData.wifiApPasswd.value) || "未填写"
              }}</text
            >
          </div>
        </div>
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
import { FlRadio, FlButton } from "falcon-ui"
import listChoosePop from "./ListChoosePop.vue"
import inputPop from "./InputPop.vue"
import conf from "./conf"
import { DEFINE } from "../../utils/define"

export default {
  name: "NetConfig",
  components: { FlRadio, FlButton, listChoosePop, inputPop },
  data() {
    return {
      configs: [], //当前页面的配置们
      netTypeChoose: "ether",
      netTypes: [
        { label: "有线网络", value: "ether" },
        { label: "无线网络", value: "wifi" },
        { label: "移动网络", value: "mobile" },
      ],
      netData: {},
      ipaddress: "",
    }
  },

  watch: {},
  methods: {
    show(list) {
      // this.configs = JSON.parse(JSON.stringify(list))
      // console.log(JSON.stringify(list))
      this.netData = {
        ethMode: {},
        ethIp: {},
        ethGw: {},
        ethMask: {},
        ethDns: {},
        wifiMode: {},
        wifiStaSsid: {},
        wifiStapasswd: {},
        wifiApSsid: {},
        wifiApPasswd: {},
        lteMode: {},
      }
      JSON.parse(JSON.stringify(list)).forEach((item) => {
        switch (item.key) {
          case DEFINE.configNet.ethMode:
            this.netData.ethMode = item
            break
          case DEFINE.configNet.ethIp:
            this.netData.ethIp = item
            break
          case DEFINE.configNet.ethMask:
            this.netData.ethMask = item
            break
          case DEFINE.configNet.ethGw:
            this.netData.ethGw = item
            break
          case DEFINE.configNet.ethDns:
            this.netData.ethDns = item
            break
          case DEFINE.configNet.lteMode:
            this.netData.lteMode = item
            break
          case DEFINE.configNet.wifiMode:
            this.netData.wifiMode = item
            break
          case DEFINE.configNet.wifiStaSsid:
            this.netData.wifiStaSsid = item
            break
          case DEFINE.configNet.wifiStapasswd:
            this.netData.wifiStapasswd = item
            break
          case DEFINE.configNet.wifiApSsid:
            this.netData.wifiApSsid = item
            break
          case DEFINE.configNet.wifiApPasswd:
            this.netData.wifiApPasswd = item
            break
        }
      })
      // this.netTypeChoose = "ether"
      // console.log(JSON.stringify(this.netData))
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
    typeChoose(value) {
      this.netTypeChoose = value
    },
    isNetStaticMode() {
      if (this.netData.ethMode) {
        if (this.netData.ethMode.value_m) {
          if (this.netData.ethMode.value_m === "static") {
            return true
          }
        } else {
          if (this.netData.ethMode.value === "static") {
            return true
          }
        }
      }
      return false
    },
    isWifiStaMode() {
      if (this.netData.wifiMode) {
        if (this.netData.wifiMode.value_m) {
          if (this.netData.wifiMode.value_m === "sta") {
            return true
          }
        } else {
          if (this.netData.wifiMode.value === "sta") {
            return true
          }
        }
      }
      return false
    },
    isWifiApMode() {
      if (this.netData.wifiMode) {
        if (this.netData.wifiMode.value_m) {
          if (this.netData.wifiMode.value_m === "ap") {
            return true
          }
        } else {
          if (this.netData.wifiMode.value === "ap") {
            return true
          }
        }
      }
      return false
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
      console.log("listChooseResult:" + value)
      if (item.key === DEFINE.configNet.ethMode) {
        this.netData.ethMode.value_m = value
        this.netData.ethMode.is_modify =
          this.netData.ethMode.value !== this.netData.ethMode.value_m
      } else if (item.key === DEFINE.configNet.wifiMode) {
        this.netData.wifiMode.value_m = value
        this.netData.wifiMode.is_modify =
          this.netData.wifiMode.value !== this.netData.wifiMode.value_m
      } else if (item.key === DEFINE.configNet.lteMode) {
        this.netData.lteMode.value_m = value
        this.netData.lteMode.is_modify =
          this.netData.lteMode.value !== this.netData.lteMode.value_m
      }
      this.$forceUpdate()
    },
    inputResult(value, item, index) {
      console.log("inputResult:" + value)
      if (item.key === DEFINE.configNet.ethIp) {
        this.netData.ethIp.value_m = value
        this.netData.ethIp.is_modify =
          this.netData.ethIp.value !== this.netData.ethIp.value_m
      } else if (item.key === DEFINE.configNet.ethGw) {
        this.netData.ethGw.value_m = value
        this.netData.ethGw.is_modify =
          this.netData.ethGw.value !== this.netData.ethGw.value_m
      } else if (item.key === DEFINE.configNet.ethMask) {
        this.netData.ethMask.value_m = value
        this.netData.ethMask.is_modify =
          this.netData.ethMask.value !== this.netData.ethMask.value_m
      } else if (item.key === DEFINE.configNet.ethDns) {
        this.netData.ethDns.value_m = value
        this.netData.ethDns.is_modify =
          this.netData.ethDns.value !== this.netData.ethDns.value_m
      } else if (item.key === DEFINE.configNet.wifiStaSsid) {
        this.netData.wifiStaSsid.value_m = value
        this.netData.wifiStaSsid.is_modify =
          this.netData.wifiStaSsid.value !== this.netData.wifiStaSsid.value_m
      } else if (item.key === DEFINE.configNet.wifiStapasswd) {
        this.netData.wifiStapasswd.value_m = value
        this.netData.wifiStapasswd.is_modify =
          this.netData.wifiStapasswd.value !==
          this.netData.wifiStapasswd.value_m
      } else if (item.key === DEFINE.configNet.wifiApSsid) {
        this.netData.wifiApSsid.value_m = value
        this.netData.wifiApSsid.is_modify =
          this.netData.wifiApSsid.value !== this.netData.wifiApSsid.value_m
      } else if (item.key === DEFINE.configNet.wifiApPasswd) {
        this.netData.wifiApPasswd.value_m = value
        this.netData.wifiApPasswd.is_modify =
          this.netData.wifiApPasswd.value !== this.netData.wifiApPasswd.value_m
      }
      this.$forceUpdate()
    },
    clickSave() {
      // this.configs.forEach((element) => {
      //   if (element.is_modify) {
      //     console.log(JSON.stringify(element))
      //     conf.cfgSet(element.key, element.value_m)
      //   }
      // })
      if (this.netTypeChoose === "ether") {
        if (this.netData.ethMode.is_modify) {
          conf.cfgSet(this.netData.ethMode.key, this.netData.ethMode.value_m)
        }
        if (this.netData.ethIp.is_modify) {
          conf.cfgSet(this.netData.ethIp.key, this.netData.ethIp.value_m)
        }
        if (this.netData.ethMask.is_modify) {
          conf.cfgSet(this.netData.ethMask.key, this.netData.ethMask.value_m)
        }
        if (this.netData.ethGw.is_modify) {
          conf.cfgSet(this.netData.ethGw.key, this.netData.ethGw.value_m)
        }
        if (this.netData.ethDns.is_modify) {
          conf.cfgSet(this.ethDns.ethMode.key, this.netData.ethDns.value_m)
        }
      } else if (this.netTypeChoose === "wifi") {
        if (this.netData.wifiMode.is_modify) {
          conf.cfgSet(this.netData.wifiMode.key, this.netData.wifiMode.value_m)
        }
        if (
          (this.netData.wifiMode.value_m &&
            this.netData.wifiMode.value_m === "sta") ||
          (!this.netData.wifiMode.value_m &&
            this.netData.wifiMode.value === "sta")
        ) {
          if (this.netData.wifiStaSsid.is_modify) {
            conf.cfgSet(
              this.netData.wifiStaSsid.key,
              this.netData.wifiStaSsid.value_m
            )
          }
          if (this.netData.wifiStapasswd.is_modify) {
            conf.cfgSet(
              this.netData.wifiStapasswd.key,
              this.netData.wifiStapasswd.value_m
            )
          }
        }
        if (
          (this.netData.wifiMode.value_m &&
            this.netData.wifiMode.value_m === "ap") ||
          (!this.netData.wifiMode.value_m &&
            this.netData.wifiMode.value === "ap")
        ) {
          if (this.netData.wifiStaSsid.is_modify) {
            conf.cfgSet(
              this.netData.wifiStaSsid.key,
              this.netData.wifiStaSsid.value_m
            )
          }
          if (this.netData.wifiStapasswd.is_modify) {
            conf.cfgSet(
              this.netData.wifiStapasswd.key,
              this.netData.wifiStapasswd.value_m
            )
          }
        }
      } else if (this.netTypeChoose === "mobile") {
        if (this.netData.lteMode.is_modify) {
          conf.cfgSet(this.netData.lteMode.key, this.netData.lteMode.value_m)
        }
      }

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
.type-radio {
  justify-content: center;
  align-items: center;
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
