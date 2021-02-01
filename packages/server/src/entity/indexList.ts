import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryGeneratedColumn } from 'typeorm'

@EntityModel('kkdy_index_list')
export class IndexList {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 32,
    unique: true,
  })
  name: string

  @Column({
    length: 255,
  })
  key: string

  @Column({
    type: 'datetime',
  })
  update_time: Date
}
