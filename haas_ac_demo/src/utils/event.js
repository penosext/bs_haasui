import { DEFINE } from "./define"

//连接到服务器的状态变更，state=DEFINE.ui.STATE_
export function event_update_link(state) {
  $falcon.trigger(DEFINE.event.LINK_CHANGE, { state })
}
//显示激活提示，true则显示提示和二维码,client表示是什么平台，空值无用
export function event_show_active(isShow, client) {
  $falcon.trigger(DEFINE.event.ACTIVE_SHOW, { isShow: isShow, client: client })
}
//显示陌生人提示
export function event_show_stranger() {
  $falcon.trigger(DEFINE.event.ALGM_RECOG_SHOW, {
    uuid: DEFINE.default.stranger,
  })
}
//显示识别中
export function event_show_stranger_wait() {
  $falcon.trigger(DEFINE.event.ALGM_RECOG_SHOW, {
    uuid: DEFINE.default.stranger + "waitting",
  })
}
//显示识别结果
export function event_show_user(name, isSuccess) {
  $falcon.trigger(DEFINE.event.ALGM_RECOG_SHOW, {
    isSuccess: isSuccess,
    uuid: "",
    name: name,
  })
}

export function event_hide_user() {
  $falcon.trigger(DEFINE.event.ALGM_RECOG_SHOW, {
    uuid: "__hide",
  })
}

//显示身份证结果
export function event_show_idcard(tips, timeout, color) {
  // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX--=>" + tips)
  $falcon.trigger(DEFINE.event.IDCARD_TIPS, {
    tips: tips,
    timeout: timeout,
    color: color,
  })
}
