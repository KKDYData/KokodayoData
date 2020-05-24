import { fetchGet } from './fetch'
import { BASE_PATH } from './path'
import { Assets } from './staticAssets'
const BaseGroup = (path) => fetchGet(BASE_PATH + '/base' + path)

const getInfo = () => BaseGroup('/info')

const Api = {
  getInfo
}

export {
  Api,
  Assets
}
