const users = [
  {
    username: 'admin',
    password: 'admin',
    roles: ['admin'],
    name: 'admin',
    avatar: 'https://cdn.pixabay.com/photo/2020/05/02/04/19/butterfly-5119823_960_720.jpg'
  },
  {
    username: 'user',
    password: 'user',
    roles: ['user'],
    name: 'user',
    avatar: 'https://cdn.pixabay.com/photo/2020/04/28/18/15/landscape-5105731_960_720.jpg'
  }
]
const tokens = {
  admin_token: users[0],
  user_token: users[1]
}

const responseSuccess = (msg, data) => ({
  code: 200,
  msg,
  data
})
const responseError = (msg, data = {}) => ({
  code: 400,
  msg,
  data
})

const login = {
  path: '/api/login',
  method: 'post',
  handle ({ body }) {
    const { username, password } = body
    const user = users.find(e => e.username === username && e.password === password)
    let token = ''
    if (username === 'user') {
      token = 'user_token'
    } else if (username === 'admin') {
      token = 'admin_token'
    }
    if (user) {
      return responseSuccess('登录成功', {
        token
      })
    } else {
      return responseError('用户名或密码错误', {})
    }
  }
}
const logout = {
  path: '/api/logout',
  method: 'get',
  handle ({ body }) {
    const { token } = body
    if (token) {
      return responseSuccess('登出成功')
    } else {
      return responseError('登出异常')
    }
  }
}
const getInfo = {
  path: '/api/getInfo',
  method: 'get',
  handle ({ body }) {
    const { token } = body
    if (token) {
      return responseSuccess('用户信息获取成功', tokens[token])
    } else {
      return responseError('尚未生成token，无法获取用户信息')
    }
  }
}
export default [
  login,
  logout,
  getInfo
]
