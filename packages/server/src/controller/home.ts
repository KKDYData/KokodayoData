import { Controller, Get, Inject, Provide } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'

@Provide()
@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context

  @Get('/')
  async home(ctx) {
    // console.log(this.ctx.response)
    return 'Hello Midwayjs!'
  }
}
