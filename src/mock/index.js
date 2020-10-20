import Mock from 'mockjs'
import qs from 'qs'
import login from './api/login'

function wired ({ url, type, body }) {
  return {
    method: type,
    params: qs.parse(url.split('?').length > 1 ? url.split('?')[1] : ''),
    body: JSON.parse(body),
    url: qs.parse(url.split('?')[0])
  }
}

function setup (path, method, handle) {
  Mock.mock(
    RegExp(path),
    method,
    typeof handle === 'function' ? o => handle(wired(o)) : handle
  )
}

function load (collection) {
  collection.map(({ path, method, handle }) => {
    if (typeof method === 'string' && method.indexOf('|') > -1) method = method.split('|')
    if (method instanceof Array) {
      method.map(item => setup(path, item, handle))
    } else {
      setup(path, method, handle)
    }
  })
}

load(login)
