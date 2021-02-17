import { EntityModel } from '@midwayjs/orm'
import { Column } from 'typeorm'
import { BaseEntity } from './base.e'

@EntityModel()
export class CharInfo extends BaseEntity {
  @Column({
    unique: true,
  })
  charId: string

  @Column({
    type: 'json',
    comment: '干员基础数据，对应character_table',
  })
  data: string
}
