import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { StageInfo } from '../../entity/StageInfo.e'
import { BaseService } from '../base.s'
import { Repository } from 'typeorm'
import { StageData } from '../../entity/StageData.e'
import { IStageData, IStageInfo } from '@kkdy/data'
import { getOrCreateModel } from '../../utils/entity'
import { BaseError } from '../../utils/error'
import { ErrorMap } from '../../utils/ErrorMap'

@Provide()
export class MapService extends BaseService {
  @InjectEntityModel(StageInfo)
  infoModel: Repository<StageInfo>

  @InjectEntityModel(StageData)
  dataModel: Repository<StageData>

  async couData(levelId: string, data: IStageData.IData) {
    const dataModel = await getOrCreateModel(this.dataModel, {
      where: {
        levelId,
      },
    })

    dataModel.levelId = levelId
    dataModel.data = data
    await this.dataModel.save(dataModel)

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
}
