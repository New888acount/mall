import { createApp } from 'vue'
import LoginDialog from './index.vue'
import setVueAppConfig from '@/utils/vueAppConfig'
import useLocalCache from '@/hooks/storage/localStorage'

function createLoginDialog(resolve, reject, options) {
  // 创建一个节点，并将组件挂载上去
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  const app = createApp(LoginDialog, {
    ...options,
    show: true,
    callback(res) {
      // 避免重复挂载
      if (window.LoginDialogVisible) {
        window.LoginDialogVisible = false
      }
      app.unmount(mountNode) // 创建完后要进行销毁
      document.body.removeChild(mountNode)
      if (res && res?.access_token) {
        resolve(res)
      } else {
        reject(false)
      }
    },
  })
  setVueAppConfig(app)
  app.mount(mountNode)
  window.LoginDialogVisible = true
}

export default function showLoginDialog(options) {
  return new Promise((resolve, reject) => {
    // 1. 判断是否已登录
    const token = useLocalCache().getCacheToken()
    if (token) {
      // 已登录，不弹窗，直接返回成功
      return resolve({ token })
    }
    // 防止多次挂载
    if (window.LoginDialogVisible) {
      return resolve(true)
    }
    createLoginDialog(resolve, reject, options)
  })
}
