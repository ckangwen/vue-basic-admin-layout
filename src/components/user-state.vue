<template>
  <span class="top-header-extra-block">
    <el-dropdown size="small">
      <span class="user-info">
        <el-avatar size="small" :src="userInfo.avatar"></el-avatar>
        <span style="padding-left: 5px;">{{ userInfo.name || '未登录'}}</span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="userLogout">
          注销
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  methods: {
    ...mapActions('user', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    async userLogout () {
      await this.logout({
        confirm: true
      })
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
