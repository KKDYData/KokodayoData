import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Validate,
  ALL,
  Query,
} from '@midwayjs/decorator'
import { GetResType } from '../dto/utils'
import { ApiData } from '../interface'
import { GameActivityService } from '../service/data/activity.s'
import { CharService } from '../service/data/char.s'
import {
  DataUpdateRelativeDTO,
  DataUpdateCharCharComment,
  DataUpdateCharSkillComment,
  DataGetGachaPoolsByIdsDTO,
} from '../dto/data'
import { GachaPoolService } from '../service/data/gachaPool.s'

@Provide()
@Controller('/data')
export class DataController {
  @Inject()
  charService: CharService

  @Inject()
  activityService: GameActivityService

  @Inject()
  gachaPoolService: GachaPoolService

  @Get('/list')
  async listCharacters(): Promise<GetResType<ApiData.GetCharacterList>> {
    return this.charService.listCharacters()
  }

  @Get('/acts')
  async listActivity(): Promise<GetResType<ApiData.GetActivityList>> {
    return this.activityService.listGameActivity()
  }

  @Get('/gachaPools')
  async listGachaPool(): Promise<GetResType<ApiData.GetGachaPoolList>> {
    return this.gachaPoolService.listGachaPool()
  }

  @Post('/gachaPools/ids')
  @Validate()
  async getGachaPool(
    @Body(ALL) data: DataGetGachaPoolsByIdsDTO
  ): Promise<GetResType<ApiData.GetGachaPoolListByIds>> {
    return this.gachaPoolService.getByIds(data.ids)
  }

  @Post('/char/relative')
  @Validate()
  async addRelative(@Body(ALL) body: DataUpdateRelativeDTO) {
    await this.charService.updateRelativeChar(body.targetId, body.relativeId)
  }

  @Post('/char/charComment')
  @Validate()
  async updateCharCharComment(@Body(ALL) body: DataUpdateCharCharComment) {
    await this.charService.updateCharComment(body.id, body.comment)
  }

  @Post('/char/skillComment')
  @Validate()
  async updateCharSkillComment(@Body(ALL) body: DataUpdateCharSkillComment) {
    await this.charService.updateSkillComment(body.id, body.comment)
  }
}
