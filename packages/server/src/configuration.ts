import { App, Configuration, Inject, Logger } from '@midwayjs/decorator'
import { ILifeCycle, IMidwayApplication, IMidwayContext } from '@midwayjs/core'
import { ILogger, IMidwayLogger } from '@midwayjs/logger'
import { Application, Context } from 'egg'
import * as orm from '@midwayjs/orm'
import aliOss from 'ali-oss'

@Configuration({
  imports: [orm],
  importConfigs: ['./config'],
})
export class AutoConfiguration implements ILifeCycle {
  @App()
  app: IMidwayApplication

  @Logger()
  coreLogger: IMidwayLogger

  @Inject()
  ctx: Context

  async onReady() {
    // this.app.sockets.
    this.coreLogger.updateConsoleLevel('info')
  }
}
