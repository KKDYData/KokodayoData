import { IChar, IPatchInfo } from '@kkdy/data'
import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm'
import { BaseEntity } from './base.e'
import { BuildingSkill } from './BuildingSkill.e'
import { CharInfo } from './CharInfo.e'
import { Charword } from './Charword.e'
import { GachaPool } from './GachaPool.e'
import { Skill } from './Skill.e'
import { TeamInfo } from './TeamInfo.e'

@EntityModel()
export class CharacterData extends BaseEntity {
  @Column({
    unique: true,
  })
  charId: string

  @Index()
  @Column({})
  name: string

  @Column({
    comment: '升变信息',
    nullable: true,
    type: 'json',
  })
  patchInfo?: IPatchInfo.IInfo

  @Column({
    comment: '实装活动id',
    default: '',
  })
  installId: string

  @Column({
    comment: '角色备注',
    default: '',
  })
  charComment: string

  @Column({
    type: 'json',
    comment: '干员基础数据，对应character_table',
  })
  data: IChar.IData

  @ManyToMany(() => CharacterData, char => char.relativeChars)
  @JoinTable()
  relativeChars: CharacterData[]

  @OneToMany(() => Charword, word => word.character)
  @JoinColumn()
  words: Charword[]

  @OneToOne(() => CharInfo)
  @JoinColumn()
  info: CharInfo

  @OneToOne(() => BuildingSkill)
  @JoinColumn()
  buildingSkill: BuildingSkill

  @ManyToMany(() => Skill, skill => skill.chars)
  skills: Skill[]

  @ManyToMany(() => TeamInfo, info => info.chars)
  teamInfo: TeamInfo[]

  @ManyToMany(() => GachaPool, pool => pool.relativeChars)
  relativeGachPools: GachaPool[]
}
