import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cloneDeep from 'lodash/cloneDeep'

const adapter = new LocalStorage('tp-layout')
const db = lowdb(adapter)

db.defaults({
  settings: {}
}).write()

function setPath (path) {
  return `settings${path ? `.${path}` : ''}`
}

function init (path = '', defaultValue = '') {
  const currentPath = setPath(path)
  const value = db.get(currentPath).value()
  if (value === undefined) {
    db
      .set(currentPath, defaultValue)
      .write()
  }
}

export function setDB (path = '', value = '') {
  init(path, value)
  db.set(setPath(path), value).write()
}

export function getDB (path = '', defaultValue = '') {
  return cloneDeep(
    db.get(
      setPath(path),
      defaultValue
    ).value()
  )
}
