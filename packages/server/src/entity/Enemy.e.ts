import { BaseEntity } from './base.e'
import { Column, OneToOne, Index, JoinColumn } from 'typeorm'
import { EntityModel } from '@midwayjs/orm'
import { IEnemyData } from '@kkdy/data'

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
}
