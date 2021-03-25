import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Query,
  Validate,
} from '@midwayjs/decorator'
import { UserService } from '../service/user'
import { ApiUser } from '../interface'
import { UserGetWxIdDTO, UserSendQrcodeWxIdDTO } from '../dto/user'
import { GetResType } from '../dto/utils'

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService

  @Get('/test')
  async test() {
    const data = this.userService.getUser({ uid: 1 })
    return data
  }

  @Get('/qrcode/token')
  async qrcodeToken(): Promise<GetResType<ApiUser.GetQrcodeToken>> {
    const token = await this.userService.getQrCodeLoginToken()

    return token
  }

  @Get('/qrcode/wxId')
  @Validate()
  async validateQrcodeToken(@Query(ALL) params: UserGetWxIdDTO) {
    const wxid = await this.userService.getWxIdByToken(params.token)

    return wxid
  }

  @Post('/qrcode/sendWxId')
  async sendWxId(@Body(ALL) data: UserSendQrcodeWxIdDTO) {
    await this.userService.setWxIdByToken(data.token, data.wxId)
  }
}
