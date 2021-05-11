import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Enemy } from '../../entity/Enemy.e'
import { BaseService } from '../base.s'
import { Repository } from 'typeorm'
import { IEnemyData, IEnemyInfo } from '@kkdy/data'
import { getOrCreateModel } from '../../utils/entity'
import { BaseError } from '../../utils/error'
import { ErrorMap } from '../../utils/ErrorMap'

@Provide()
export class EnemyService extends BaseService {
  @InjectEntityModel(Enemy)
  model: Repository<Enemy>

  async createOrUpdate(data: IEnemyData.IData, info: IEnemyInfo.IInfo) {
    if (data.Key !== info.enemyId) {
      throw BaseError.create(ErrorMap['ERROR_ID'])
    }

    const enemy = await getOrCreateModel(this.model, {
      where: { enemyId: info.enemyId },
    })

    enemy.enemyId = info.enemyId
    enemy.data = data
    enemy.info = info

    await this.model.save(enemy)

    this.coreLogger.info('save buff ' + info.enemyId)
  }

  async getByEnemyId(enemyId: string) {
    return this.model.findOne({
      where: { enemyId },
      relations: ['stageEnemies'],
    })
  }

  async updateEnemyComments(enemyId: string, comments: string[]) {
    const target = await this.model.findOne({ where: { enemyId } })
    target.comments = comments
    await this.model.save(target)
  }
}
