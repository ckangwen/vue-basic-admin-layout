import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import db from './modules/db'
import page from './modules/page'
import theme from './modules/theme'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    db,
    page,
    theme
  }
})
