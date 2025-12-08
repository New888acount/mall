// store/index.js
import { createPinia, defineStore } from 'pinia'

// const store = createPinia()

// 定义一个全局 store
export const useAppStore = defineStore('app', {
  state: () => ({
    preFix: process.env.VUE_APP_ENV === 'development'
      ? 'https://hellofun789.one'
      : ''
  })
})

export default useAppStore
