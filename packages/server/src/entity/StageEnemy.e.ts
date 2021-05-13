import { EntityModel } from '@midwayjs/orm'
import { BaseEntity } from './base.e'
import { Column, Index, JoinTable, ManyToOne } from 'typeorm'
import { IStageData } from '@kkdy/data'
import { Enemy } from './Enemy.e'
import { StageData } from './StageData.e'

@EntityModel()
export class StageEnemy extends BaseEntity {
  @Column()
  level: number

  @Column({
    type: 'json',
    comment: 'overwrittenData',
    nullable: true,
  })
  data: IStageData.OverwrittenData

  @ManyToOne(() => Enemy, e => e.stageEnemies)
  enemy: Enemy

  @Column({ nullable: true })
  enemyRawId: string

  @ManyToOne(() => StageData, e => e.stageEnemies)
  stage: StageData

  @Column({ nullable: true })
  stageLevelId: string
}
