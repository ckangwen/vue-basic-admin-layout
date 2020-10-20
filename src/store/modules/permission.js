import { mainRoutes, constantRoutes } from '@/router/routes'

function hasAccess (a, b) {
  if (!a || a.length === 0) return true
  return a.some(item => {
    return b.indexOf(item) > -1
  })
}

function filterAsyncRoutes (routes, roles) {
  return routes.map(route => {
    const tmp = { ...route }
    if ((tmp.meta && tmp.meta.roles) && (tmp.children && tmp.children.length === 0)) {
      if (hasAccess(tmp.meta.roles, roles)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
        return tmp
      }
    } else if (tmp.children.length > 0) {
      const children = tmp.children.map(child => {
        if (!child.meta || !child.meta.roles) return child
        if (hasAccess(child.meta.roles, roles)) return child
      }).filter(item => item)
      if (children.length <= 0) return undefined

      tmp.children = children
      return tmp
    } else {
      return tmp
    }
  }).filter(item => item).filter(item => item.children && item.children.length > 0)
}

export default {
  namespaced: true,
  state: {
    routes: [],
    mainRoutes: [],
    hasLoadRoutes: false
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.mainRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_HASLOADROUTES (state, hasLoadRoutes) {
      state.hasLoadRoutes = hasLoadRoutes
    }
  },
  actions: {
    generateRoutes ({ commit }, roles) {
      return new Promise(resolve => {
        const accessedRoutes = filterAsyncRoutes(mainRoutes, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }

}
