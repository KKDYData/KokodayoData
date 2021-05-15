import { App, Configuration, Inject, Logger } from '@midwayjs/decorator'
import { ILifeCycle, IMidwayContext } from '@midwayjs/core'
import { ILogger, IMidwayLogger } from '@midwayjs/logger'
import * as orm from '@midwayjs/orm'
import bodyParser from 'koa-bodyparser'
import { Application, Context } from '@midwayjs/koa'
import cors from '@koa/cors'

@Configuration({
  imports: [orm],
  importConfigs: ['./config'],
})
export class AutoConfiguration implements ILifeCycle {
  @App()
  app: Application

  @Logger()
  coreLogger: IMidwayLogger

  @Inject()
  ctx: Context

  async onReady() {
    // this.app.sockets.
    this.coreLogger.updateConsoleLevel('info')

    this.app.use(
      cors({
        origin: ctx => 'https://kokodayo.fun',
        credentials: true,
      })
    )

    this.app.use(bodyParser())
  }
}
