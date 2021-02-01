import { App, Configuration } from '@midwayjs/decorator'
import { ILifeCycle } from '@midwayjs/core'
import { Application } from 'egg'

@Configuration({
  imports: ['@midwayjs/orm'],
  importConfigs: ['./config'],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application

  async onReady() {}
}
