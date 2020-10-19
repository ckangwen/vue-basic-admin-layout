import axios from 'axios'
import { Message } from 'element-ui'
import get from 'lodash/get'
import Adapter from 'axios-mock-adapter'
import cookieUtil from '@/utils/util.cookie'

export function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}
export function errorLog (error) {
  Message({
    message: error.message,
    type: 'error',
    duration: 2 * 1000
  })
}

function createService () {
  const service = axios.create()

  service.interceptors.request.use(
    config => config,
    error => {
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    response => {
      const { data } = response
      const { code } = data
      if (code === undefined) {
        return data
      } else {
        switch (code) {
          case 200:
            // [ 示例 ] code === 0 代表没有错误
            return data.data
          case '500':
            errorCreate(`[ code: 500 ] ${data.msg}: ${response.config.url}`)
            break
          default:
            // 不是正确的 code
            errorCreate(`${data.msg}: ${response.config.url}`)
            break
        }
      }
    },
    error => {
      if (error && error.response) {
        switch (error.response.status) {
          case 400: error.message = '请求错误'; break
          case 401: error.message = '未授权，请登录'; break
          case 403: error.message = '拒绝访问'; break
          case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
          case 408: error.message = '请求超时'; break
          case 500: error.message = '服务器内部错误'; break
          case 501: error.message = '服务未实现'; break
          case 502: error.message = '网关错误'; break
          case 503: error.message = '服务不可用'; break
          case 504: error.message = '网关超时'; break
          case 505: error.message = 'HTTP版本不受支持'; break
          default: break
        }
      }
      errorLog(error)
      return Promise.reject(error)
    }
  )

  return service
}

function createRequestFunction (service) {
  return function (config) {
    const token = cookieUtil.get('token')
    const configDefault = {
      headers: {
        Authorization: token,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 5000,
      baseURL: process.env.VUE_APP_API
    }

    return service(Object.assign(configDefault, config))
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequestFunction(service)

export const mock = new Adapter(service)
