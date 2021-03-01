import { request } from './instance'
import { JsonResponse } from './response'

export function GetQrcodeToken() {
  return request.get<JsonResponse<string>>('/user/qrcode/token')
}
export function GetQrcodeWxId(params: { token: string }) {
  return request.get<JsonResponse<string>>('/user/qrcode/wxId', { params })
}
export function SendQrcodeWxId(data: { wxId: string; token: string }) {
  return request.post<JsonResponse<never>>('/user/qrcode/sendWxId', data)
}
