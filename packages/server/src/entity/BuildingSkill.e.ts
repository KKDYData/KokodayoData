import { EntityModel } from '@midwayjs/orm'
import { BaseEntity } from './base.e'
import { Column, Index, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { BuildingBuff } from './BuildingBuff.e'

@EntityModel()
export class BuildingSkill extends BaseEntity {
  @Column({
    unique: true,
  })
  charId: string

  @Column({
    type: 'json',
  })
  data: string

  @ManyToMany(() => BuildingBuff)
  @JoinTable()
  buffs: BuildingBuff[]
}
