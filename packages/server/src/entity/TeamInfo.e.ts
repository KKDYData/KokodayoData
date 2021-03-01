import { EntityModel } from '@midwayjs/orm'
import { BaseEntity } from './base.e'
import { Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { ITeamInfo } from '@kkdy/data'
import { CharacterData } from './Character.e'

@EntityModel()
export class TeamInfo extends BaseEntity {
  @Column({
    unique: true,
  })
  powerId: string

  @Column({
    type: 'json',
    comment: 'teamInfo',
  })
  data: ITeamInfo.IInfo

  @ManyToMany(
    () => CharacterData,
    char => char.teamInfo
  )
  @JoinTable()
  chars: CharacterData[]
}
