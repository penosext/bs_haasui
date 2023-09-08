<template>
  <div class="wrapper">
    <hole class="hole"></hole>
    <TopBar />
    <div class="main_center">
      <div class="pass-button" @click="clickPass" v-if="isShowPassOpen">
        <!-- <text class="pass-button-text">{{ "密码\n开门" }}</text> -->
        <image
          class="pass-img"
          resize="contain"
          :src="require('../../../assets/icon/pass.png')"
        />
      </div>
    </div>
    <simpleTips></simpleTips>
    <BottomBar @normal="userTipsResetNomal" />

    <BashiActive></BashiActive>
    <screenPass ref="screenPass" @result="screenPassResult"></screenPass>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue"
import BottomBar from "@/components/BottomBar.vue"
import BashiActive from "@/components/BashiActive.vue"
import { FlButton } from "falcon-ui"
import screenPass from "../../components/ScreenPass.vue"
import simpleTips from "../../components/SimpleTips.vue"

import { DEFINE } from "../../utils/define"
import { isObject, isString } from "../../utils/util"
import {
  event_show_stranger,
  event_show_stranger_wait,
  event_show_user,
  event_show_idcard,
  event_hide_user,
} from "../../utils/event"

import mqtt from "../cloud/mqtt"
import bashiFace from "../face/face"
import conf from "../conf/conf"
import db_log from "../cloud/db_log"
import db_user from "../cloud/db_user"
import misc from "../misc/misc"
import mpp from "../mpp/mpp"
import card from "../card/card"
import idcard from "../card/idcard"

