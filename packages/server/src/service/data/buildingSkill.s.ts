import { Inject, Logger, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { BuildingSkill } from '../../entity/BuildingSkill.e'
import { BaseService } from '../base.s'
import { IBuilding } from '@kkdy/data'
import { BuildingBuffService } from './buildingBuff.s'
import { ILogger } from '@midwayjs/logger'
import { getOrCreateModel } from '../../utils/entity'

@Provide()
export class BuildingSkillService extends BaseService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(BuildingSkill)
  model: Repository<BuildingSkill>

  @Inject()
  buildingBuffService: BuildingBuffService

  async createOrUpdate (data: IBuilding.ISkill) {
    const skill = await getOrCreateModel(this.model, {
      where: { charId: data.charId },
    })

    skill.charId = data.charId
    skill.data = data
    skill.buffs = await Promise.all(
      data.buffChar
        .map(bc => bc.buffData.map(s => s.buffId))
        .flat()
        .map(id => this.buildingBuffService.getBuildingBuffByBuffId(id))
    )

    await this.model.save(skill)

    this.coreLogger.info('save skill ' + data.charId)
  }

  async getBuildingSkillByCharId (charId: string) {
    return this.model.findOne({ where: { charId }, relations: [ 'buffs' ] })
  }
}
