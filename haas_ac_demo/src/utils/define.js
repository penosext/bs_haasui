const DEFINE = {
  //设备硬件配置
  device: {
    isSupportIdCard: true, //是否支持身份证
    isSupportTouch: false, //是否支持触屏,支持时会显示触屏相关界面
    cardUart: 3, //默认刷卡串口
    cardBaudrate: 115200, //默认刷卡串口波特率
    idCardUart: 2, //默认身份证串口
  },
  //一些杂七杂八的配置，或者默认值
  default: {
    isFirstStart: "is-first-start",
    isMqttNormalActive: "mqtt_normal_active",
    stranger: "stranger",
    //kv存储中的管理员密码，默认就123456
    configPassword: "config_password",
  },
  //平台相关配置的key
  configCloud: {
    //管理模式，none-仅webapi、websock、mqtt
    manageMode: "manager-mode",
    manageServer: "manager-server",
    manageQr: "manager-qrcode",
    reportServer: "report-state-server",
    heartBeatDuration: "hearbeat-duration",
    //mqtt 服务器地址
    mqttHost: "mqtt-host",
    //mqtt 服务端口
    mqttPort: "mqtt-port",
    //如果为空，则使用device id
    mqttClientId: "mqtt-client-id",
    //如果为空，则使用device id
    mqttUser: "mqtt-user",
    //如果为空，则使用device id
    mqttPasswd: "mqtt-pass",
    //发送消息队列，如果为空，则使用 topic/service/,/结尾自动加deviceId
    mqttTopicPub: "mqtt-pub",
    // 订阅的消息队列，如果为空，则使用 topic/device/，/结尾自动加deviceId
    mqttTopicSub: "mqtt-sub",
  },
  // ui和交互相关的配置key
  configUi: {
    // 一般用于展示当前组织名
    orgId: "org-id",
    // 一般用于展示当前的设备名
    doorId: "door-id",
    // 人脸识别设备是否显示用户隐私信息，user-显示、none-不显示
    showMode: "show-mode",
    // 声音提示模式，disable-无语提示、default-默认语音提示、user-用户自定义
    voiceMode: "voice-mode",
    // 语言配置，影响语言和ui，目前仅cn
    langMode: "lang-mode",
  },
  // 硬件控制相关的配置key
  configHw: {
    //声音输入0-100
    volumnIn: "volume-in",
    //声音输出0-100
    volumnOut: "volume-out",
    //指定型号使用，模拟信号输出
    cvbsMode: "cvbs-mode",
    //身份证读卡器类型，0-无、1-ES、2-EST、3-德科
    idMode: "id-mode",
    //none-没有，id-ID卡
    cardMode: "card-mode",
    // 空闲时关闭屏幕,disable、enable
    turnOffScreen: "turnoff-screen",
    // 继电器延时
    tipsDuration: "tips-duration",
    // 报警输入-开门状态 disable、enable
    alarmDoor: "alarm-door",
    // 报警输入-火警状态 disable、enable
    alarmFire: "alarm-fire",
    // 报警输入-防拆状态 disable、enable
    alarmDisassemble: "alarm-disassemble",
    // 报警输入-开门开关 disable、enable
    alarmPush: "alarm-push",
  },
  // 算法相关的配置key
  configAlgm: {
    //阈值，0.42
    algmThrehold: "algm-threshold",
    //活体开关。diable、enable
    algmAlive: "algm-alive",
    // 1 人脸识别
    algmType: "algm-type",
    algmFaceMin: "algm-face-size-min",
    algmFaceMax: "algm-face-size-max",
    algmFaceClear: "algm-face-clear",
    algmFaceZoneX: "algm-face-zone-x",
    algmFaceZoneY: "algm-face-zone-y",
    algmFaceZoneW: "algm-face-zone-w",
    algmFaceZoneH: "algm-face-zone-h",
    algmFaceAngleYaw: "algm-face-angle-yaw",
    algmFaceAngleRoll: "algm-face-angle-roll",
    algmFaceAnglePitch: "algm-face-angle-pitch",
  },
  // 网络相关配置key
  configNet: {
    ethMode: "ether-ipv4-address-mode", //dynamic static
    ethIp: "ether-ipv4-address",
    ethMask: "ether-ipv4-mask",
    ethGw: "ether-ipv4-gw",
    ethDns: "ether-dns-server",
    lteMode: "4g-mode", //4g 模式disable、enable
    wifiMode: "wifi-mode", //wifi模式，none、ap、sta
    wifiApSsid: "wifiap-ssid",
    wifiApPasswd: "wifiap-passwd",
    wifiStaSsid: "wifista-ssid",
    wifiStapasswd: "wifista-passwd",
  },
  //其它配置key
  configCommon: {
    logMode: "log-mode", // 是被是否记录图片
    timeZone: "timezone", // 与0时区相差分钟数，东八区：-480
    rebootMode: "reboot-mode", //重启模式，none、reboot定时重启
    authMode: "auth-mode", //核验模式，single-人脸或刷卡、card-刷卡再人脸、therm-人脸加测温
    actionMode: "action-mode", //识别结果后的动作 local默认、remote、平台决定
    idFaceCompare: "vhc-idcard-face", //人证比对 0关闭，1开启
  },
  // 日志的状态
  log: {
    STATE_UNKOWN: 0,
    STATE_DISABLE: 1, //未使能的状态
    STATE_PER_OUT: 2, //权限过期
    STATE_PER_NO: 3, //无权限
    STATE_SUCCESS: 4, //权限正常
  },
  // task的定义们
  task: {
    TASK_ID_HEALTH: 1001,
    TASK_ID_HEALTH_GREEN: 1002,
    TASK_ID_HEALTH_FAIL: 1003,
    TASK_ID_FACE_CHECK_START: 1004,
    TASK_ID_CARD_REPORT: 1005,
    TASK_QR_REPORT: 1006,
    TASK_ID_HEALTH_COMPARE_FAIL: 1007,
    TASK_REMOTE_OPENDOOR: 2001,
    TASK_REMOTE_OPENDOOR_SUCCESS: 2002,
    TASK_QRCODE_READ: 2003, // 读到二维码，报给cch
    TASK_QRCODE_REPORT: 2004, // cch收到二维码，报给adp，和日志上报的内容一致但是这个扫码记录不存储在数据库里
    TASK_FDR_ENTER: 2005,
    TASK_FDR_ENTER_RESULT: 2006,
    TASK_EVENT_REPORT: 2007, // 日志的上报
    TASK_LAST_CARD_READ: 2009, // 最后一次的读卡数据
    TASK_LAST_CARD_REPLY: 2010, // 最后一次的读卡数据返回
    TASK_IDCARD_READ: 2011, // 读到身份证，报给cch
    TASK_HEALTH_INFO_REPORT: 2012, // 上报健康码
    TASK_HAS_SUB: 2013, // 订阅消息了，或者是已经激活了

    TASK_FACE_REPORT: 100, //人脸识别更新的时间上报
  },
  //事件的定义
  event: {
    LINK_CHANGE: "cloud_link_change",
    ACTIVE_SHOW: "cloud_active_show",
    ALGM_RECOG_SHOW: "algm_recog_show",
    IDCARD_TIPS: "id_card_tips",
  },
  // 传给ui用的
  ui: {
    STATE_INIT: 0, // 初始化
    STATE_DISCON: 1, // 未连接或连接异常
    STATE_CONN: 2, // 连接完成
    STATE_SUBSCRIBE: 5, // 订阅完成
    STATE_ACTION: 6, // 使用中
    STATE_UNKOWN: 7, // //////////-以上是连接状态////////////
    CCH_STATE_IDLE: 1001, // 进入等待界面
    CCH_STATE_CNID_DETECT: 1004, // 身份证检测到
    CCH_STATE_CNID_READ: 1005, // 身份证读到
    CCH_STATE_CNID_ERROR: 1006, // 身份证读失败
    CCH_STATE_TIPS: 1007, // toast提示用
    CCH_STATE_NAT_TIPS: 1008, // nat tips
    CCH_STATE_VAC_TIPS: 1009, // nav tips
    CCH_STATE_THERM_SHOW: 1010, // show therm
    CCH_STATE_FACE_ENTERY: 1011, // face entery
  },
  error: {
    OK: 0,

    NOMEM: 100,
    INVALID: 101,
    DBOPS: 102,
    NOEXIST: 103,
    INVALID_FACE: 104,
    TOKEN: 105,
    OVERLOAD: 106,
    CHECKSUM: 107,
    SNAPSHOT: 108,
    FILEOPS: 109,
    INTERNAL: 110,
    NOTSUPPORT: 111,
    ACTIVED: 112,
    NOTACTIVED: 113,
    NOTREGIST: 114,

    NOMEM_TIPS: "no more memory",
    INVALID_TIPS: "param invalid",
    DBOPS_TIPS: "db operate fail",
    NOEXIST_TIPS: "item not exist",
    INVALID_FACE_TIPS: "face invalid",
    TOKEN_TIPS: "invalid token",
    OVERLOAD_TIPS: "overload",
    CHECKSUM_TIPS: "checksum invalid",
    SNAPSHOT_TIPS: "snapshot",
    FILEOPS_TIPS: "file operate fail",
    INTERNAL_TIPS: "unkown internal fail",
    NOTSUPPORT_TIPS: "not support",
    ACTIVED_TIPS: "actived",
    NOTACTIVED_TIPS: "not actived",
    NOTREGIST_TIPS: "not regist",

    NOTMANAGEABLE: 120,
    NOTMANAGEABLE_TIPS: "device not manageable",

    DEPRECATED: 121,
    DEPRECATED_TIPS: "command deprecated",
  },
  color: {
    COLOR_GRAY: "#808080",
    COLOR_GREEN: "#00ff00",
    COLOR_BLUE: "#0000ff",
    COLOR_BLUE_0080FF: "#0080ff",
    COLOR_RED: "#ff0000",
    COLOR_RED_FF5F57: "#ff5f57",
    COLOR_WHITE: "#ffffff",
    COLOR_YELLOW: "#ffff00",
    COLOR_ORANGE: "#ff8000",
    color_silver: "#c0c0c0",
    color_gray: "#808080",
    color_purple: "#800080",
    color_teal: "#008080",
    COLOR_GREEN_14AA5B: "#14aa5b",
    COLOR_GRAY_CDC9CA: "#cdc9ca",
  },
}

export { DEFINE }
