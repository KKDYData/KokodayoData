import { EntityModel } from '@midwayjs/orm'
import { Column, ManyToOne, Index } from 'typeorm'
import { BaseEntity } from './base.e'
import { CharacterData } from './Character.e'

@EntityModel()
export class Charword extends BaseEntity {
  @Column({
    unique: true,
  })
  charWordId: string

  @Index()
  @Column()
  charId: string

  @ManyToOne(
    () => CharacterData,
    char => char.words
  )
  character: CharacterData

  @Column({
    type: 'json',
    comment: '干员台词数据，对应character_table',
  })
  data: string
}