export default {
  name: "main",
  components: {
    TopBar,
    BottomBar,
    BashiActive,
    screenPass,
    FlButton,
    simpleTips,
  },
  data() {
    return {
      message: "",
      uuid: "", //uuid,识别到用户uuid，如果是陌生人stranger_trackid
      last_deal_ts: 0,
      cardWatting: false, //true则为正在刷卡的校验中，刷卡成功或失败两秒内后状态重置
      cardTimer: 0,
      last_name: "",
      last_face_result: false,
      stranger_count: 0, //陌生人次数，用于防止一进入就提示陌生人
      isShowPassOpen: false,
      idCardReadStash: {}, //身份证的数据暂存
      idCardStep: -1, //当前的人证比对步骤
      idCardStepDefine: {
        STOP: -1,
        FOUND: 0, //读到卡
        ERROR: 1, //读卡报错
        READ: 2, //读到身份证数据
        RESULT: 3, //收到人证比对结果
      },
    }
  },
  created() {
    this.$page.$npage.setSupportBack(false)
    this.$page.on("show", this.onPageShow)
    this.$page.on("hide", this.onPageHide)
    this.isShowPassOpen = DEFINE.device.isSupportTouch
    mpp.touchAutoScreenOff()
  },
  mounted() {
    setTimeout(() => {
      conf.cfgGet(DEFINE.configCloud.manageMode).then((res) => {
        if (res === "mqtt") {
          mqtt.mqttCreate()
        }
      })
    }, 2000)
    bashiFace.setCallback(this.faceCallback)
    setTimeout(() => {
      card.init(DEFINE.device.cardUart, this.cardCallback)
      this.initIdCard()
    }, 2000)
  },
  destroyed() {
    this.$page.off("show", this.onPageShow)
    this.$page.off("hide", this.onPageHide)
  },
  methods: {
    jump() {
      $falcon.navTo("main", { from: "index" })
    },
    clickPass() {
      this.$refs.screenPass.show()
      bashiFace.setEnable(0)
    },
    async faceCallback(msg) {
      console.log(JSON.stringify(msg))
      mpp.touchAutoScreenOff()
      if (
        this.idCardStep === this.idCardStepDefine.READ ||
        this.idCardStep === this.idCardStepDefine.RESULT
      ) {
        this.dealIdFaceCallBack(msg)
        return
      }
      if (msg.uuid.split("_")[0] === DEFINE.default.stranger) {
        //根据uuid判断人员变化，第一次处理需要判断
        // 陌生人提示规则变更为，同一个陌生人，连续三次回调后再提示陌生人
        console.log("stranger")
        //todo 变更，无法判断陌生人trackid，故，每隔几次回调则报陌生人
        if ("stranger" === this.uuid) {
          //同一个陌生人
          if (this.stranger_count < 2) {
            this.stranger_count = this.stranger_count + 1
          } else if (this.stranger_count == 2) {
            this.stranger_count = this.stranger_count + 1
            this.last_deal_ts = misc.getSystemRunTime()
            event_show_stranger()
            console.log("------------------show stranger")
            mpp.playUserDeny()
            this.saveLogAndFace(
              msg,
              "0000-STRANGER",
              "陌生人",
              DEFINE.log.STATE_PER_NO,
              new Date().getTime()
            )
          } else {
            if (misc.getSystemRunTime() - this.last_deal_ts > 2) {
              this.uuid = ""
              this.stranger_count = 0
            }
          }
        } else {
          //第一次进入大概率是陌生人，所以先不做处理，等待后续连续陌生人再处理
          this.stranger_count = 0
          this.uuid = "stranger"
          console.log("------------------show wait")
          event_show_stranger_wait()
        }
      } else {
        // 识别到用户，第一次识别到，创建日志，保存图片，ui显示，后续识别到同一个人只需要每两秒发送给ui显示
        if (msg.uuid === this.uuid) {
          //同一个用户
          if (misc.getSystemRunTime() - this.last_deal_ts > 2) {
            this.last_deal_ts = misc.getSystemRunTime()
            event_show_user(this.last_name, this.last_face_result)
          }
        } else {
          this.uuid = msg.uuid
          this.last_deal_ts = misc.getSystemRunTime()
          let userFound = await db_user.user_lookup(
            this.uuid,
            false,
            false,
            false
          )
          if (userFound) {
            let result = await misc.checkUserPermission(userFound)
            this.last_name = result[2]
            this.last_face_result = result[0]
            event_show_user(this.last_name, this.last_face_result)
            if (result[0]) {
              // 权限正常，语音，开门
              mpp.playUserPass()
              conf.cfgGet(DEFINE.configCommon.actionMode).then((res) => {
                if (res === "local") {
                  misc.openDoor(true)
                }
              })
            } else {
              // 权限异常，语音
              mpp.playUserExpire()
            }
            await this.saveLogAndFace(
              msg,
              userFound.userid,
              userFound.name,
              result[1],
              new Date().getTime()
            )
          } else {
            //没找到这个用户，把这个用户在face模块里删除
            //todo 测试的时候注掉
            // bashiFace.userRemove(this.uuid)
          }
        }
      }
      bashiFace.algmJpgFree(msg.dma_addr)
    },
    async saveLogAndFace(msg, uid, name, state, ts) {
      let savedLog = await db_log.saveAndLookup(uid, name, state, "face", ts)
      if (savedLog) {
        //保存日志完成，检测是否保存图片
        console.log("saved log")
        // console.log(JSON.stringify(savedLog))
        let logMode = await conf.cfgGet(DEFINE.configCommon.logMode)
        if (logMode == "image") {
          let logPath = await conf.cfgGetLogPathAndCheck(ts)
          let rc = await bashiFace.algmJpgSave(
            msg.dma_addr,
            msg.dma_size,
            logPath
          )
          if (rc) {
            //保存完图片就上报日志
            rc = mqtt.event_post(savedLog)
            if (rc) {
              db_log.update(ts, 1)
            }
          }
        } else {
          console.log("log mode none")
          let rc = mqtt.event_post(savedLog)
          if (rc) {
            db_log.update(ts, 1)
          }
        }
      }
    },
    async cardCallback(cardHex) {
      if (this.cardWatting) {
        return
      }
      //播放滴的声音，并且停止人脸
      if (!isString(cardHex) || cardHex === "") {
        this.cardWatting = false
        return
      }
      mpp.playDi()
      this.cardWatting = true
      this.last_deal_ts = misc.getSystemRunTime()
      let cardFound = await db_user.card_lookup(cardHex)
      if (
        isObject(cardFound) &&
        isString(cardFound.userid) &&
        cardFound.userid !== ""
      ) {
        let userFound = await db_user.user_lookup(
          cardFound.userid,
          false,
          false,
          false
        )
        if (userFound) {
          let result = await misc.checkUserPermission(userFound)
          event_show_user(result[2], result[0])
          this.resetCardState()
          if (result[0]) {
            // 权限正常，语音，开门
            mpp.playUserPass()
            conf.cfgGet(DEFINE.configCommon.actionMode).then((res) => {
              if (res === "local") {
                misc.openDoor(true)
              }
            })
          } else {
            // 权限异常，语音
            mpp.playUserExpire()
          }
          await this.saveLogAndFace(
            msg,
            userFound.userid,
            userFound.name,
            result[1],
            new Date().getTime()
          )
        } else {
          //提示失败，两秒后恢复
          event_show_stranger()
          this.resetCardState()
        }
      } else {
        //提示失败，两秒后恢复
        event_show_stranger()
        this.resetCardState()
      }
    },
    resetCardState() {
      this.cardTimer && clearTimeout(this.cardTimer)
      this.cardTimer = setTimeout(() => {
        this.cardWatting = false
      }, 2000)
    },
    // 用户的提示结束，这边清空状态，防止同一用户识别不播报语音提示等
    userTipsResetNomal() {
      this.uuid = ""
      this.stranger_count = 0
    },
    screenPassResult() {
      bashiFace.setEnable(1)
    },
    initIdCard() {
      if (!DEFINE.device.isSupportIdCard) {
        return
      }
      idcard.init(
        DEFINE.device.idCardUart,
        (isFound) => {
          if (isFound) {
            // console.log("+++++++++++++++++++++++++idcard found")
            //读到卡，设置人证模式，3秒未收到身份证数据，则超时
            //提示读到卡
            mpp.playDi()
            event_show_idcard(
              "读取身份证中",
              3000,
              DEFINE.color.COLOR_GRAY_CDC9CA
            )
            event_hide_user()
            this.idCardStep = this.idCardStepDefine.FOUND
            bashiFace.setIdFaceMode()
            if (this.idcardTimer) {
              clearTimeout(this.idcardTimer)
            }
            this.idcardTimer = setTimeout(this.idCardTimeOut, 3000)
          } else {
            //卡离开
            if (this.idCardStep === this.idCardStepDefine.FOUND) {
              this.idCardStep = this.idCardStepDefine.STOP
              bashiFace.setFaceMode()
              if (this.idcardTimer) {
                clearTimeout(this.idcardTimer)
              }
            }
          }
        },
        (res) => {
          console.log(
            "+++++++++++++++++++++++++idcard read:" + JSON.stringify(res)
          )
          //读卡完成，设置人证数据，开始人证比对，5秒未收到人证结果则超时
          event_show_idcard(
            "请正视屏幕进行人证比对",
            5000,
            DEFINE.color.COLOR_BLUE_0080FF
          )
          this.idCardStep = this.idCardStepDefine.READ
          this.idCardReadStash = res
          bashiFace.userAddInIdCard(res.uuid, res.dma_addr, res.dma_size)
          if (this.idcardTimer) {
            clearTimeout(this.idcardTimer)
          }
          this.idcardTimer = setTimeout(this.idCardTimeOut, 5000)
        },
        (code, msg) => {
          console.log("+++++++++++++++++++++++++idcard fail:" + msg)
          //读卡失败，提示重新放卡，两秒未重新放卡则超时重置
          event_show_idcard(
            "读取失败,请重放身份证",
            2000,
            DEFINE.color.COLOR_ORANGE
          )
          this.idCardStep = this.idCardStepDefine.ERROR
          mpp.playPidError()
          if (this.idcardTimer) {
            clearTimeout(this.idcardTimer)
          }
          this.idcardTimer = setTimeout(this.idCardTimeOut, 3000)
        }
      )
    },
    dealIdFaceCallBack(msg) {
      if (this.idCardStep === this.idCardStepDefine.READ) {
        //人证比对模式的结果
        if (msg.uuid.split("_")[0] === DEFINE.default.stranger) {
          if ("stranger" === this.uuid) {
            //同一个陌生人
            if (this.stranger_count < 2) {
              this.stranger_count = this.stranger_count + 1
              bashiFace.algmJpgFree(msg.dma_addr)
              return
            } else if (this.stranger_count == 2) {
              mpp.playPidFaceNotMatch()
              this.stranger_count = this.stranger_count + 1
              this.last_deal_ts = misc.getSystemRunTime()
              // console.log("------------------show stranger")
              event_show_idcard("人证比对失败", 2000, DEFINE.color.COLOR_RED)
            } else {
              if (misc.getSystemRunTime() - this.last_deal_ts > 2) {
                this.uuid = ""
                this.stranger_count = 0
              }
              bashiFace.algmJpgFree(msg.dma_addr)
              return
            }
          } else {
            //第一次进入大概率是陌生人，所以先不做处理，等待后续连续陌生人再处理
            this.stranger_count = 0
            this.uuid = "stranger"
            console.log("------------------show wait")
            bashiFace.algmJpgFree(msg.dma_addr)
            return
          }
        } else {
          this.uuid = msg.uuid
          if (this.uuid === this.idCardReadStash.uuid) {
            mpp.playUserPass()
            event_show_idcard(
              "人证比对成功",
              2000,
              DEFINE.color.COLOR_GREEN_14AA5B
            )
          } else {
            mpp.playPidFaceNotMatch()
            event_show_idcard("人证比对失败", 2000, DEFINE.color.COLOR_RED)
          }
        }

        bashiFace.userClearInIdCard()
        this.idCardStep = this.idCardStepDefine.RESULT
        if (this.idcardTimer) {
          clearTimeout(this.idcardTimer)
        }
        this.idcardTimer = setTimeout(this.idCardTimeOut, 2000)
        bashiFace.algmJpgFree(msg.dma_addr)
        return
      } else if (this.idCardStep === this.idCardStepDefine.RESULT) {
        bashiFace.algmJpgFree(msg.dma_addr)
        return
      }
    },
    idCardTimeOut() {
      switch (this.idCardStep) {
        case this.idCardStepDefine.FOUND:
          //识别到卡后，三秒钟未收到读身份证结果
          this.idCardStep = this.idCardStepDefine.STOP
          this.uuid = ""
          bashiFace.setFaceMode()
          if (this.idcardTimer) {
            clearTimeout(this.idcardTimer)
          }
          break
        case this.idCardStepDefine.ERROR:
          //读卡异常，提示重新放卡，两秒钟未重新放身份证
          this.idCardStep = this.idCardStepDefine.STOP
          this.uuid = ""
          bashiFace.setFaceMode()
          if (this.idcardTimer) {
            clearTimeout(this.idcardTimer)
          }
          break
        case this.idCardStepDefine.READ:
          //读到身份证，五秒钟未收到比对结果
          this.idCardStep = this.idCardStepDefine.STOP
          this.uuid = ""
          bashiFace.userClearInIdCard()
          bashiFace.setFaceMode()
          if (this.idcardTimer) {
            clearTimeout(this.idcardTimer)
          }
          break
        case this.idCardStepDefine.RESULT:
          this.idCardStep = this.idCardStepDefine.STOP
          this.uuid = ""
          bashiFace.setFaceMode()
          if (this.idcardTimer) {
            clearTimeout(this.idcardTimer)
          }
          break
        default:
          this.idCardStep = this.idCardStepDefine.STOP
          this.uuid = ""
          bashiFace.setFaceMode()
          if (this.idcardTimer) {
            clearTimeout(this.idcardTimer)
          }
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import "../../styles/base.less";

.wrapper {
  // background-color: rgba(0, 0, 0, 0);
  // background-color: rgba(255, 255, 255, 255);
}
.hole {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
.main_center {
  flex: 1;
}

.pass-button {
  position: absolute;
  width: 190px;
  height: 190px;
  top: 0;
  left: 0;
  margin-top: 16px;
  margin-left: 8px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(9, 54, 201, 0.7);
}
.pass-button&:active {
  background-color: rgb(0, 39, 167, 0.7);
}
.pass-img {
  width: 170px;
  height: 170px;
}
.pass-button-text {
  font-size: 50px;
  line-height: 80px;
  text-align: center;
  color: #fff;
}
</style>
