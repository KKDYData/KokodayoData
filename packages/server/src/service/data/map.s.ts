import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { StageInfo } from '../../entity/StageInfo.e'
import { BaseService } from '../base.s'
import { Repository } from 'typeorm'
import { StageData } from '../../entity/StageData.e'
import { IStageData, IStageInfo } from '@kkdy/data'
import { getOrCreateModel } from '../../utils/entity'
import { BaseError } from '../../utils/error'
import { ErrorMap } from '../../utils/ErrorMap'
import { EnemyService } from './enemy.s'
import { StageEnemyService } from './stageEnemy.s'

@Provide()
export class MapService extends BaseService {
  @InjectEntityModel(StageInfo)
  infoModel: Repository<StageInfo>

  @InjectEntityModel(StageData)
  dataModel: Repository<StageData>

  @Inject()
  enemyService: EnemyService

  @Inject()
  stageEnemyService: StageEnemyService

  async couData(levelId: string, data: IStageData.IData) {
    const dataModel = await getOrCreateModel(this.dataModel, {
      where: {
        levelId,
      },
    })

    dataModel.levelId = levelId
    dataModel.data = data
    await this.dataModel.save(dataModel)

    // dataModel.stageEnemies
    await Promise.all(
      data.enemyDbRefs
        .filter(e => e.useDb)
        .map(async e => {
          const enemyModel = await this.enemyService.getByEnemyId(e.id)
          if (!enemyModel)
            throw BaseError.create({ code: -405, msg: `找不到${e.id}这个敌人` })
          const stageEnemy = await this.stageEnemyService.getOrCreate(
            data.levelId,
            enemyModel.enemyId
          )
          stageEnemy.enemy = enemyModel
          stageEnemy.stage = dataModel
          stageEnemy.level = e.level
          stageEnemy.data = e.overwrittenData
          stageEnemy.stageLevelId = levelId
          stageEnemy.enemyRawId = e.id
          return this.stageEnemyService.save(stageEnemy)
        })
    )

    this.coreLogger.info('save map ' + levelId)
  }

  async couStageInfo(levelId: string, info: IStageInfo.IStage) {
    const dataModel = await this.dataModel.findOne({ where: { levelId } })

    const infoModel = await getOrCreateModel(this.infoModel, {
      where: { stageId: info.stageId },
    })

    infoModel.stageId = info.stageId
    infoModel.levelId = levelId
    infoModel.data = info
    const res = await this.infoModel.save(infoModel)

    if (!dataModel) {
      throw BaseError.create({
        code: -406,
        msg: `找不到地图，请确认levelId:${levelId}`,
      })
    }

    // 放置数据
    if (!dataModel.stageInfos) dataModel.stageInfos = []
    dataModel.stageInfos.push(res)

    await this.dataModel.save(dataModel)
  }

  async getMapByLevelId(levelId: string) {
    const data = await this.dataModel.findOne({
      where: { levelId: levelId },
      relations: ['stageInfos'],
    })
    if (!data) throw BaseError.create(ErrorMap['NO_DATA'])
    return data
  }

  async listMap() {
    const stages = await this.dataModel.find({ relations: ['stageInfos'] })
    return stages.map(stage => {
      const { levelId, stageInfos, data } = stage
      return {
        levelId,
        stageInfos,
      }
    })
  }
}
