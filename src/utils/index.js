import dayjs from 'dayjs'
import currency from 'currency.js'
import JSEncrypt from 'jsencrypt'
import { showToast } from 'vant'
import copy from 'copy-to-clipboard'
import vueI18n from '@/i18n/index'
const { t } = vueI18n.global
// 动态获取页面z-index 层级，可以更好控制弹框，已经自动加1
export const getMaxZIndex = () => {
  const arr = [...document.all].map((e) => +window.getComputedStyle(e).zIndex || 0)
  return arr.length ? Math.max(...arr) + 1 : 0
}

// 格式化库存
export const formatStock =(type, num) => {
  num = num + '';
  if (type === 'exact') {
    return '库存' + num;
  } else {
    if (num < 10) {
      return '库存≤10';
    } else {
      let a = Math.pow(10, num.length - 1);
      return '库存 ' + parseInt(num / a) * a + '+';
    }
  }
}

// 生成n位随机数
export const random = (n) => {
  if (n > 21) return null
  return parseInt((Math.random() + 1) * Math.pow(10, n - 1))
}

// 对称加密
export const getEncryptPwd = (password) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(process.env.VUE_APP_PUBLIC_KEY)
  return encrypt.encrypt(password)
}

/**
precision指代精确到小数点哪一位，可选0，1，2…
symbol则是数字前的符号，一般配置货币符号
decimal选项是配置小数点那一位的符号（替换小数点）
separator指代分隔符，按照三位数一个分隔符来格式化
 */
export const moneyFormat = (num, precision = 2, separator = ',') => {
  let decimal = '.'
  // 如果是葡萄牙语，逗号换成点，点换成逗号
  // if (useLocalCache().getCurrentCurrencyFormat() === 'comma' && !separator) {
  //   decimal = ','
  //   separator = '.'
  // }

  return currency(num, { symbol: '', decimal, separator, precision }).format()
}

/**
peopleFormat  人数格式化  基于moneyFormat
 */
export const peopleFormat = (num) => {
  let separator = ','
  return moneyFormat(num, 0, separator)
}

/**
 * 格式化时间
 * @param {*} str - 时间格式字符串
 * @param type - 'DD/MM/YYYY HH:mm:ss' or other configurations
 * @returns
 */
export const formatDateTimer = (str, type = 'YYYY-MM-DD') => {
  return dayjs(str).format(type)
}

/**
 * 格式化金额 转化为k
 * @param {*} number - 金额
 * @returns
 */
export const handleMoney = (value) => {
  const realLen = value.toString()?.split('.')[0] //去除小数点后面的数据
  if (realLen.toString().length > 6) {
    return moneyFormat(Number.parseFloat(value / 1000000).toFixed(2)) + 'M'
  } else if (realLen.toString().length > 3) {
    return moneyFormat(Number.parseFloat(value / 1000).toFixed(2)) + 'K'
  } else {
    return moneyFormat(value)
  }
}

// 判断是否是ios
export const isIOS = () => window.navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)

// 跳转外链
export const myWindowOpen = (url) => {
  if (!url.includes('http')) {
    url = `http://${url}`
  }
  if (window.AndroidEM && window.AndroidEM.openURL) {
    window.AndroidEM.openURL(url)
    return
  }
  window.open(url, isIOS() ? '_self' : '_blank')
}

export const isPhone = function (string) {
  const reg = /^[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/

  return reg.test(string)
}
export function myFixed(num, decimal = 2) {
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return Number(parseFloat(num).toFixed(decimal))
}

// 复制
export const copyText = (text) => {
  // 复制
  copy(text)
  // customToast(t('other.copySuccessTip'))
  customToast('复制成功')
}

export const customToast = (text) => {
  showToast({
    message: text,
    duration: 2000,
    zIndex: getMaxZIndex() + 1000,
    className: 'my-toast'
  })
}

/**
 * 提取字符串替换为符号
 * @param { string } str - 要提取的字符串
 * @param { number } start - 符串提取的起始位置
 * @param { number } end - 符串提取的结束位置
 * @param { string } mark - 提取的字符串要替换成什么符号
 */
export const replaceMark = (str, start, end, mark = '*') => {
  const value = str.substring(start, end)
  const markStr = new Array(value.length).fill(mark).join('')
  str = str.replace(value, markStr)
  return str
}

// 截取两位小数
export const clip = (n) => (Math.floor(n * 100) / 100).toFixed(2)

// 将Base64数据转换为Blob对象
export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

// 百分数格式化
export const percentFormat = (num) => {
  // 定义巴西地区的格式化选项
  // let formatter = new Intl.NumberFormat('pt-BR', {
  //   style: 'percent',
  //   minimumFractionDigits: 0, // 最小的小数位数
  //   maximumFractionDigits: 2, // 最大的小数位数
  // })
  // if (useLocalCache().getCurrentCurrencyFormat() === 'comma') {
  //   return formatter.format(num / 100)
  // } else {
    return num + '%'
  // }
}

// 获取通道
export const getChannerl = () => {
  let channel = location.host
  if (channel.indexOf('www.') !== -1) {
    channel = channel.replace('www.', '')
  }
  return channel
}

export const getQueryString = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substring(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

export const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

//处理cpf格式 000.000.006-00

export const handleCPF = (val) => {
  // 转换为CPF格式
  let cpf = val.replace(/(\.)/g, '')
  cpf = cpf.replace(/-/g, '')
  let formattedCPF = cpf.slice(0, 3)
  if (cpf.length > 3) {
    formattedCPF += '.' + cpf.slice(3, 6)
  }
  if (cpf.length > 6) {
    formattedCPF += '.' + cpf.slice(6, 9)
  }
  if (cpf.length > 9) {
    formattedCPF += '-' + cpf.slice(9, cpf.length)
  }
  return formattedCPF
}
