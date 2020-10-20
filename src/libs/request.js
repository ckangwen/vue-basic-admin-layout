import Vue from 'vue'
import axios from 'axios'

const request = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)

request.interceptors.response.use(
  res => {
    const data = res.data
    const code = data.code
    switch (code) {
      case 200: {
        return data.data
      }
      case 400: {
        throw new Error(`[code: 401]: ${res.config.url}`)
      }
      default: {
        throw new Error(`[error]${res.config.url}`)
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
    return Promise.reject(new Error(error))
  }
)

export default request
