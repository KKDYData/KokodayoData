import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { GameActivity } from '../../entity/GameActivity.e'
import { Repository } from 'typeorm'
import { IActivityInfo } from '@kkdy/data'
import { getOrCreateModel } from '../../utils/entity'

@Provide()
export class GameActivityService {
  @InjectEntityModel(GameActivity)
  model: Repository<GameActivity>

  async createOrUpdate(id: string, data: IActivityInfo.IInfo) {
    const info = await getOrCreateModel(this.model, { where: { actId: id } })

    info.actId = id
    info.data = data

    return this.model.save(info)
  }

  async listGameActivity() {
    const acts = await this.model.find()
    return acts.map(a => a.data)
  }
}
