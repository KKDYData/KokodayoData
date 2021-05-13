import { BaseEntity } from './base.e'

import { ISkill } from '@kkdy/data'
import { EntityModel } from '@midwayjs/orm'
import { Column, Index, ManyToMany, JoinTable } from 'typeorm'
import { IActivityInfo } from '@kkdy/data'
import { Provide } from '@midwayjs/decorator'

@EntityModel()
export class GameActivity extends BaseEntity {
  @Column({
    unique: true,
    comment: '类似于 act17.5 这样的',
  })
  actId: string

  @Column({
    type: 'json',
    comment: '基础信息',
  })
  data: IActivityInfo.IInfo
}
