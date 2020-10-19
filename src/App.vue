<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>
<style lang="scss">
body {
  margin: 0;
}
#app {
  height: 100vh;
}
@import '~@/assets/style/index.scss';
</style>
