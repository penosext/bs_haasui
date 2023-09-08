//弹出，选择item
<template>
  <fl-popup v-model="isPop" position="bottom">
    <div class="wrapper" @click="clickWrap">
      <div class="title">
        <text class="title-text-center">请验证开门密码</text>
      </div>
      <div class="content-wrapper">
        <div class="pass-wrap">
          <div v-for="(passItem, passIndex) in pass" :key="'pass' + passIndex">
            <text class="pass-text">{{ passItem }}</text>
          </div>
        </div>
        <div class="number-wrap">
          <div
            v-for="(lineItem, lineIndex) in passInputList"
            :key="'conf_' + lineIndex"
          >
            <div class="number-wrap-line">
              <div
                v-for="(colItem, colIndex) in lineItem"
                :key="'conf_' + colIndex"
              >
                <div class="number-text" @click="onClicked(colItem)">
                  <text
                    :class="[
                      colItem === '取消' || colItem === '删除'
                        ? 'number-text-small'
                        : 'number-text-large',
                    ]"
                    >{{ colItem }}</text
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast ref="toast" position="middle" />
  </fl-popup>
</template>
<script>
import { FlButton, Toast, FlPopup } from "falcon-ui"
import db_user from "../pages/cloud/db_user"
import db_log from "../pages/cloud/db_log"
import mpp from "../pages/mpp/mpp"
import misc from "../pages/misc/misc"
import { event_show_user } from "../utils/event"
import conf from "../pages/conf/conf"
import { DEFINE } from "../utils/define"
import mqtt from "../pages/cloud/mqtt"

//进入输入界面，五秒无动作则退出，密码错误则提示错误。成功则开门
export default {
  name: "screenPass",
  components: { FlButton, Toast, FlPopup },
  computed: {},
  data() {
    return {
      isPop: false,
      passInputList: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ["取消", 0, "删除"],
      ],
      pass: ["", "", "", "", "", ""],
      passIndex: 0,
      isCanInput: false,
      exitTimer: 0,
    }
  },

  watch: {},
  methods: {
    show() {
      this.pass = ["", "", "", "", "", ""]
      this.isPop = true
      this.passIndex = 0
      this.isCanInput = true
      this.resetTimer()
    },
    resetTimer() {
      if (this.exitTimer) {
        clearTimeout(this.exitTimer)
      }
      this.exitTimer = setTimeout(() => {
        console.log("超时取消")
        this.isPop = false
      }, 5000)
    },
    clickWrap() {
      console.log("wrap")
    },
    onClicked(item) {
      console.log("click")
      if (!this.isCanInput) {
        return
      }
      this.isCanInput = false
      if (item === "取消") {
        console.log("点击取消")
        this.$emit("result", "cancel")
        this.isPop = false
        this.isCanInput = true
      } else if (item === "删除") {
        this.resetTimer()
        if (this.passIndex > 0) {
          this.pass[this.passIndex - 1] = ""
          this.passIndex -= 1
        }
        this.isCanInput = true
      } else {
        this.resetTimer()
        //正常输入
        if (this.passIndex < 6) {
          this.pass[this.passIndex] = item
          this.passIndex += 1
          if (this.passIndex === 6) {
            //得到密码并校验
            let finalPass = this.pass.reduce((str, cur) => str + cur, "")
            // console.log("--------------: " + finalPass)
            this.confirmPass(finalPass)
            return
          }
        }
        this.isCanInput = true
      }
    },
    async confirmPass(pass) {
      // this.last_deal_ts = misc.getSystemRunTime()
      let userFound = await db_user.user_lookup_bypass(
        pass,
        false,
        false,
        false
      )
      console.log(JSON.stringify(userFound))
      if (userFound) {
        let result = await misc.checkUserPermission(userFound)
        let last_name = result[2]
        event_show_user(last_name)
        if (result[0]) {
          // 权限正常，语音，开门
          mpp.playUserPass()
          conf.cfgGet(DEFINE.configCommon.actionMode).then((res) => {
            if (res === "local") {
              misc.openDoor(true)
            }
          })
          this.$emit("result", "cancel")
          this.isPop = false
        } else {
          // 权限异常，语音
          mpp.playUserExpire()
          this.$refs.toast.show("权限异常")
        }
        await this.saveLog(
          userFound.userid,
          userFound.name,
          result[1],
          new Date().getTime()
        )
        this.pass = ["", "", "", "", "", ""]
        this.passIndex = 0
        this.isCanInput = true
      } else {
        //没找到这个用户，
        this.pass = ["", "", "", "", "", ""]
        this.passIndex = 0
        this.isCanInput = true
        this.$refs.toast.show("密码未匹配")
        this.resetTimer()
      }
    },
    async saveLog(uid, name, state, ts) {
      let savedLog = await db_log.saveAndLookup(
        uid,
        name,
        state,
        "password",
        ts
      )
      if (savedLog) {
        //保存日志完成，检测是否保存图片
        console.log(JSON.stringify(savedLog))
        let rc = mqtt.event_post(savedLog)
        if (rc) {
          db_log.update(ts, 1)
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import "base.less";
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: rgba(9, 54, 201, 0.7);
  // padding-bottom: 60px;
}
.content-wrapper {
  width: 100vw;
  // height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 60px;
}

.pass-wrap {
  width: 600px;
  flex-direction: row;
  margin-bottom: 40px;
  // background-color: aqua;
}
.pass-text {
  color: #fff;
  font-size: 60px;
  width: 80px;
  height: 80px;
  line-height: 70px;
  margin: 10px;
  text-align: center;
  border-width: 4px;
  border-color: #fff;
  border-radius: 6px;
}

.number-wrap {
  width: 600px;
  // background-color: rgb(231, 231, 51);
}
.number-wrap-line {
  width: 600px;
  flex-direction: row;
  // background-color: aquamarine;
}
.number-text {
  width: 190px;
  height: 190px;
  margin: 5px;
  border-width: 8px;
  border-color: #fff;
  border-radius: 6px;
  background-color: #ff6a00;
}
.number-text&:active {
  background-color: #c45202;
  border-color: #c45202;
}

.number-text-large {
  font-size: 100px;
  line-height: 180px;
  text-align: center;
  color: #fff;
}
.number-text-small {
  font-size: 50px;
  line-height: 180px;
  text-align: center;
  color: #fff;
}
.title {
  padding: 10px;
}
.title-text-center {
  text-align: center;
  font-size: 80px;
  color: #fff;
}
</style>
