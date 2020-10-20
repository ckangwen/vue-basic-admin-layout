import Vue from 'vue'
import App from './App'
import router from '@/router'
import { mainRoutes } from '@/router/routes'
import store from './store'
import { AdLayout } from '@ckangwen/components'
import '@ckangwen/components/lib/styles/index.css'
import SvgIcon from '@/components/SvgIcon.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './i18n'
import './permission'
import { __DEV__ } from '@/utils/tools'

Vue.component('svg-icon', SvgIcon)

Vue.use(ElementUI)
Vue.use(AdLayout)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./assets/svg', false, /\.svg$/)
requireAll(req)

__DEV__ && require('./mock')

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  created () {
    this.$store.commit('page/INIT', mainRoutes)
  },
  mounted () {
    this.$store.dispatch('account/load')
    /** 从LocalStorage中加载tab */
    this.$store.dispatch('page/load')
    this.$store.dispatch('theme/load')
  }
}).$mount('#app')
