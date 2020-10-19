<template>
  <div class="home-page">
    <h1>Home</h1>
    <h2 v-if="userInfo">hello, {{ userInfo.name }}</h2>
    <p>{{  $t('label') }} : {{ $t('msg') }}</p>
    <svg-icon icon-class="code"></svg-icon>
    <el-button @click="logout">登出</el-button>
  </div>
</template>
<script>
export default {
  name: 'Home',
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style>
.home-page {
  padding: 20px;
}
</style>
