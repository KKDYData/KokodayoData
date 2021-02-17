import { EntityModel } from '@midwayjs/orm'
import { Column, Index } from 'typeorm'
import { BaseEntity } from './base.e'

@EntityModel()
export class Skill extends BaseEntity {
  @Index()
  @Column({
    unique: true,
  })
  skillId: string

  @Column({
    type: 'json',
    comment: '技能数据，对应skill_table',
  })
  data: string
}
