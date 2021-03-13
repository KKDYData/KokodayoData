import { Logger, Provide } from '@midwayjs/decorator'
import { BaseService } from '../base.s'
import { IChar, ICharInfo } from '@kkdy/data'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { CharInfo } from '../../entity/CharInfo.e'
import { ILogger } from '@midwayjs/logger'
import { getOrCreateModel } from '../../utils/entity'

@Provide()
export class CharInfoService extends BaseService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(CharInfo)
  model: Repository<CharInfo>

  async createOrUpdate (data: ICharInfo.IInfo) {
    const info = await getOrCreateModel(this.model, {
      where: { charId: data.charID },
    })

    info.charId = data.charID
    info.data = data

    await this.model.save(info)

    this.coreLogger.info('save info ' + data.charID)
  }

  async getCharInfoByCharId (charId: string) {
    return this.model.findOne({ where: { charId } })
  }
}
