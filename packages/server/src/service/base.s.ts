import { App, Inject, Logger } from '@midwayjs/decorator'
import { ILogger, IMidwayLogger } from '@midwayjs/logger'
import { IMidwayWebApplication, IMidwayWebContext } from '@midwayjs/web'

export class BaseService {
  @Inject()
  ctx: IMidwayWebContext & {
    logger: IMidwayLogger
  }
}
