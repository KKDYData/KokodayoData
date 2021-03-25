import { Rule, RuleType } from '@midwayjs/decorator'
import {
  GetQrcodeToken,
  GetQrcodeWxId,
  SendQrcodeWxId,
} from '../interface/user'
import { BodyType, ParamsType } from './utils'

export class UserGetWxIdDTO implements ParamsType<GetQrcodeWxId> {
  @Rule(RuleType.string().required())
  token: string
}

export class UserSendQrcodeWxIdDTO implements BodyType<SendQrcodeWxId> {
  @Rule(RuleType.string().required())
  token: string

  @Rule(RuleType.string().required())
  wxId: string
}
