import { App, Inject, Logger } from '@midwayjs/decorator'
import { ILogger, IMidwayLogger } from '@midwayjs/logger'
import { IMidwayWebApplication, IMidwayWebContext } from '@midwayjs/web'
import { LoginCtx } from '../ctx'

export class BaseService {
  @Inject()
  ctx: LoginCtx

  @Logger()
  coreLogger: ILogger
}
