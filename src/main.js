import '@/assets/js/rem'
import setVueAppConfig from '@/utils/vueAppConfig'
import Vant from 'vant'
import VConsole from 'vconsole'
import { createApp } from 'vue'
import App from './App.vue'

import './permission'
/** ****** vant 部分没办法自动导入css 组件CSS start  ********/
// import 'vant/es/toast/style'
// import 'vant/es/dialog/style'
// import 'vant/es/notify/style'
// import 'vant/es/image-preview/style'
import '@/styles/index.less'
import 'vant/lib/index.css'

/** ****** 组件CSS end  ********/
if (process.env.VUE_APP_ENV === 'development') {
  new VConsole()
}
const app = createApp(App)
setVueAppConfig(app)
app.use(Vant)
app.mount('#app')
