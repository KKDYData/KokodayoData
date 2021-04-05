import { IMidwayLogger } from '@midwayjs/logger'
import { IMidwayWebContext } from '@midwayjs/web'

export type LoginCtx = IMidwayWebContext & {
  loginToken: string
  loginData: LoginData
  logger: IMidwayLogger
  loginTime: number
}

interface LoginData {
  userId?: number
  wxId: string
}
