import { BaseEntity } from './base.e'
import { Column, Index, JoinTable, OneToMany } from 'typeorm'
import { EntityModel } from '@midwayjs/orm'
import { IEnemyData, IEnemyInfo } from '@kkdy/data'
import { StageData } from './StageData.e'
import { StageEnemy } from './StageEnemy.e'

@EntityModel()
export class Enemy extends BaseEntity {
  @Column({
    unique: true,
  })
  enemyId: string

  @Column({
    comment: '敌人数据',
    nullable: true,
    type: 'json',
  })
  data: IEnemyData.IData

  @Column({
    comment: 'info',
    nullable: true,
    type: 'json',
  })
  info: IEnemyInfo.IInfo

  @OneToMany(() => StageEnemy, stage => stage.enemy)
  stageEnemies: StageData[]

  @Column({
    comment: '评论、注释',
    type: 'json',
    nullable: true,
  })
  comments: string[]
}
