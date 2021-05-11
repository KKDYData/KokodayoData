import { BaseEntity } from './base.e'
import { Column, ManyToMany, Index, OneToMany, JoinTable } from 'typeorm'
import { IStageData, IStageInfo } from '@kkdy/data'
import { EntityModel } from '@midwayjs/orm'
import { StageInfo } from './StageInfo.e'
import { Enemy } from './Enemy.e'
import { StageEnemy } from './StageEnemy.e'

@EntityModel()
export class StageData extends BaseEntity {
  @Column({
    unique: true,
  })
  levelId: string

  @Column({
    comment: '地图数据',
    nullable: true,
    type: 'json',
  })
  data: IStageData.IData

  @OneToMany(() => StageInfo, info => info.stageData)
  @JoinTable()
  stageInfos: StageInfo[]

  @OneToMany(() => StageEnemy, e => e.stage)
  stageEnemies: StageEnemy[]
}
