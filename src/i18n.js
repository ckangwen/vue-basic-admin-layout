import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import ja from '@/locales/ja.json'
import en from '@/locales/en.json'
import zhCN from '@/locales/zh-cn.json'
import zhTW from '@/locales/zh-tw.json'

Vue.use(Vuei18n)

// TODO 使用require.context加载
const messages = {
  ja,
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW
}

Vue.prototype.$lang = Object.keys(messages).map(t => ({
  label: messages[t].label,
  value: t
}))

const locale = window.navigator.language || 'zh-CN'
const i18n = new Vuei18n({
  locale,
  messages
})

export default i18n
