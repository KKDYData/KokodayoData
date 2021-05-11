import { BaseEntity } from './base.e'
import { Column, ManyToOne, Index, JoinColumn } from 'typeorm'
import { IStageInfo } from '@kkdy/data'
import { StageData } from './StageData.e'
import { EntityModel } from '@midwayjs/orm'

@EntityModel()
export class StageInfo extends BaseEntity {
  @Column({
    unique: true,
  })
  stageId: string

  @Column()
  @Index()
  levelId: string

  @Column({
    comment: '地图索引',
    nullable: true,
    type: 'json',
  })
  data: IStageInfo.IStage

  @ManyToOne(() => StageData, data => data.stageInfos)
  stageData: StageData
}
