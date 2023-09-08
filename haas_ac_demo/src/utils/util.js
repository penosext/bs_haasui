

export function isIP(ip) {
  var re =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return re.test(ip)
}

export function isPhone(phone) {
  var re = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  return re.test(phone)
}

export function isHexWithout0x(hex) {
  var re = /^[A-Fa-f0-9]+$/
  return re.test(hex)
}

export function isAllF(hex) {
  var re = /^[fF]+$/
  return re.test(hex)
}

export function isIdCard(data) {
  let re = /^(\d{15}$)|(^\d{17}([0-9]|[xX]))$/
  return re.test(data)
}

export function hasChinese(str) {
  // let re = /.*[/u4e00-/u9fa5]+.*$/
  let patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
  if (!patrn.exec(str)) {
    return false
  } else {
    return true
  }
}

export const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : "0" + n
}

export const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  )
}

export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join("-")
}

export const isObject = (data) => {
  return (
    data !== undefined &&
    Object.prototype.toString.call(data) === "[object Object]"
  )
}

export const isNumber = (data) => {
  return (
    data !== undefined &&
    Object.prototype.toString.call(data) === "[object Number]"
  )
}

export const isString = (data) => {
  return (
    data !== undefined &&
    Object.prototype.toString.call(data) === "[object String]"
  )
}

export const isFunction = (data) => {
  return (
    data !== undefined &&
    Object.prototype.toString.call(data) === "[object Function]"
  )
}
export const isAsyncFunction = (data) => {
  return (
    data !== undefined &&
    Object.prototype.toString.call(data) === "[object AsyncFunction]"
  )
}
