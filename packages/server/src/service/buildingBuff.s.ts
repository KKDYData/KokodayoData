import { Provide } from '@midwayjs/decorator'
import { BaseService } from './base.s'
import { Repository } from 'typeorm'
import { EntityModel, InjectEntityModel } from '@midwayjs/orm'
import { IBuildingBuff } from '@kkdy/data'
import { BuildingBuff } from '../entity/BuildingBuff.e'
import { getOrCreateModel } from '../utils/entity'
import { Logger } from '@midwayjs/decorator'
import { ILogger } from '@midwayjs/logger'

@Provide()
export class BuildingBuffService extends BaseService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(BuildingBuff)
  model: Repository<BuildingBuff>

  async createOrUpdate(data: IBuildingBuff.IBuff) {
    const buff = await getOrCreateModel(this.model, {
      where: { buffId: data.buffId },
    })

    buff.buffId = data.buffId
    buff.data = data

    await this.model.save(buff)

    this.coreLogger.info('save buff ' + data.buffId)
  }

  async getBuildingBuffByBuffId(buffId: string) {
    return this.model.findOne({ where: { buffId } })
  }
}
