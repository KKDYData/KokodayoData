import { request } from './instance'
import { JsonResponse } from './response'

export function GetQrcodeToken() {
  return request.get<
    JsonResponse<{
      qrcodeKey: string
      token: string
    }>
  >('/user/qrcode/key')
}
export function GetLoginToken(params: { qrcodeKey: string; token: string }) {
  return request.get<JsonResponse<string>>('/user/qrcode/loginToken', {
    params,
  })
}
export function CrossLogin(data: {
  qrcodeKey: string
  wxId: string
  token: string
}) {
  return request.post<JsonResponse<true>>('/user/qrcode/crossLogin', data)
}
export function DecodeQrcode(data: { qrcodeKey: string }) {
  return request.post<
    JsonResponse<{
      type: 'loginQrcode'
      token: string
    }>
  >('/user/qrcode/decode', data)
}
export function GetUserInfo() {
  return request.get<
    JsonResponse<{
      wxId: string
      nickname?: string
    }>
  >('/user/info')
}
