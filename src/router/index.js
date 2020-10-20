import Vue from 'vue'
import VueRouter from 'vue-router'
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

export default router
