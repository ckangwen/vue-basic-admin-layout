import Home from '../views/Home.vue'
// import Layout from '@/components/Hello'
import Layout from '@/layout/Layout'

export const mainRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme'),
        name: 'Theme',
        meta: { title: '主题' }
      }
    ]
  },
  {
    path: '/page7',
    name: 'Page7',
    component: Layout,
    meta: {
      title: 'Page7'
    },
    children: [
      {
        path: 'index',
        name: 'page7-index',
        meta: {
          title: 'page7-index'
        },
        component: () => import('@/views/page/Page7')
      },
      {
        path: 'page2',
        name: 'page7-page2',
        meta: {
          title: 'page7-page2'
        },
        component: () => import('@/views/page/Page2')
      }
    ]
  },
  {
    path: '/page',
    name: 'Page4',
    component: Layout,
    meta: {
      title: 'Page4'
    },
    children: [
      {
        path: 'page5',
        name: 'page4-page5',
        meta: {
          title: 'page4-page5'
        },
        component: () => import('@/views/page/Page4')
      },
      {
        path: 'page6',
        name: 'page4-page6',
        meta: {
          title: 'page4-page6'
        },
        component: () => import('@/views/page/Page6')
      }
    ]
  }
]

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login'),
    name: 'login',
    meta: {
      hidden: true,
      auth: false
    }
  },
  {
    path: '/404',
    name: 'err_404',
    component: () => import('@/views/404'),
    meta: {
      hidden: true,
      auth: false
    }
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      auth: false
    }
  }
]
