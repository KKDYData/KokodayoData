import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { BaseService } from '../base.s'
import { Repository } from 'typeorm'
import { getOrCreateModel } from '../../utils/entity'
import { StageEnemy } from '../../entity/StageEnemy.e'

@Provide()
export class StageEnemyService extends BaseService {
  @InjectEntityModel(StageEnemy)
  model: Repository<StageEnemy>

  // createOrUpdate()
  getOrCreate(stageLevelId: string, enemyRawId: string) {
    return getOrCreateModel(this.model, {
      where: {
        stageLevelId,
        enemyRawId,
      },
    })
  }

  save(model: StageEnemy) {
    return this.model.save(model)
  }
}
