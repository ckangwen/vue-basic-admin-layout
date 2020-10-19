export const layoutSettings = {
  layout: 'sidemenu',
  fixSiderbar: true,
  title: 'Vue CMS'
}

export const systemSettings = {
  page: {
    opened: [
      {
        name: 'Home',
        path: '/index',
        fullPath: '/index',
        meta: {
          title: '首页'
        }
      }
    ]
  },
  useI18n: false
}

export const themeList = [
  { text: '浅色主题', value: 'light' },
  { text: '深色主题', value: 'dark' }
]
export const defaultTheme = 'light'
