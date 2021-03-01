import { EntityModel } from '@midwayjs/orm'
import { BaseEntity } from './base.e'

import { Column } from 'typeorm'
import { IBuildingBuff } from '@kkdy/data'

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
  data: IBuildingBuff.IBuff
}
