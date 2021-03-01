import { useAxios } from '@vueuse/integrations'
import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
  withCredentials: true,
  baseURL: '/api'
})

export const useRequest = (url: string, config?: AxiosRequestConfig) => {
  return useAxios(url, config ?? {}, instance)
}
