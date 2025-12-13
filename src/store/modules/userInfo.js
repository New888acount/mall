import { defineStore } from 'pinia'
// 加密
// 指纹绑定
import { loginApi, profileApi, registerApi } from '@/api/user'
import useLocalCache from '@/hooks/storage/localStorage'

import { homeVisitApi } from '@/api/home'
import { orderCountApi } from '@/api/order'
import i18n from '@/i18n/index'
import resetFun from '@/store/reset.js'

const { setCacheToken, removeCacheToken, getCacheToken, setIsRegister, getIsRegister } = useLocalCache()
// const { handleRecharge } = handleRechargeComposation()
const t = i18n.global.t
// 默认订单、优惠券等其他资产信息
const defaultNumData = {
  coupons_num: '--',
  order_num: {
    aftersale: 0,
    nocomment: 0,
    noget: 0,
    nosend: 0,
    unpaid: 0,
  },
}
// const { t } = useI18n()
const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    token: getCacheToken() || '', // 用户token
    userInfo: {}, // 用户信息
    priseList: [], //领取数组
    numData: defaultNumData, //订单数据
  }),
  actions: {
    //注册接口
    async registerApiFun(params) {
      try {
        const result = await registerApi({
          ...params,
        })

        await this.getCommonDetails(result)

        return Promise.resolve(result.data)
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    },
    // 登录接口
    async loginApiFun(params) {
      try {
        const result = await loginApi({
          ...params,
        })

        await this.getCommonDetails(result)

        // 这里直接返回一个成功的 Promise
        return Promise.resolve(true)
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    },

    async getCommonDetails(result) {
      console.log(result)
      this.token = result.data.token
      setCacheToken(result.data.token)

      // 调用用户信息
      await this.getCustomInfo()

      //是否注册成功用户成功注册后，上报首页访问数量+1并将字段值由False 修改为 True，后续登录或注册判断该字段值是否为False，若为False上报+1，若为True不上报。
      // 注册成功后判断是否需要上报
      if (!getIsRegister()) {
        // 上报首页访问数量 +1
        await homeVisitApi() // 这里写你的埋点上报方法
        // 修改标记为 true
        setIsRegister(true)
      }
    },
    // 用户信息接口
    async getCustomInfo() {
      try {
        const res = await profileApi()
        this.userInfo = res?.data
        await this.getNumData()

        return Promise.resolve(res?.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 更新用户余额

    // 退出登录
    removeToken() {
      this.token = ''
      this.userInfo = {}
      removeCacheToken()
      // // 还原整个store
      resetFun()
    },

    // 获取订单、优惠券等其他资产信息
    async getNumData() {
      try {
        const res = await orderCountApi()
        if (res.code === 200) {
          this.numData = res.data || {}
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})

export default useUserInfoStore
