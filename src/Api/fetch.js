import { isCrossOrigin } from './utils'
import { memoizeWith, identity } from 'ramda'
import { ApiError } from './error'

const isDev = process.env.NODE_ENV === 'development'

const getMode = url => isCrossOrigin(url) ? 'cors' : 'same-origin'
const getModeC = memoizeWith(identity, getMode)

export const fetchGet = (url, { isApi = true, template }) => {
  // if (isDev && template) return Promise.resolve(template)

  return fetch(url, {
    method: 'GET',
    mode: getModeC(url)
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
    else {
      return new Error('net error')
    }
  }).then(res => {
    if (isApi) {
      if (res.ok) {
        return res.result
      } else {
        throw new ApiError('server error', res)
      }
    } else {
      return res
    }
  })
}


export const fetchPost = (url, data) => {
  return fetch(url, {
    method: 'POST',
    mode: getModeC(url),
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-cache'
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
    else {
      return new Error('net error')
    }
  }).then(res => {
    if (res.ok) {
      return res.result
    } else {
      throw new ApiError('server error', res)
    }
  })
}
