import { getSupportApi } from '@/api/common'
import useLocalCache from '@/hooks/storage/localStorage'
import { defineStore } from 'pinia'
const { getLanguage } = useLocalCache()

// 定义一个全局 store
export const useAppStore = defineStore('app', {
  state: () => ({
    preFix: process.env.VUE_APP_ENV === 'development' ? 'https://hellofun789.one' : '',
    device: '', // mobile,desktop 当前系统是移动还是pc
    language: '' || getLanguage(), //语言
    serverList: [
      {
        name: 'LiveChat',
        url: 'LiveChat',
        show: false,
      },
    ],
  }),
  actions: {
    // 设置客服列表
    setServerList(data) {
      this.hasServer = true
      this.serverList = data.sort((a, b) => {
        const nameA = a.name.toUpperCase() // 忽略大小写
        const nameB = b.name.toUpperCase() // 忽略大小写
        if (nameA < nameB) {
          return -1
        }
      })
      //处理客服
      this.handleServe()
    },
    //处理客服列表
    async handleServe() {
      let promises = []
      this.serverList.forEach((item) => {
        const promise = this.getServeItem(item)
        promises.push(promise)
        promise
          .then((response) => {
            // 处理响应
            if (response) {
              response.serveName = response?.name
            }
          })
          .catch((error) => {
            console.error(error)
          })
      })

      const _this = this
      Promise.all(promises)
        .then((res) => {
          // 循环完成后的操作
          _this.serverList.map((item, index) => {
            return Object.assign(item, res[index] || {})
          })
        })
        .catch((error) => {
          console.error(error)
        })
    },
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
  },
})

export default useAppStore
