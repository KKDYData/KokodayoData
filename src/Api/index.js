import { fetchGet, fetchPost } from './fetch'
import { BASE_PATH } from './path'
import { Assets } from './staticAssets'

const BaseGroup = (path) => fetchGet(BASE_PATH + '/base' + path)
const getInfo = () => BaseGroup('/info')

const YdkkGroup = (path, body) => fetchPost(BASE_PATH + '/ydkk' + path, body)
const postFeedback = (body) => YdkkGroup('/feedback', body)

const Api = {
  getInfo,
  postFeedback
}

export {
  Api,
  Assets
}
