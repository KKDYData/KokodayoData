import { ISkill } from '@kkdy/data'
import { EntityModel } from '@midwayjs/orm'
import { Column, Index, ManyToMany, JoinTable } from 'typeorm'
import { BaseEntity } from './base.e'
import { CharacterData } from './Character.e'

@EntityModel()
export class Skill extends BaseEntity {
  @Column({
    unique: true,
  })
  skillId: string

  @Column({
    type: 'json',
    comment: '技能数据，对应skill_table',
  })
  data: ISkill.ISkill

  @ManyToMany(() => CharacterData, char => char.skills)
  @JoinTable()
  chars: CharacterData[]

  @Column({
    comment: '技能备注',
    type: 'json',
    nullable: true,
  })
  comments: string[]
}
