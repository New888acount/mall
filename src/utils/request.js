import ShowLogin from '@/componentsFun/login/index.js'
import useLocalCache from '@/hooks/storage/localStorage'
import router from '@/router/index.js'
import useAppStore from '@/store/app'
import useUserInfoStore from '@/store/userInfo'
import axios from 'axios'
import { debounce } from 'lodash-es'
import { showLoadingToast } from 'vant'

import messageToast from '@/componentsFun/messageToast'

/**
 * 接口请求基类方法 data 说明
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param loading:true, 是否显示loading 默认 false
 * @param original:true, 是否获取http状态和原始数据 默认 false
 * @param message:false, 是否统一做错误处理  默认 true
 * @param header 请求头 选填
 * @returns {Promise}
 */

// 接口提示信息
function showInfo(res) {
  const info = res.msg || res.message || 'Request failed'
  messageToast({
    props: {
      msg: info,
    },
  })
}

const debounceShowInfo = debounce(showInfo, 1000)

// 基础配置
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 80000,
})
// 请求拦截
service.interceptors.request.use(
  (config) => {
    config.loading = !!config.loading
    config.original = !!config.original
    config.message = !config.message

    // 请求头合并
    const header = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${useLocalCache().getCacheToken()}`,
      'accept-language': useAppStore().language,
      // Country: useLocalCache().getCurrentLanguage()?.split('-')[1],
      // Skin: 'afun', //皮肤区分
    }
    config.headers = Object.assign(header, config.header)
    if (config.loading) {
      showLoadingToast({
        message: 'Loading...',
        duration: 0,
      })
    }
    return config
  },
  (error) => {
    console.error('Request failed', error)
  }
)
// 相应拦截
service.interceptors.response.use(
  async (response) => {
    const res = response.data
    // 判断是否有loading加载
    if (response.config.loading) {
      showLoadingToast.close()
    }
    if (res.code === 401) {
      router.push('/home')
      // 对多个token过期弹窗提示做防抖处理
      debounceShowInfo(res)
      ShowLogin().catch(() => {})
      useUserInfoStore().removeToken()
      return Promise.reject(res)
    }
    // 不同编码运用地方不同
    if (![200, 510, 511, 513, 515, 516, 518].includes(res.code)) {
      // 有message为true才可以全局提示，默认不就是全局提示
      if (response.config.message) {
        debounceShowInfo(res)
      }
      // 判断是否需要获取http状态
      if (response.config.original) {
        return await Promise.reject(response)
      }
      return await Promise.reject(res)
    }
    return await Promise.resolve(res)
  },
  async (error) => {
    debounceShowInfo(error)
    return await Promise.reject(error)
  }
)
export default async function request(config) {
  return await service({ method: 'get', ...config }).then((res) => ({
    ...res,
  }))
}
