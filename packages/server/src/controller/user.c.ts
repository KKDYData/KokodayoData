import { ALL, Body, Controller, Get, Inject, Post, Provide, Query } from '@midwayjs/decorator'
import { UserService } from '../service/user'
import { ApiUser } from '../interface'

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService

  @Get('/test')
  async test () {
    const data = this.userService.getUser({ uid: 1 })
    return data
  }

  @Get('/qrcode/token')
  async qrcodeToken (): Promise<ApiUser.GetQrcodeToken[ 'response' ]> {
    const token = await this.userService.getQrCodeLoginToken()

    return token
  }


  @Get('/qrcode/wxId')
  async validateQrcodeToken (@Query(ALL) params: ApiUser.GetQrcodeWxId[ 'params' ]) {
    const wxid = await this.userService.getWxIdByToken(params.token)

    return wxid
  }

  @Post('/qrcode/sendWxId')
  async sendWxId (@Body(ALL) data: ApiUser.SendQrcodeWxId[ 'data' ]) {
    await this.userService.setWxIdByToken(data.token, data.wxId)
  }
}
