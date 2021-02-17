import { EntityModel } from '@midwayjs/orm'
import { BaseEntity } from './base.e'

import { Column } from 'typeorm'

@EntityModel()
export class BuildingBuff extends BaseEntity {
  @Column({
    unique: true,
  })
  buffId: string

  @Column({
    type: 'json',
    comment: 'buff data',
  })
  data: string
}
