import {
  ICharWord,
  IChar,
  ISkill,
  ICharInfo,
  IBuildingBuff,
  IBuilding,
  IPatchInfo,
  ITeamInfo,
  IActivityInfo,
  IStageInfo,
  IStageData,
  IGachaPoolInfo,
  IEnemyInfo,
  IEnemyData,
  IUniEquip,
  IBattleEquip,
} from '@kkdy/data'
import { ALL, Get, Query, Validate } from '@midwayjs/decorator'
import { Body, Controller, Inject, Post, Provide } from '@midwayjs/decorator'
import { BuildingSkillService } from '../service/data/buildingSkill.s'
import { BuildingBuffService } from '../service/data/buildingBuff.s'
import { CharService } from '../service/data/char.s'
import { CharInfoService } from '../service/data/charInfo.s'
import { CharwordService } from '../service/data/charword.s'
import { SkillService } from '../service/data/skill.s'
import { OssService } from '../service/oss.s'
import { TeamInfoService } from '../service/data/teamInfo.s'
import { GameActivityService } from '../service/data/activity.s'
import { ApiUpdate } from '../interface'
import { GetResType } from '../dto/utils'
import { SimpleIdDTO } from '../dto/data'
import { MapService } from '../service/data/map.s'
import { GachaPoolService } from '../service/data/gachaPool.s'
import {
  UpdateGachaPoolByDateRangeDTO,
  UpdateGachaPoolByNameDTO,
} from '../dto/update'
import { EnemyService } from '../service/data/enemy.s'
import { EquipService } from '../service/data/equip.s'

@Provide()
@Controller('/update')
export class UpdateController {
  @Inject()
  charwordService: CharwordService

  @Inject()
  charService: CharService

  @Inject()
  skillService: SkillService

  @Inject()
  charInfoService: CharInfoService

  @Inject()
  buildingBuffService: BuildingBuffService

  @Inject()
  buildingSkillService: BuildingSkillService

  @Inject()
  teamInfoService: TeamInfoService

  @Inject()
  equipService: EquipService

  @Inject()
  activityService: GameActivityService

  @Inject()
  ossService: OssService

  @Inject()
  mapServide: MapService

  @Inject()
  enemyService: EnemyService

  @Inject()
  gachaPoolService: GachaPoolService

  @Post('/charword')
  async updateCharword(@Body(ALL) data: ICharWord.IWord) {
    await this.charwordService.createOrUpdate(data)

    return true
  }

  @Post('/char')
  async updateChar(@Body(ALL) data: { id: string; data: IChar.IData }) {
    await this.charService.createOrUpdate(data.id, data.data)

    return true
  }

  @Get('/char')
  @Validate()
  async getChar(
    @Query(ALL) q: SimpleIdDTO
  ): Promise<GetResType<ApiUpdate.GetChar>> {
    const data = await this.charService.getCharByCharId(q.id)

    return data
  }

  @Post('/skill')
  async updateSkill(@Body(ALL) data: ISkill.ISkill) {
    await this.skillService.createOrUpdate(data)

    return true
  }

  @Post('/equip')
  async updateEquip(
    @Body(ALL) data: { info: IUniEquip.IInfo; data: IBattleEquip.IData }
  ) {
    await this.equipService.createOrUpdate(data.info, data.data)

    return true
  }

  @Post('/charInfo')
  async updateCharInfo(@Body(ALL) data: ICharInfo.IInfo) {
    await this.charInfoService.createOrUpdate(data)

    return true
  }

  @Post('/buildingBuff')
  async updateBuildingBuff(@Body(ALL) data: IBuildingBuff.IBuff) {
    await this.buildingBuffService.createOrUpdate(data)

    return true
  }

  @Post('/buildingSkill')
  async updateBuildingSkill(@Body(ALL) data: IBuilding.ISkill) {
    await this.buildingSkillService.createOrUpdate(data)

    return true
  }

  @Post('/patchInfo')
  async updatePatchInfo(
    @Body(ALL) data: { charId: string; info: IPatchInfo.IInfo }
  ) {
    await this.charService.updatePatchData(data.charId, data.info)

    return true
  }

  @Post('/teamInfo')
  async updateTeamInfo(@Body(ALL) data: ITeamInfo.IInfo) {
    await this.teamInfoService.createOrUpdate(data)

    return true
  }

  @Post('/saveChar')
  async saveChar(@Body(ALL) data: { charId: string }) {
    const res = await this.charService.buildCharData(data.charId)

    return res
  }

  @Post('/activity')
  async updateActivity(@Body(ALL) data: IActivityInfo.IInfo) {
    await this.activityService.createOrUpdate(data.id, data)
    return true
  }

  @Post('/gachaPool')
  async updateGachaPool(@Body(ALL) data: IGachaPoolInfo.IInfo) {
    await this.gachaPoolService.createOrUpdate(data.gachaPoolId, data)
  }

  @Post('/gachaPool/name')
  @Validate()
  async updateGachaPoolByName(@Body(ALL) data: UpdateGachaPoolByNameDTO) {
    return this.gachaPoolService.updateByGachaPoolName(
      data.name,
      data.chars,
      data.link
    )
  }

  @Post('/gachaPool/dateRange')
  @Validate()
  async updateGachaPoolByDateRange(
    @Body(ALL)
    data: UpdateGachaPoolByDateRangeDTO
  ) {
    return this.gachaPoolService.updateByDateRange(
      data.startDate,
      data.endDate,
      data.chars,
      data.link
    )
  }

  @Post('/map')
  async updateMap(
    @Body(ALL) data: { levelId: string; data: IStageData.IData }
  ) {
    await this.mapServide.couData(data.levelId, data.data)
    return true
  }

  @Post('/map/info')
  async updateMapInfo(
    @Body(ALL) data: { levelId: string; info: IStageInfo.IStage }
  ) {
    await this.mapServide.couStageInfo(data.levelId, data.info)
    return true
  }

  @Get('/map')
  async getMapById(@Query(ALL) query: { levelId: string }) {
    return await this.mapServide.getMapByLevelId(query.levelId)
  }

  @Post('/enemy')
  async updateEnemy(
    @Body(ALL) data: { data: IEnemyData.IData; info: IEnemyInfo.IInfo }
  ) {
    return await this.enemyService.createOrUpdate(data.data, data.info)
  }
}
