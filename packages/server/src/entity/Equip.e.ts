import { IBattleEquip, IUniEquip } from '@kkdy/data'
import { EntityModel } from '@midwayjs/orm'
import { Column, Index, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.e'
import { CharacterData } from './Character.e'

@EntityModel()
export class Equip extends BaseEntity {
  @Column({
    unique: true,
  })
  equipId: string

  @Index()
  @Column()
  charId: string

  @ManyToOne(() => CharacterData, char => char.equips)
  character: CharacterData

  @Column({
    type: 'json',
  })
  info: IUniEquip.IInfo

  @Column({
    type: 'json',
    comment: '干员基础数据，对应character_table',
  })
  data: IBattleEquip.IData
}
