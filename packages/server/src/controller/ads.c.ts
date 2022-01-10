import { Config, Controller, Get, Inject, Provide } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { TAds } from '../interface/ads'

/**
 * 广告接口
 */
@Provide()
@Controller('/ark')
export class ArkController {
  @Inject()
  ctx: Context

  @Config('ads')
  ads: TAds[]

  @Get('/')
  async getAds() {
    return this.ads
  }
}
