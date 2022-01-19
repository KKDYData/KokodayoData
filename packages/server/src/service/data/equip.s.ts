import { Logger, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { IBattleEquip, IUniEquip } from '@kkdy/data'
import { ILogger } from '@midwayjs/logger'
import { getOrCreateModel } from '../../utils/entity'
import { Equip } from '../../entity/Equip.e'

@Provide()
export class EquipService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(Equip)
  model: Repository<Equip>

  async createOrUpdate(info: IUniEquip.IInfo, data: IBattleEquip.IData) {
    const equip = await getOrCreateModel(this.model, {
      where: { equipId: info.uniEquipId },
    })

    equip.data = data
    equip.info = info
    equip.data = data
    equip.charId = info.charId
    equip.equipId = info.uniEquipId

    await this.model.save(equip)

    this.coreLogger.info('save equip ' + equip.equipId + ' !')
  }

  async getEquipByCharId(charId: string) {
    return this.model.find({ where: { charId } })
  }
}
