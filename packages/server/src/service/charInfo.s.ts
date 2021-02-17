import { Logger, Provide } from '@midwayjs/decorator'
import { BaseService } from './base.s'
import { Char, CharInfo as ICharInfo } from '@kkdy/data'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { CharInfo } from '../entity/CharInfo.e'
import { ILogger } from '@midwayjs/logger'

@Provide()
export class CharInfoService extends BaseService {
  // @Logger()
  // coreLogger: ILogger

  @InjectEntityModel(CharInfo)
  model: Repository<CharInfo>

  async createOrUpdate(data: ICharInfo.IInfo) {
    const info =
      (await this.model.findOne({ where: { charId: data.charID } })) ??
      new CharInfo() // return

    info.charId = data.charID
    info.data = JSON.stringify(data)

    await this.model.save(info)

    this.coreLogger.info('save info ' + data.charID)
  }
}
