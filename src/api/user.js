import { mock, request } from '@/utils/mock'
// import faker from 'faker'
// import map from 'lodash/map'
// import random from 'lodash/random'

export function response (data = {}, msg = '', code = 0) {
  return [
    200,
    { code, msg, data }
  ]
}

/**
 * @description 接口请求返回 正确返回
 * @param {Any} data 返回值
 * @param {String} msg 状态信息
 */
function responseSuccess (data = {}, msg = '成功') {
  return [
    200,
    {
      data,
      code: 200,
      msg
    }
  ]
}
function responseError (data = {}, msg = '请求失败') {
  return [
    400,
    {
      data,
      code: 400,
      msg
    }
  ]
}

const tokens = {
  user: 'user-token'
}

const users = {
  'user-token': {
    name: 'user A',
    avatar: 'https://dev-file.iviewui.com/avatar_default/avatar'
  }
}

export const login = (params = {}) => {
  mock
    .onAny('/login')
    .reply(config => {
      const { username } = params
      const token = tokens[username]
      if (!token) {
        return responseError({
          msg: '用户名错误'
        })
      } else {
        return responseSuccess({
          token
        })
      }
    })
  // 接口请求
  return request({
    url: '/login',
    method: 'post',
    params
  })
}

export const logout = () => {
  mock
    .onGet('/logout')
    .reply(() => responseSuccess({
      msg: '退出成功'
    }))

  return request({
    url: '/logout',
    method: 'get'
  })
}

export const getInfo = (token) => {
  mock
    .onAny('/getInfo')
    .reply(config => {
      if (!token) {
        return responseError({
          msg: '用户未登录'
        })
      } else {
        return responseSuccess({
          userInfo: users[token]
        })
      }
    })

  return request({
    url: '/getInfo',
    method: 'get',
    token
  })
}
