import { BaseEntity } from './base.e'

import { IGachaPoolInfo } from '@kkdy/data'
import { EntityModel } from '@midwayjs/orm'
import { Column, Index, ManyToMany, JoinTable } from 'typeorm'
import { CharacterData } from './Character.e'

@EntityModel()
export class GachaPool extends BaseEntity {
  @Column({
    comment: '卡池序号，可以重复，例如1',
  })
  gachaIndex: number

  @Column({
    comment: '卡池 id',
    unique: true,
  })
  gachaPoolId: string

  @Index()
  @Column()
  gachaRuleType: IGachaPoolInfo.GachaRuleType

  @Column({
    type: 'json',
    comment: '基础信息',
  })
  data: IGachaPoolInfo.IInfo

  @ManyToMany(() => CharacterData, char => char.relativeGachPools)
  @JoinTable()
  relativeChars: CharacterData[]

  @Column({
    nullable: true,
  })
  link: string
}
