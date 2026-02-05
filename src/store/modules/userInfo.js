import { defineStore } from 'pinia'
// 加密
// 指纹绑定
import { loginApi, profileApi, registerApi } from '@/api/user'
import useLocalCache from '@/hooks/storage/localStorage'
import { useCartStore } from '@/store/modules/cart'

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
    walletTypesList: [
      {
        country: null,
        id: '6966196d4a9e336613d8d9aa',
        sort: 2,
        networks: ['ERC20', 'TRC20', 'BEP20'],
        key: 'ImToken',
        name: 'ImToken',
        icon: 'https://funtest.one/static/kwai/20260116/940528de3e8645fe8361e64a30ef6a41.jpg',
        status: '0',
      },
      {
        country: null,
        id: '696619884a9e336613d8d9ab',
        sort: 3,
        networks: ['TRC20'],
        key: 'TronLink',
        name: 'Tron Link',
        icon: 'https://funtest.one/static/kwai/20260203/dbfb704b3917481a8a28eaa5884c9634.png',
        status: '0',
      },
      {
        country: null,
        id: '696856cbb7546a3ca4a07cfe',
        sort: 5,
        networks: ['ERC20', 'TRC20', 'BEP20'],
        key: 'TokenPocket',
        name: 'Token Pocket',
        icon: 'https://funtest.one/static/kwai/20260116/d3dc8fb5c1da43fa8c7a3b1f52912758.webp',
        status: '0',
      },
      {
        country: null,
        id: '6981650ed27b470276c21e54',
        sort: 6,
        networks: ['TRC20', 'ERC20', 'BEP20'],
        key: 'OkxWallet',
        name: 'OKX',
        icon: 'https://funtest.one/static/kwai/20260203/36c6e313896449d8866cf99640c162bd.png',
        status: '0',
      },
    ],
  }),
  actions: {
    //注册接口
    async registerApiFun(params) {
      try {
        const result = await registerApi({
          ...params,
        })

        await this.getCommonDetails(result)

        return Promise.resolve(result)
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
        return Promise.resolve(result)
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    },

    async getCommonDetails(result) {
      this.token = result.data.token
      setCacheToken(result.data.token)

      // 调用用户信息
      await this.getCustomInfo()
      useCartStore().getList()
      //埋点
      if (!getIsRegister()) {
        await homeVisitApi()
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
