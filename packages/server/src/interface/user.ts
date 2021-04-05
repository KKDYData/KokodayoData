export interface GetQrcodeToken {
  path: '/user/qrcode/key'
  method: 'get'

  response: {
    qrcodeKey: string
    token: string
  }
}

export interface GetLoginToken {
  path: '/user/qrcode/loginToken'
  method: 'get'

  params: {
    qrcodeKey: string
    token: string
  }

  response: string
}

export interface CrossLogin {
  path: '/user/qrcode/crossLogin'
  method: 'post'

  data: { qrcodeKey: string; wxId: string; token: string }

  response: true
}

export interface DecodeQrcode {
  path: '/user/qrcode/decode'
  method: 'post'

  data: {
    qrcodeKey: string
  }

  response: {
    type: 'loginQrcode'
    token: string
  }
}

export interface GetUserInfo {
  path: '/user/info'
  method: 'get'

  response: {
    wxId: string
    nickname?: string
  }
}
