import { createPinia, defineStore } from 'pinia'

// 定义一个全局 store
export const useAppStore = defineStore('app', {
  state: () => ({
    preFix: process.env.VUE_APP_ENV === 'development' ? 'https://hellofun789.one' : '',
    device: '', // mobile,desktop 当前系统是移动还是pc
  }),
  actions: {
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
