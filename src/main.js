import { createApp } from 'vue'
import '@/assets/js/rem'
import setVueAppConfig from '@/utils/vueAppConfig'
import App from './App.vue'
import Vant from 'vant'

// import './permission'
/** ****** vant 部分没办法自动导入css 组件CSS start  ********/
// import 'vant/es/toast/style'
// import 'vant/es/dialog/style'
// import 'vant/es/notify/style'
// import 'vant/es/image-preview/style'
import 'vant/lib/index.css'

/** ****** 组件CSS end  ********/

const app = createApp(App)
setVueAppConfig(app)
  app.use(Vant)
import '@/styles/index.less'
app.mount('#app')
