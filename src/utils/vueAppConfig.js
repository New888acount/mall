import directive from '@/directive/index'
import router from '@/router/index'
import store from '@/store/index'
// import vLoading from '@/directive/globalLoading'
import vueI18n from '@/i18n/index'
// 登录、注册
import ShowLogin from '@/componentsFun/login/index.js'
/*********ant-design-vue 组件引入star */
import { Button as AButton } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
/*********ant-design-vue 组件引入end */
/*********vant 组件引入star */
import { Lazyload } from 'vant'
/*********vant end */
export default function setVueAppConfig(app) {
  /*********ant-design-vue 组件引入star */
  app.use(AButton)
  /*********ant-design-vue 组件引入end */

  /*********vant 组件引入star */
  // // 懒加载
  app.use(Lazyload, { loading: '1' })
  // app.use(Icon)

  // app.use(Vant)
  /*********vant 组件引入end */
  app.use(router)
  app.use(store)
  app.use(vueI18n)
  directive(app)
  /** ****** 全局配置start全局的东西一定要加$符号  ********/
  // 图片基础路径
  app.config.globalProperties.$imgBaseUrl = '/cmassets'
  app.config.globalProperties.$unit = 'USDT'

  /** ****** 全局配置end  ********/
  /** ****** 函数组件start  ********/

  // 登录
  app.config.globalProperties.$showLogin = ShowLogin

  /** ****** 函数组件end  ********/
}
