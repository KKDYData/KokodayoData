import { request } from './instance'
import { JsonResponse } from './response'
export interface TAds {
  date: string
  pics: string[]
  pics_m: string[]
  text: string
  link: string
}

export function GetAds() {
  return request.get<JsonResponse<TAds[]>>('/ark')
}
