import component from './index.vue'
import AppMountComponent from '@/utils/appMountComponent.js'
import useLocalCache from '@/hooks/storage/localStorage' // 假设这里能取 token

export default function ShowLogin(options = {}) {
  return new Promise((resolve, reject) => {
    // 1. 判断是否已登录
    const token = useLocalCache().getCacheToken()
    if (token) {
      // 已登录，不弹窗，直接返回成功
      return resolve({ token })
    }
    const finalParams = {
      name: 'login-register',
      component,
      ...options,
      callback(res) {
        // ✅ 销毁组件
        if (finalParams.appInstance) {
          finalParams.appInstance.unmount()
        }
        if (res) {
          resolve(res) // 登录成功
        } else {
          reject(false) // 登录失败或取消
        }
      },
    }
    new AppMountComponent(finalParams)
  })
}
