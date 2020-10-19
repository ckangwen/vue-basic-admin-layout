/* eslint-disable no-async-promise-executor */
import { systemSettings } from '@/config/settings.js'
import router from '@/router'
import {
  INIT,
  SET_CURRENT_PAGE,
  SET_OPENED,
  PUSH_KEEPALIVE,
  REMOVE_KEEPALIVE,
  CLEAN_KEEPALIVE
} from '@/store/mutation-types'

export default {
  namespaced: true,
  state: {
    pool: [],
    opened: systemSettings.page.opened,
    // 当前页面
    current: '',
    keepAlive: []
  },
  actions: {
    /**
     * 新增一个tag导航
     */
    add ({ state, commit, dispatch }, { tag, params, query, name }) {
      return new Promise(async (resolve) => {
        // 设置新的tag在新打开一个以前没打开过的页面时使用
        const newTag = tag
        const opened = state.opened || []
        newTag.params = params || newTag.params
        newTag.query = query || newTag.query
        newTag.name = name || newTag.name
        opened.push(newTag)
        // 表示该页面需要进行缓存
        // TODO 缓存条件有待修改
        if (newTag.meta && !newTag.meta.cache) {
          commit(PUSH_KEEPALIVE, newTag.name)
        }

        commit(SET_OPENED, opened)

        await dispatch('db/set', {
          path: 'page.opened',
          value: opened
        }, { root: true })
        resolve()
      })
    },
    // TODO state的opened为""，而不是settings.page.opened ???
    open ({ state, commit, dispatch }, { name, params, query }) {
      return new Promise(async (resolve) => {
        // 已经打开的页面
        const opened = state.opened || []
        // 判断此页面是否已经打开 并且记录位置
        let pageIndex = 0
        const pageOpened = opened.find((t, i) => {
          const same = t.name === name
          pageIndex = same ? i : pageIndex
          return same
        })

        if (pageOpened) {
          // TODO 后续操作
        } else {
          const page = state.pool.find(t => t.name === name)
          if (page) {
            await dispatch('add', {
              tag: Object.assign({}, page),
              params,
              query,
              name
            })
          }
        }

        commit(SET_CURRENT_PAGE, name)
        resolve()
      })
    },
    close ({ state, commit, dispatch }, tabName) {
      return new Promise(async resolve => {
        const opened = state.opened
        let activePage = opened[0]
        const isCurrent = state.current === tabName

        const index = opened.findIndex(t => t.name === tabName)
        // 关闭的是当前页面，则寻找下一个页面或前一个页面
        if (isCurrent) {
          if (index > 0) {
            if (index < opened.length - 1) {
              activePage = opened[index + 1]
            } else {
              activePage = opened[index - 1]
            }
          }
        }

        if (index >= 0) {
          // 清除缓存
          commit(REMOVE_KEEPALIVE, state.opened[index].name)
          // 列表中删除
          state.opened.splice(index, 1)
        }

        await dispatch('db/set', {
          path: 'page.opened',
          value: opened
        }, { root: true })

        const { name = '', query = {}, params = {} } = activePage
        router.push({
          name,
          query,
          params
        })

        resolve()
      })
    },
    // TODO 关闭左侧tab，会出现key重复的问题，在修改opened之后就会发生
    closeLeft ({ state, commit, dispatch }, tabName) {
      return new Promise(async resolve => {
        tabName = tabName || state.current
        const opened = [...state.opened]
        const activeIndex = opened.findIndex(t => t.name === tabName)

        if (activeIndex >= 0) {
          // 删除左侧的标签，就是删除activeIndex之前的标签
          // 首页标签需要保留
          opened.splice(1, activeIndex - 1).forEach(t => {
            commit(REMOVE_KEEPALIVE, t.name)
          })
        }

        commit(SET_OPENED, opened)

        commit(SET_CURRENT_PAGE, tabName)

        if (router.app.$route.name !== tabName) {
          router.push({
            name: tabName
          })
        }

        await dispatch('db/set', {
          path: 'page.opened',
          value: opened
        }, { root: true })
        resolve()
      })
    },
    closeRight ({ state, commit, dispatch }, tabName) {
      return new Promise(async resolve => {
        tabName = tabName || state.current
        const opened = state.opened
        const activeIndex = opened.findIndex(t => t.name === tabName)

        if (activeIndex >= 0) {
          // 删除右侧的标签，就是删除activeIndex之后的标签，不包括当前标签
          opened.splice(activeIndex + 1).forEach(t => {
            commit(REMOVE_KEEPALIVE, t.name)
          })
        }

        if (router.app.$route.name !== tabName) {
          router.push({
            name: tabName
          })
        }

        await dispatch('db/set', {
          path: 'page.opened',
          value: opened
        }, { root: true })

        commit(SET_CURRENT_PAGE, tabName)
        resolve()
      })
    },
    closeOthers ({ state, commit, dispatch }, tabName) {
      return new Promise(async resolve => {
        tabName = tabName || state.current
        const opened = state.opened
        const activeIndex = opened.findIndex(t => t.name === tabName)

        if (activeIndex === 0) {
          opened.splice(1)
        } else {
          // 从下标为1开始，删除到下标为activeIndex结束
          opened.splice(1, activeIndex - 1).forEach(t => {
            commit(REMOVE_KEEPALIVE, t.name)
          })
          opened.splice(activeIndex + 1).forEach(t => {
            commit(REMOVE_KEEPALIVE, t.name)
          })
        }

        if (router.app.$route.name !== tabName) {
          router.push({
            name: tabName
          })
        }

        await dispatch('db/set', {
          path: 'page.opened',
          value: opened
        }, { root: true })

        commit(SET_CURRENT_PAGE, tabName)

        resolve()
      })
    },
    closeAll ({ state, commit, dispatch }) {
      return new Promise(async resolve => {
        const opened = state.opened
        opened.splice(1).forEach(t => {
          commit(REMOVE_KEEPALIVE, t.name)
        })

        await dispatch('db/set', {
          path: 'page.opened',
          value: opened
        }, { root: true })

        if (router.app.$route.name !== 'Home') {
          router.push({
            name: 'Home'
          })
        }

        resolve()
      })
    },
    load ({ state, commit, dispatch }) {
      return new Promise(async (resolve) => {
        const opened = await dispatch('db/get', {
          path: 'page.opened'
        }, { root: true }) || state.opened || []

        commit(SET_OPENED, opened)
      })
    }
  },
  mutations: {
    /**
     * 初始化pool
     */
    [INIT] (state, routes) {
      const pool = []
      const push = routes => {
        routes.forEach(item => {
          if (item.children && item.children.length > 0) {
            push(item.children)
          } else {
            if (!item.hidden) {
              const { meta, name, path } = item
              pool.push({ meta, name, path })
            }
          }
        })
      }

      push(routes)
      state.pool = pool
    },
    /**
     * 设置当前激活页面
     */
    [SET_CURRENT_PAGE] (state, tavName) {
      state.current = tavName
    },
    [SET_OPENED] (state, opened) {
      state.opened = opened
    },
    [PUSH_KEEPALIVE] (state, name) {
      const keep = [...state.keepAlive]
      keep.push(name)
      state.keepAlive = keep
    },
    [REMOVE_KEEPALIVE] (state, name) {
      const list = [...state.keepAlive]
      const index = list.findIndex(item => item === name)

      if (index !== -1) {
        list.splice(index, 1)
        state.keepAlive = list
      }
    },
    [CLEAN_KEEPALIVE] (state) {
      state.keepAlive = []
    }
  }
}
