import { BaseEntity } from './base.e'
import { Column, Index, OneToMany, JoinTable } from 'typeorm'
import { EntityModel } from '@midwayjs/orm'
import { User } from './User.e'

@EntityModel()
export class Nickname extends BaseEntity {
  @Column({
    unique: true,
  })
  nickname: string

  @Column({
    type: 'int',
  })
  num: number

  @OneToMany(() => User, user => user.nickname)
  users: User[]
}
