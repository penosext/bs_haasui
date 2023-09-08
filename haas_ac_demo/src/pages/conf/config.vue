<template>
  <div :class="'wrapper'">
    <div class="tab-list">
      <fl-icon name="back" class="nav-back" @click="onBack" />
      <scroller
        class="tab-scroller"
        scroll-direction="horizontal"
        show-scrollbar="false"
      >
        <text
          v-for="(item, index) in configfGroups"
          @click="tabSelected(index)"
          :class="
            'tab-item' + (index === selectedIndex ? ' tab-item-selected' : '')
          "
          :key="'speed' + index"
          >{{ item }}</text
        >
      </scroller>
    </div>

    <commonConfigList
      v-if="selectedIndex === 0 || selectedIndex === 1 || selectedIndex === 3"
      ref="commonConfigList"
      @saved="configSaved"
    ></commonConfigList>

    <netConfig v-if="selectedIndex === 2" ref="netConfig" @saved="configSaved">
    </netConfig>

    <systemConfigList
      v-if="selectedIndex === 4"
      ref="systemConfigList"
      @saved="configSaved"
    ></systemConfigList>
  </div>
</template>

<script>
import { FlIcon } from "falcon-ui"
import conf from "./conf"
import commonConfigList from "./CommonConfigList.vue"
import netConfig from "./NetConf.vue"
import systemConfigList from "./SystemConfigList.vue"

import { DEFINE } from "../../utils/define"

export default {
  name: "config",
  components: {
    FlIcon,
    commonConfigList,
    netConfig,
    systemConfigList,
  },
  data() {
    return {
      configfGroups: [
        "基本参数",
        "识别参数",
        "网络配置",
        "平台配置",
        "系统维护",
      ],
      selectedIndex: 0,
      configKeys: [
        [
          DEFINE.configUi.doorId,
          DEFINE.configHw.volumnOut,
          DEFINE.configHw.tipsDuration,
          DEFINE.configHw.turnOffScreen,
        ],
        [
          DEFINE.configUi.showMode,
          DEFINE.configCommon.logMode,
          DEFINE.configUi.voiceMode,
          DEFINE.configHw.idMode,
          DEFINE.configAlgm.algmType,
          DEFINE.configAlgm.algmAlive,
          DEFINE.configCommon.authMode,
          DEFINE.configAlgm.algmFaceMin,
          DEFINE.configCommon.actionMode,
        ],
        [
          DEFINE.configNet.ethMode,
          DEFINE.configNet.ethIp,
          DEFINE.configNet.ethMask,
          DEFINE.configNet.ethGw,
          DEFINE.configNet.ethDns,
          DEFINE.configNet.lteMode,
          DEFINE.configNet.wifiMode,
          DEFINE.configNet.wifiStaSsid,
          DEFINE.configNet.wifiStapasswd,
          DEFINE.configNet.wifiApSsid,
          DEFINE.configNet.wifiApPasswd,
        ],
        [
          DEFINE.configCloud.manageMode,
          DEFINE.configCloud.reportServer,
          DEFINE.configCloud.manageQr,
          DEFINE.configCloud.heartBeatDuration,
          DEFINE.configCloud.mqttHost,
          DEFINE.configCloud.mqttPort,
          DEFINE.configCloud.mqttClientId,
          DEFINE.configCloud.mqttUser,
          DEFINE.configCloud.mqttPasswd,
          DEFINE.configCloud.mqttTopicPub,
          DEFINE.configCloud.mqttTopicSub,
        ],
        [DEFINE.configCommon.timeZone, DEFINE.configCommon.rebootMode],
      ],
    }
  },
  mounted() {
    this.tabSelected(this.selectedIndex)
  },
  methods: {
    tabSelected(index) {
      this.selectedIndex = index
      conf.cfgAllItems().then((res) => {
        const configs = res.items.filter((ele) => {
          if (this.configKeys[index].indexOf(ele.key) >= 0) {
            return true
          }
          return false
        })
        this.$nextTick(() => {
          if (index === 2) {
            this.$refs.netConfig.show(configs)
          } else if (index === 4) {
            this.$refs.systemConfigList.show(configs)
          } else {
            this.$refs.commonConfigList.show(configs)
          }
        })
      })
    },
    tabChanged(e) {
      this.tabSelected(e.index)
    },
    onBack() {
      this.$page.finish()
    },
    configSaved() {
      //判断是什么类型，执行apply操作
      this.tabSelected(this.selectedIndex)
      if (this.selectedIndex == 1) {
        // conf.cfgAlgmApply()
      } else if (this.selectedIndex == 2) {
        conf.cfgNetworkApply()
      } else {
        conf.cfgWosApply()
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import "../../styles/base.less";
.wrapper {
  background-color: rgba(255, 255, 255, 255);
}
.tab-list {
  flex-direction: row;
  margin: 20px 40px 20px 0;
}
.nav-back {
  line-height: 48px;
  margin-right: 20px;
  font-size: 40px;
  padding-left: 20px;
}

.tab-scroller {
  // width: 100%;
  flex: 1;
  height: 60px;
}

.tab-item {
  font-size: 28px;
  color: @text-color-default;
  opacity: 0.3;
  line-height: 60px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
}
.tab-item-selected {
  opacity: 1;
  font-size: 32px;
  padding-left: 30px;
  padding-right: 30px;
}
</style>
