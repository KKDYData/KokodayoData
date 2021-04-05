import {
  Inject,
  Controller,
  Post,
  Provide,
  Query,
  Get,
} from '@midwayjs/decorator'
import { Context } from 'egg'
import { IndexListService } from '../service/indexList.s'
import { UserService } from '../service/user'

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context

  @Inject()
  userService: UserService

  @Inject()
  indexListService: IndexListService

  @Get('/index_list')
  async getIndexList() {
    const list = await this.indexListService.getList()

    return { success: true, data: { list } }
  }

  @Get('/')
  async home() {
    return 'api'
  }
}
