import { fetchGet, fetchPost } from './fetch'
import { BASE_PATH } from './path'
import { Assets } from './staticAssets'

const BaseGroup = (path, template) => fetchGet(BASE_PATH + '/base' + path, { template })
const getInfo = () => BaseGroup('/info', {
  'agent': {
    'char': { 'key': '5062580742951', 'update_time': '2020-05-22T10:52:13.000Z' },
    'building': { 'key': '4828544601951', 'update_time': '2020-05-22T10:52:13.000Z' }
  },
  'level': {
    'enemy': { 'key': '7828544601951', 'update_time': '2020-05-22T10:52:13.000Z' },
    'stage': { 'key': '6952580742951', 'update_time': '2020-05-22T10:52:13.000Z' }
  },
  'base': { 'web': { 'key': '01234567', 'update_time': '2020-05-22T10:52:13.000Z' } }
})

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
