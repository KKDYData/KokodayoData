import { Rule, RuleType } from '@midwayjs/decorator'
import {
  DecodeQrcode,
  GetQrcodeToken,
  GetLoginToken,
  CrossLogin,
} from '../interface/user'
import { BodyType, ParamsType } from './utils'

export class UserGetLoginTokenDTO implements ParamsType<GetLoginToken> {
  @Rule(RuleType.string().required())
  qrcodeKey: string

  @Rule(RuleType.string().required())
  token: string
}

export class UserCrossLoginDTO implements BodyType<CrossLogin> {
  @Rule(RuleType.string().required())
  qrcodeKey: string

  @Rule(RuleType.string().required())
  token: string

  @Rule(RuleType.string().required())
  wxId: string
}

export class UserDecodeQrcodeDTO implements BodyType<DecodeQrcode> {
  @Rule(RuleType.string().required())
  qrcodeKey: string
}
