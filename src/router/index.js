import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Cookie from '@/utils/util.cookie'
import { mainRoutes, constantRoutes } from './routes'

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    ...mainRoutes,
    ...constantRoutes
  ],
  scrollBehavior: () => ({ y: 0 })
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched.some(r => r.meta && (r.meta.auth !== false || r.meta.auth === true))) {
    const token = Cookie.get('token')
    if (token) {
      next()
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  } else {
    next()
  }
})
router.afterEach(to => {
  // 进度条
  NProgress.done()
  store.dispatch('page/open', to)
})

export default router
