import { setDB, getDB } from '@/utils/db'

export default {
  namespaced: true,
  actions: {
    set (context, { path = '', value = '' }) {
      return new Promise((resolve) => {
        setDB(path, value)
        resolve()
      })
    },
    /**
     * @description 获取数据
     * @description 效果类似于取值 dbName.path || defaultValue
     * @param {Object} context
     * @param {Object} payload dbName {String} 数据库名称
     * @param {Object} payload path {String} 存储路径
     * @param {Object} payload defaultValue {*} 取值失败的默认值
     * @param {Object} payload user {Boolean} 是否区分用户
     */
    get (context, { path }) {
      return new Promise((resolve) => {
        const info = getDB(path)
        resolve(info)
      })
    }
  }
}
