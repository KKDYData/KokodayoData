import axios from 'taro-axios'

export const request = axios.create({
  baseURL: 'https://test.api.kokodayo.fun',
  withCredentials: true,
})

export const setXToken = (token: string) => {
  request.interceptors.request.use((config) => {
    config.headers['x-token'] = token
    return config
  })
}
