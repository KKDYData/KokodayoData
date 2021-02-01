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

  @Post('/get_user')
  async getUser(@Query() uid) {
    const user = await this.userService.getUser({ uid })
    return { success: true, message: 'OK', data: user }
  }

  @Get('/index_list')
  async getIndexList() {
    const list = await this.indexListService.getList()

    return { success: true, data: { list } }
  }
}
