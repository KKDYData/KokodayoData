import { BaseEntity } from './base.e'
import { Column, Index, ManyToOne, JoinTable } from 'typeorm'
import { Nickname } from './Nickname.e'
import { EntityModel } from '@midwayjs/orm'

@EntityModel()
export class User extends BaseEntity {
  @Column({
    unique: true,
    comment: '微信id',
  })
  wxId: string

  @Column({
    comment: '昵称',
    nullable: true,
  })
  nickname: string

  @ManyToOne(() => Nickname, nickname => nickname.users)
  nicknameRaw: Nickname
}
