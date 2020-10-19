import { Message, MessageBox } from 'element-ui'
import Cookies from '@/utils/util.cookie'
import { login, logout, getInfo } from '@/api/user'
import router from '@/router'
import {
  SET_USERINFO,
  SET_TOKEN
} from '@/store/mutation-types'

const state = {
  token: Cookies.get('token'),
  userInfo: ''
}

const mutations = {
  [SET_TOKEN] (state, token) {
    state.token = token
  },
  [SET_USERINFO]: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  login ({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password.trim()
      })
        .then(data => {
          commit('SET_TOKEN', data.token)
          Cookies.set('token', data.token)
          dispatch('getInfo')
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  async logout ({ commit, dispatch }, { confirm = false }) {
    const handleLogout = () => {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(async () => {
            commit(SET_USERINFO, {})
            commit(SET_TOKEN, {})
            Cookies.remove('token')
            await dispatch('db/set', {
              path: 'user',
              value: null
            }, { root: true })
            router.push({
              name: 'login'
            })
          })
          .catch(err => {
            reject(err)
          })
      })
    }

    if (confirm) {
      MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
        type: 'warning'
      })
        .then(async () => {
          await handleLogout()
        })
        .catch(() => {
          Message({
            message: '取消注销操作'
          })
        })
    } else {
      await handleLogout()
    }
  },
  getInfo ({ state, dispatch, commit }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(async (data) => {
          if (!data) {
            reject(new Error('Verification failed, please Login again.'))
          }

          commit('SET_USERINFO', data.userInfo)
          await dispatch(
            'db/set',
            {
              path: 'user',
              value: data.userInfo
            },
            { root: true }
          )
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  load ({ state, commit, dispatch }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const info = await dispatch('db/get', { path: 'user' }, { root: true })
      if (info) {
        commit(SET_USERINFO, info)
        resolve(info)
      }
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
