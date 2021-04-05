import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Provide,
  Query,
  Validate,
} from '@midwayjs/decorator'
import { UserService } from '../service/user'
import { ApiUser } from '../interface'
import {
  UserDecodeQrcodeDTO,
  UserGetLoginTokenDTO,
  UserCrossLoginDTO,
} from '../dto/user'
import { GetResType } from '../dto/utils'
import { BaseError } from '../utils/error'
import { ErrorMap } from '../utils/ErrorMap'
import { LoginCtx } from '../ctx'
import { omit, pick } from 'ramda'
import { CrossLogin, DecodeQrcode, GetLoginToken } from '../interface/user'

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService

  @Get('/qrcode/key')
  async qrcodeToken(): Promise<GetResType<ApiUser.GetQrcodeToken>> {
    return this.userService.getQrCodeKey()
  }

  @Get('/qrcode/loginToken')
  @Validate()
  async getLoginToken(
    @Query(ALL) params: UserGetLoginTokenDTO
  ): Promise<GetResType<GetLoginToken>> {
    return this.userService.getQrcodeLoginToken(params.qrcodeKey, params.token)
  }

  @Post('/qrcode/decode')
  @Validate()
  async decodeQrcode(
    @Body(ALL) data: UserDecodeQrcodeDTO
  ): Promise<GetResType<DecodeQrcode>> {
    const json = await this.userService.decodeQrcode(data.qrcodeKey)

    if (json === null) {
      throw BaseError.create(ErrorMap['-1001'])
    }
    return pick(['token', 'type'], json)
  }

  @Post('/qrcode/crossLogin')
  @Validate()
  async crossLogin(
    @Body(ALL) data: UserCrossLoginDTO
  ): Promise<GetResType<CrossLogin>> {
    // todo 用微信id 鉴权

    await this.userService.crossLoginByWxId(
      data.qrcodeKey,
      data.token,
      data.wxId
    )

    return true
  }

  @Get('/info', { middleware: ['loginMiddleware'] })
  async getUserInfoS(ctx: LoginCtx) {
    const data = await this.userService.getUser(ctx.loginToken)
    return pick(['wxId', 'nickname'], data)
  }
}
