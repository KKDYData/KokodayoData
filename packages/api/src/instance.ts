import axios from 'axios'

export const request = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) ?? 'http://127.0.0.1:7001',
  withCredentials: true,
})

export const setXToken = (token: string) => {
  request.interceptors.request.use((config) => {
    config.headers['x-token'] = token
    return config
  })
}
