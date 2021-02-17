import { Logger, Provide } from '@midwayjs/decorator'
import { ILogger } from '@midwayjs/logger'
import { InjectEntityModel } from '@midwayjs/orm'
import { Skill } from '../entity/Skill.e'
import { Repository } from 'typeorm'
import { Skill as ISkill } from '@kkdy/data'

@Provide()
export class SkillService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(Skill)
  model: Repository<Skill>

  async createOrUpdate(data: ISkill.ISkill) {
    const skill =
      (await this.model.findOne({ where: { skillId: data.skillId } })) ??
      new Skill()

    skill.skillId = data.skillId
    skill.data = JSON.stringify(data)

    await this.model.save(skill)

    this.coreLogger.info('save skill ' + skill.skillId)
  }

  async getSkillById(skillId: string) {
    return this.model.findOne({ where: { skillId } })
  }
}
