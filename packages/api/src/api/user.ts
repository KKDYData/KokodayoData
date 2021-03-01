
export interface GetQrcodeToken {
  path: '/user/qrcode/token'
  method: 'get'

  response: string
}

export interface GetQrcodeWxId {
  path: '/user/qrcode/wxId'
  method: 'get'

  params: {
    token: string
  }

  response: string
}

export interface SendQrcodeWxId {
  path: '/user/qrcode/sendWxId'
  method: 'post'

  data: { wxId: string, token: string }

  response: never
}