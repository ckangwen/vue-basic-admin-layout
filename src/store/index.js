import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import db from './modules/db'
import page from './modules/page'
import theme from './modules/theme'
import permission from './modules/permission'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    account,
    db,
    page,
    theme,
    permission
  }
})
