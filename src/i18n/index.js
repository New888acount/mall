import { createI18n } from 'vue-i18n'
import { Locale } from 'vant'
import useLocalCache from '@/hooks/storage/localStorage'
// ui框架国际化
// 引入英文语言包
import vanEnUS from 'vant/es/locale/lang/en-US'
import vanZhCN from 'vant/es/locale/lang/zh-CN'
// 系统国际化
import enUS from './en-US.json'
import zhCN from './zh-CN.json'
const { setLanguage, getLanguage } = useLocalCache()

const i18n = createI18n({
  warnHtmlMessage: false,
  // 如果本地有语言标识就采用本地，没有就英文
  locale: getLanguage() || process.env.VUE_APP_LANGUAGE,
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
  },
  legacy: false,
})
if ((getLanguage() || process.env.VUE_APP_LANGUAGE_FRAME) === 'zh-CN') {
  Locale.use('zh-CN', vanZhCN)
} else {
  Locale.use('en-US', vanEnUS)
}

// 设置存储国际化，目前只用到了 货币到底是逗号还是分号
setLanguage(getLanguage() || process.env.VUE_APP_LANGUAGE)
export default i18n
