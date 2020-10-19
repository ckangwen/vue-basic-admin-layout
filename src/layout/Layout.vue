<template>
  <ad-layout v-bind="settings" :collapsed.sync="collapsed" :menu-attrs="menuAttrs">
    <template slot="header-extra">
      <header-theme />
      <locale />
      <user-state/>
    </template>
    <template slot="pageHeader">
      <nav-tabs />
    </template>
    <router-view></router-view>
  </ad-layout>
</template>
<script>
import { layoutSettings } from '@/config/settings'
import { mainRoutes } from '@/router/routes'
import omit from 'lodash/omit'
import NavTabs from './components/NavTabs'
import UserState from '@/components/user-state'
import Locale from '@/components/locale'
import HeaderTheme from '@/components/theme'
export default {
  name: 'app-layout',
  components: {
    NavTabs,
    UserState,
    Locale,
    HeaderTheme
  },
  data () {
    return {
      settings: Object.assign(layoutSettings, {
        routes: mainRoutes.map(item => omit(item, ['component']))
      }),
      collapsed: false,
      menuAttrs: {
        router: true
      }
    }
  }
}
</script>
