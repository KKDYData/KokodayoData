import { Logger, Provide } from '@midwayjs/decorator'
import { ILogger } from '@midwayjs/logger'
import { InjectEntityModel } from '@midwayjs/orm'
import { Skill } from '../../entity/Skill.e'
import { Repository } from 'typeorm'
import { ISkill } from '@kkdy/data'
import { getOrCreateModel } from '../../utils/entity'

@Provide()
export class SkillService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(Skill)
  model: Repository<Skill>

  async createOrUpdate(data: ISkill.ISkill) {
    const skill = await getOrCreateModel(this.model, {
      where: { skillId: data.skillId },
    })

    skill.skillId = data.skillId
    skill.data = data

    await this.model.save(skill)

    this.coreLogger.info('save skill ' + skill.skillId)
  }

  async getSkillById(skillId: string) {
    return this.model.findOne({ where: { skillId } })
  }

  async getSkillByIdWithChars(skillId: string) {
    return this.model.findOne({ where: { skillId }, relations: ['chars'] })
  }

  async updateSkillComment(skillId: string, comment: string[]) {
    const target = await this.model.findOne({ where: { skillId } })
    target.comments = comment
    await this.model.save(target)
  }
}
