// const mode = "test" // 测试时使用
const mode = "default" // 中性参数
// const mode = "default-nocloud" //中性-无默认mqtt模式
const getmqttMode = () => {
  if (mode === "test") {
    return "none"
  } else if (mode === "default-nocloud") {
    return "none"
  } else {
    return "mqtt"
  }
}
//不同厂商的默认mqtt配置
const getmqttServer = () => {
  if (mode === "default") {
  } else {
    //默认bashi的配置
    return {
      host: "broker.emqxio.com",
      port: "1883",
      cid: "",
      user: "",
      pass: "",
      pub: "",
      sub: "",
    }
  }
}
//设备名的显示，定制或者中性
const getDoorName = () => {
  if (mode === "default") {
    return "欢迎使用"
  } else {
    return "欢迎使用"
  }
}
//日志保存与否，未要求则未不保存
const getLogMode = () => {
  if (mode === "default") {
    return "image"
  } else {
    return "none"
  }
}
// 网络模式，测试时静态，其它动态
const getEthMode = () => {
  if (mode === "test") {
    return "static"
  } else if (mode === "default") {
    return "dynamic"
  } else {
    return "dynamic"
  }
}
const DefaultJson = {
  items: [
    //基本配置 baseConfig
    {
      key: "door-id",
      value: getDoorName(),
      class: "baseConfig",
      itemTitle: "设备名字",
      input: "text",
    },
    {
      key: "volume-out",
      value: "100",
      class: "baseConfig",
      input: "range",
      itemTitle: "音量",
      rangStart: 0,
      rangeEnd: 100,
      rangStep: 1,
    },
    {
      key: "turnoff-screen",
      value: "disable",
      class: "baseConfig",
      input: "select",
      itemTitle: "空闲时是否关闭屏幕",
      items: [
        { value: "disable", show: "不关闭" },
        { value: "enable", show: "关闭" },
      ],
    },
    {
      key: "tips-duration",
      value: "5",
      class: "baseConfig",
      itemTitle: "开门时长（秒），-1表示常开，0表示常闭",
      input: "number",
      rangStart: -1,
      rangeEnd: 99999,
      rangStep: 1,
    },
    //识别配置 recogConfig
    {
      key: "show-mode",
      value: "user",
      class: "recogConfig",
      input: "select",
      itemTitle: "识别结果显示",
      items: [
        { value: "user", show: "显示名字" },
        { value: "none", show: "不显示名字" },
      ],
    },
    {
      key: "log-mode",
      value: getLogMode(),
      class: "recogConfig",
      input: "select",
      itemTitle: "是否保存识别照片",
      items: [
        { value: "none", show: "不保存" },
        { value: "image", show: "保存" },
      ],
    },
    {
      key: "voice-mode",
      value: "default",
      class: "recogConfig",
      input: "select",
      itemTitle: "语音设置",
      items: [
        // { value: "disable", show: "禁用" },
        { value: "default", show: "默认" },
        // { value: "user", show: "自定义" },
      ],
    },
    {
      key: "id-mode",
      value: "0",
      class: "recogConfig",
      input: "select",
      itemTitle: "身份证模块",
      items: [{ value: "0", show: "禁用" }],
    },
    {
      key: "vhc-idcard-face",
      value: "0",
      class: "recogConfig",
      input: "select",
      itemTitle: "身份证识别",
      items: [
        { value: "0", show: "禁用" },
        // { value: "1", show: "人证识别" },
        // { value: "2", show: "人证+白名单" },
        // { value: "3", show: "仅记录" },
      ],
    },
    {
      key: "algm-type",
      value: "1",
      class: "recogConfig",
      input: "select",
      itemTitle: "人脸识别",
      items: [
        { value: "0", show: "禁用" },
        { value: "1", show: "启用" },
      ],
    },
    {
      key: "auth-mode",
      value: "single",
      class: "recogConfig",
      input: "select",
      itemTitle: "识别模式",
      items: [
        { value: "single", show: "刷卡或人脸任一通过" },
        // { value: "card", show: "刷卡和人脸同时通过" },
        // { value: "therm", show: "人脸和测温通过" },
      ],
    },
    // {
    //   key: "algm-alive",
    //   value: "enable",
    //   class: "recogConfig",
    //   input: "select",
    //   itemTitle: "活体检测",
    //   items: [
    //     { value: "disable", show: "关闭" },
    //     { value: "enable", show: "开启" },
    //   ],
    // },
    {
      key: "algm-face-size-min",
      value: "80",
      class: "recogConfig",
      itemTitle: "识别距离",
      input: "select",
      items: [
        { value: "80", show: "1.3m" },
        { value: "140", show: "1.1m" },
        { value: "200", show: "0.9m" },
        { value: "260", show: "0.7m" },
        { value: "320", show: "0.5m" },
      ],
    },
    {
      key: "action-mode",
      value: "local",
      class: "recogConfig",
      input: "select",
      itemTitle: "识别开门",
      items: [
        { value: "local", show: "启用" },
        { value: "remote", show: "由平台决定是否开门" },
      ],
    },
    // 网络配置 network
    {
      key: "ether-ipv4-address-mode",
      value: getEthMode(),
      class: "network",
      input: "select",
      itemTitle: "以太网模式",
      items: [
        { value: "dynamic", show: "自动获取ip" },
        { value: "static", show: "使用以下ip" },
      ],
    },
    {
      key: "ether-ipv4-address",
      value: "192.168.20.10",
      class: "network",
      itemTitle: "以太网地址",
      input: "ip",
    },
    {
      key: "ether-ipv4-mask",
      value: "255.255.255.0",
      class: "network",
      itemTitle: "掩码",
      input: "ip",
    },
    {
      key: "ether-ipv4-gw",
      value: "192.168.20.1",
      class: "network",
      itemTitle: "网关",
      input: "ip",
    },
    {
      key: "ether-dns-server",
      value: "223.5.5.5",
      class: "network",
      itemTitle: "dns",
      input: "ip",
    },
    {
      key: "4g-mode",
      value: "disable",
      class: "network",
      input: "select",
      itemTitle: "4G模式",
      items: [
        { value: "disable", show: "不支持" },
        { value: "enable", show: "支持" },
      ],
    },
    {
      key: "wifi-mode",
      value: "ap",
      class: "network",
      input: "select",
      itemTitle: "WIFI模式",
      items: [
        { value: "none", show: "禁用" },
        { value: "ap", show: "发出wifi热点" },
        { value: "sta", show: "连接wifi" },
      ],
    },
    {
      key: "wifiap-ssid",
      value: "walos-wifi-abc",
      class: "network",
      itemTitle: "WiFi热点名",
      input: "text",
    },
    {
      key: "wifiap-passwd",
      value: "1234567890",
      class: "network",
      itemTitle: "WiFi热点密码",
      input: "text",
    },
    {
      key: "wifista-ssid",
      value: "walos-wifi-abc",
      class: "network",
      itemTitle: "设备连接的WiFi名",
      input: "text",
    },
    {
      key: "wifista-passwd",
      value: "12345678",
      class: "network",
      itemTitle: "设备连接的WiFi密码",
      input: "text",
    },
    //平台设置 cloud
    {
      key: "manager-mode",
      value: getmqttMode(),
      class: "cloud",
      input: "select",
      itemTitle: "平台管理模式",
      items: [
        { value: "none", show: "仅提供局域网api服务" },
        { value: "mqtt", show: "通过mqtt接入平台" },
      ],
    },
    {
      key: "manager-qrcode",
      value: "https://www.bashisense.com/d",
      class: "cloud",
      itemTitle: "开门二维码前缀",
      input: "text",
    },
    {
      key: "report-state-server",
      value: "http://192.168.20.1/report",
      class: "cloud",
      itemTitle: "局域网模式下的上报地址",
      input: "text",
    },
    {
      key: "hearbeat-duration",
      value: "20",
      class: "cloud",
      itemTitle: "心跳间隔,三次心跳丢失会断开重连接",
      input: "number",
      rangStart: 1,
      rangeEnd: 999999,
      rangStep: 1,
    },
    {
      key: "mqtt-host",
      value: getmqttServer().host,
      class: "cloud",
      itemTitle: "mqtt 服务器地址",
      input: "text",
    },
    {
      key: "mqtt-port",
      value: getmqttServer().port,
      class: "cloud",
      itemTitle: "mqtt服务器端口",
      input: "number",
      rangStart: 1,
      rangeEnd: 65535,
      rangStep: 1,
    },
    {
      key: "mqtt-client-id",
      value: getmqttServer().cid,
      class: "cloud",
      itemTitle: "mqtt client id,不填则为设备id",
      input: "text",
    },
    {
      key: "mqtt-user",
      value: getmqttServer().user,
      class: "cloud",
      itemTitle: "mqtt user,不填则为设备id",
      input: "text",
    },
    {
      key: "mqtt-pass",
      value: getmqttServer().pass,
      class: "cloud",
      itemTitle: "mqtt pass,不填则为默认",
      input: "text",
    },
    {
      key: "mqtt-pub",
      value: getmqttServer().pub,
      class: "cloud",
      itemTitle: "mqtt pub,以/结尾自动加设备id",
      input: "text",
    },
    {
      key: "mqtt-sub",
      value: getmqttServer().sub,
      class: "cloud",
      itemTitle: "mqtt sub, 以/结尾自动加设备id",
      input: "text",
    },
    //系统维护 system
    {
      key: "timezone",
      value: "-480",
      class: "system",
      input: "select",
      itemTitle: "时区",
      items: [
        { value: "0", show: "零时区" },
        { value: "-60", show: "东一区" },
        { value: "-120", show: "东二区" },
        { value: "-180", show: "东三区" },
        { value: "-240", show: "东四区" },
        { value: "-300", show: "东五区" },
        { value: "-360", show: "东六区" },
        { value: "-420", show: "东七区" },
        { value: "-480", show: "东八区" },
        { value: "-540", show: "东九区" },
        { value: "-600", show: "东十区" },
        { value: "-660", show: "东十一区" },
        { value: "-720", show: "东十二区" },
        { value: "720", show: "西十二区" },
        { value: "660", show: "西十一区" },
        { value: "600", show: "西十区" },
        { value: "540", show: "西九区" },
        { value: "480", show: "西八区" },
        { value: "420", show: "西七区" },
        { value: "360", show: "西六区" },
        { value: "300", show: "西五区" },
        { value: "240", show: "西四区" },
        { value: "180", show: "西三区" },
        { value: "120", show: "西二区" },
        { value: "60", show: "西一区" },
      ],
    },
    {
      key: "reboot-mode",
      value: "none",
      class: "system",
      input: "select",
      itemTitle: "重启模式",
      items: [
        { value: "none", show: "不自动重启" },
        { value: "reboot", show: "每天定时重启" },
      ],
    },
  ],
}
export { DefaultJson }
