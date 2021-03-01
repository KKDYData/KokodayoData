import { EntityModel } from '@midwayjs/orm'
import { BaseEntity } from './base.e'
import { Column, Index, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { BuildingBuff } from './BuildingBuff.e'
import { IBuilding } from '@kkdy/data'

@EntityModel()
export class BuildingSkill extends BaseEntity {
  @Column({
    unique: true,
  })
  charId: string

  @Column({
    type: 'json',
  })
  data: IBuilding.ISkill

  @ManyToMany(() => BuildingBuff)
  @JoinTable()
  buffs: BuildingBuff[]
}
