import router from '@/router'
import { constantRoutes } from '@/router/routes'
import store from '@/store'
import Cookie from '@/utils/util.cookie'
import { isEmptyObj, getDB } from '@/utils'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = constantRoutes.map(route => route.name)
// let hasLoadRoutes = false

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const token = Cookie.get('token')
  const userInfo = getDB('user')

  if (token && (userInfo || isEmptyObj(userInfo))) { // 已登录
    /* 在已登录的情况下再前往登录页，则前往首页 */
    if (to.name === 'login') {
      next({ path: '/' })
    } else {
      /* 需要进行权限校验 */
      const hasLoadRoutes = store.state.permission.hasLoadRoutes
      if (!hasLoadRoutes) {
        try {
          const roles = userInfo.roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('account/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
        store.commit('permission/SET_HASLOADROUTES', true)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.name) > -1) {
      /* 白名单页不进行跳转 */
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(to => {
  NProgress.done()
  store.dispatch('page/open', to)
})
