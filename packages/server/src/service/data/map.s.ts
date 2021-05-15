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
import { RedisService } from '../redis.s'

const { StageType } = IStageInfo

const MAP_LIST = 'MAP_LIST'

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

  @Inject()
  redisService: RedisService

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
    const dataModel = await this.dataModel.findOne({
      where: { levelId },
      relations: ['stageInfos'],
    })

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
    console.log('link ', levelId)
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
    let list: {
      levelId: string
      label: string
      stageType: IStageInfo.StageType | (string & {})
      hardStagedId: string
    }[] = JSON.parse(await this.redisService.client.get(MAP_LIST)) ?? []

    if (list?.length) {
      return list
    }

    const stages = await this.dataModel.find({ relations: ['stageInfos'] })
    list = stages.map(stage => {
      const { levelId, stageInfos, data } = stage
      let label = ''
      let stageType: IStageInfo.StageType | (string & {})
      let hardStagedId = ''

      label = stageInfos.find(info => info.data.code)?.data.code
      stageType =
        stageInfos.find(info => info.data.stageType)?.data.stageType ||
        (levelId.includes('act')
          ? IStageInfo.StageType.Activity
          : levelId.split('_')[1])

      hardStagedId = stageInfos.find(info => info.data.hardStagedId)?.data
        .hardStagedId

      return {
        levelId,
        label,
        stageType,
        hardStagedId,
      }
    })

    this.redisService.client.setex(MAP_LIST, 60 * 5, JSON.stringify(list))

    return list
  }
}
