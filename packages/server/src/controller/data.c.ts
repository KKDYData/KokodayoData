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
  Logger,
  Param,
} from '@midwayjs/decorator'
import { GetResType } from '../dto/utils'
import { ApiData } from '../interface'
import { GameActivityService } from '../service/data/activity.s'
import { CharService } from '../service/data/char.s'
import {
  DataUpdateRelativeDTO,
  DataUpdateCharCharComment,
  DataUpdateCharSkillCommentsDTO,
  DataGetGachaPoolsByIdsDTO,
  DataUpdateEnemyCommentsDTO,
} from '../dto/data'
import { GachaPoolService } from '../service/data/gachaPool.s'
import { EnemyService } from '../service/data/enemy.s'
import { SkillService } from '../service/data/skill.s'
import { MapService } from '../service/data/map.s'
import { ILogger } from '@midwayjs/logger'
import { IStageInfo } from '@kkdy/data'

@Provide()
@Controller('/data')
export class DataController {
  @Inject()
  charService: CharService

  @Inject()
  activityService: GameActivityService

  @Inject()
  gachaPoolService: GachaPoolService

  @Inject()
  enemyService: EnemyService

  @Inject()
  skillService: SkillService

  @Inject()
  mapService: MapService

  @Logger()
  coreLogger: ILogger

  @Get('/list')
  async listCharacters(): Promise<GetResType<ApiData.GetCharacterList>> {
    return this.charService.listCharacters()
  }

  @Get('/char')
  async getChar(
    @Query('id') id: string
  ): Promise<GetResType<ApiData.GetCharacter>> {
    return this.charService.buildCharData(id)
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
  async updateCharSkillComment(
    @Body(ALL) body: DataUpdateCharSkillCommentsDTO
  ) {
    await this.skillService.updateSkillComment(body.id, body.comments)
  }

  @Get('/enemy')
  async getEnemyById(@Query(ALL) query: { id: string }) {
    return this.enemyService.getByEnemyId(query.id)
  }

  @Get('/enemy/list')
  async listEnemies(): Promise<GetResType<ApiData.ListEnemies>> {
    return this.enemyService.listEnemies()
  }

  @Post('/enemy/comments')
  @Validate()
  async updateEnemyComments(@Body(ALL) data: DataUpdateEnemyCommentsDTO) {
    return this.enemyService.updateEnemyComments(data.id, data.comments)
  }

  @Get('/map/list')
  async listMap(): Promise<GetResType<ApiData.ListMap>> {
    return this.mapService.listMap()
  }

  @Get('/map')
  async getMapByLevelId(@Query(ALL) q: { id: string }) {
    return this.mapService.getMapByLevelId(q.id)
  }
}
