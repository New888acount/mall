import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
// 用户信息
import useUserInfoStore from '@/store/modules/userInfo'
// 登录框
import ShowLogin from '@/componentsFun/login/index.js'

// 全局进度条的配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 1000, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
})
// 获取appDOM
const app = document.getElementById('app')

// 路由导航钩子
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserInfoStore()
  let isLogin = userStore.token

  if (isLogin) {
    if (!userStore.userInfo?.id) {
      try {
        // await userStore.getCustomInfo()
      } catch (error) {
        console.log(error)
      }
    }
    next()
  } else {
    if (to.meta.requiresAuth) {
      try {
        await ShowLogin()
        next()
        NProgress.done()
      } catch (error) {
        next('/home')
        NProgress.done()
      }
    } else {
      next()
    }
  }
})

// 进入页面
router.afterEach((to) => {
  NProgress.done()
  // 滚动条滚到顶部
  app.scrollTo({ top: 0 })
  // 进入页面加载了吧全局loading撤销掉
  // document.querySelector('.skeleton-screen-main').style.display = 'none'
  // 改变HTML页面颜色
  // console.log(useAppStore().device)
  // if (useAppStore().device) {
  //     document.getElementsByTagName('html')[0].className = to.meta.bgColor[useAppStore().device]
  //   } else {
  //     document.getElementsByTagName('html')[0].className = 'html-bg-default'
  //   }
  // if (process.env.VUE_APP_TITLE) {
  //   document.title = process.env.VUE_APP_TITLE
  // } else {
  //   document.title = useCopyWriter().appInfo?.configData?.name
  // }
})
