import { defaultTheme } from '@/config/settings'

export default {
  namespaced: true,
  state: {
    activeTheme: defaultTheme
  },
  mutations: {
    updateThemeToDom (state) {
      const body = document.body
      body.className.split(' ').forEach(name => {
        if (/^theme-\w/.test(name)) {
          body.classList.remove(name)
        }
      })
      body.classList.add(`theme-${state.activeTheme}`)
    }
  },
  actions: {
    updateTheme ({ state, commit, dispatch }, themeName) {
      state.activeTheme = themeName
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        commit('updateThemeToDom')

        await dispatch('db/set', {
          path: 'theme',
          value: state.activeTheme
        }, { root: true })

        resolve()
      })
    },
    load ({ state, commit, dispatch }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async resolve => {
        const activeTheme = await dispatch('db/get', {
          path: 'theme'
        }, { root: true })
        state.activeTheme = activeTheme || state.activeTheme
        commit('updateThemeToDom')
        resolve()
      })
    }
  }
}
