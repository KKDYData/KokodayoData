import { IMidwayLogger } from '@midwayjs/logger'
import { Context } from '@midwayjs/koa'

export type LoginCtx = Context & {
  loginToken: string
  loginData: LoginData
  logger: IMidwayLogger
  loginTime: number
}

interface LoginData {
  userId?: number
  wxId: string
}
