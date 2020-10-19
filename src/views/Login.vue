<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">Login Form</h3>
    </div>
    <el-form
      ref="form"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <el-input
          ref="username"
          prefix-icon="el-icon-user"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="password"
          show-password
          v-model="loginForm.password"
          placeholder="Password"
          name="password"
          type="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

    </el-form>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'user',
        password: '123456'
      },
      loginRules: {
        username: [
          {
            required: true, trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, trigger: 'blur'
          }
        ]
      },
      loading: false,
      redirect: null
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
        }
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  }
}
</script>
<style lang="scss">
$bg:#eee;
$form-bg: #fff;
$dark_gray:#889aa4;
$light_gray:#eee;

.title-container {
  position: relative;

  .title {
    font-size: 26px;
    text-align: center;
    font-weight: bold;
  }
}

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 350px;
    max-width: 100%;
    padding: 35px;
    margin: 0 auto;
    overflow: hidden;
    background-color: $form-bg;
  }
}

</style>
