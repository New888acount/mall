import useLocalCache from '@/hooks/storage/localStorage'
import { Locale } from 'vant'
import { createI18n } from 'vue-i18n'
// ui框架国际化
// 引入英文语言包
import vanEnUS from 'vant/es/locale/lang/en-US'
import vanZhCN from 'vant/es/locale/lang/zh-CN'
// 系统国际化
import en from './en.json'
import zh from './zh.json'
const { setLanguage, getLanguage } = useLocalCache()

const i18n = createI18n({
  warnHtmlMessage: false,
  // 如果本地有语言标识就采用本地，没有就英文
  locale: getLanguage() || process.env.VUE_APP_LANGUAGE,
  messages: {
    en,
    zh,
  },
  legacy: false,
})
if ((getLanguage() || process.env.VUE_APP_LANGUAGE_FRAME) === 'zh') {
  Locale.use('zh', vanZhCN)
} else {
  Locale.use('en', vanEnUS)
}

// 设置存储国际化，目前只用到了 货币到底是逗号还是分号
setLanguage(getLanguage() || process.env.VUE_APP_LANGUAGE)
export default i18n
