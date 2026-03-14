import { getSupportApi, popupListApi, trackingApi } from '@/api/common'
import { getUnitLangApi } from '@/api/goods'
import { getLanguagesListApi } from '@/api/user'
import useLocalCache from '@/hooks/storage/localStorage'
import { defineStore } from 'pinia'
import useUserInfoStore from './userInfo'

const { getLanguage } = useLocalCache()

// 定义一个全局 store
export const useAppStore = defineStore('app', {
  state: () => ({
    preFix: process.env.VUE_APP_ENV === 'development' ? 'https://hellofun789.one' : '',
    device: '', // mobile,desktop 当前系统是移动还是pc
    language: '' || getLanguage(), //语言
    popList: [], //首页弹窗列表
    unitLangList: [], //规格翻译列表
    languagesList: [], //语言列表
  }),
  actions: {
    // 打开livechat
    openLiveChat() {
      const liveEl = document.querySelector('#chat-widget-minimized').contentWindow
      liveEl.window.document.querySelector('body button').click()
    },
    //获取客服详细信息
    async getServeItem() {
      const { data } = await getSupportApi({})
      return data
    },
    // 初始化屏幕
    initApp() {
      this.screenCheck() // 初始化时先检测一次
      // 实时检测
      window.addEventListener('resize', () => {
        this.screenCheck()
      })
    },
    // 检测屏幕尺寸变化
    screenCheck(callback) {
      const clientWidth = document.documentElement.clientWidth
      this.device = clientWidth <= 650 ? 'mobile' : 'desktop'

      document.documentElement.dataset.device = this.device
      callback && callback(this.device)
    },

    async getPopupList() {
      try {
        if (this.popList.length) return
        const { data } = await popupListApi()
        this.popList = data
      } catch (error) {
        console.log(error)
      }
    },
    //埋点
    async getTracking(params) {
      try {
        await trackingApi({
          ...params,
          memberId: useUserInfoStore().userInfo?.id || '',
        })
      } catch (error) {
        console.log(error)
      }
    },
    //规格翻译列表
    async getUnitLang() {
      try {
        if (this.unitLangList.length) return
        const { data } = await getUnitLangApi()
        this.unitLangList = data
      } catch (error) {
        console.log(error)
      }
    },
    async getLanguagesList() {
      try {
        if (this.languagesList.length) return
        const { data } = await getLanguagesListApi()
        this.languagesList = data.map((item) => {
          item.text = item.name
          item.value = item.code
          return item
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
})

export default useAppStore
