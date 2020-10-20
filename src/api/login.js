import request from '@/libs/request'

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function logout (data) {
  return request({
    url: '/logout',
    method: 'get',
    data
  })
}
export function getInfo (data) {
  return request({
    url: '/getInfo',
    method: 'get',
    data
  })
}
