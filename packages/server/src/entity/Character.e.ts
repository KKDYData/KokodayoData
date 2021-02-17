import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm'
import { BaseEntity } from './base.e'
import { BuildingSkill } from './BuildingSkill.e'
import { CharInfo } from './CharInfo.e'
import { Charword } from './Charword.e'
import { Skill } from './Skill.e'

@EntityModel()
export class CharacterData extends BaseEntity {
  @Column({
    unique: true,
  })
  charId: string

  @Column({
    unique: true,
    comment: '升变id，阿米娅专属',
    nullable: true,
  })
  patchId: string

  @Column({
    type: 'json',
    comment: '干员基础数据，对应character_table',
  })
  data: string

  @OneToMany(
    () => Charword,
    word => word.character
  )
  @JoinColumn()
  words: Charword[]

  @OneToOne(() => CharInfo)
  info: CharInfo

  @OneToOne(() => BuildingSkill)
  buildingSkill: BuildingSkill

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[]
}
