import { App, Configuration, Inject, Logger } from '@midwayjs/decorator'
import { ILifeCycle, IMidwayContext } from '@midwayjs/core'
import { ILogger, IMidwayLogger } from '@midwayjs/logger'
import * as orm from '@midwayjs/orm'
import bodyParser from 'koa-bodyparser'
import { Application, Context } from '@midwayjs/koa'
import cors from '@koa/cors'

const ALLOW_ORIGINS = ['https://kokodayo.fun', 'https://www.kokodayo.fun']

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
    this.coreLogger.info('on ready')

    this.app.use(
      cors({
        origin: ctx => {
          const targetIndex = ALLOW_ORIGINS.indexOf(ctx.headers.origin) ?? 0
          return ALLOW_ORIGINS[targetIndex]
        },
        credentials: true,
      })
    )

    this.app.use(bodyParser())
  }
}
