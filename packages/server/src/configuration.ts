import { App, Configuration, Logger } from '@midwayjs/decorator'
import { ILifeCycle, IMidwayApplication } from '@midwayjs/core'
import { ILogger, IMidwayLogger } from '@midwayjs/logger'
// import { Application } from 'egg'

@Configuration({
  imports: ['@midwayjs/orm'],
  importConfigs: ['./config'],
})
export class AutoConfiguration implements ILifeCycle {
  @App()
  app: IMidwayApplication

  @Logger()
  coreLogger: IMidwayLogger

  async onReady() {
    // this.app.sockets.
    this.coreLogger.updateConsoleLevel('info')
  }
}
