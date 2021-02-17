import { Char, Skill } from '@kkdy/data'
import { Inject, Logger } from '@midwayjs/decorator/dist'
import { Provide } from '@midwayjs/decorator/dist'
import { ILogger } from '@midwayjs/logger'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { CharacterData } from '../entity/Character.e'
import { CharwordService } from './charword.s'
import { SkillService } from './skill.s'
@Provide()
export class CharService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(CharacterData)
  model: Repository<CharacterData>

  @Inject()
  charwordService: CharwordService

  @Inject()
  skillService: SkillService

  // @Inject()
  // infoService:Info

  async createOrUpdate(id: string, data: Char.IData) {
    const char =
      (await this.model.findOne({ where: { charId: id } })) ??
      new CharacterData()

    char.charId = id
    char.data = JSON.stringify(data)
    char.words = await this.charwordService.getWordsByCharId(char.charId)
    char.skills = await Promise.all(
      Array.from(new Set(data.skills.map(s => s.skillId)).values())
        .map(s =>
          this.skillService.getSkillById(s).catch(err => {
            this.coreLogger.warn('c ', data.name, ' ', id)
            this.coreLogger.error(err)
            return false
          })
        )
        .filter(e => e) as any[]
    )

    try {
      await this.model.save(char)
      this.coreLogger.info('save char ', data.name + ' , ' + id)
    } catch (err) {
      this.coreLogger.warn('c ', data.name, ' ', id)
      this.coreLogger.error(err)
    }
  }

  async getCharByCharId(charId: string) {
    return this.model.findOne({
      where: { charId },
      relations: ['words', 'skills'],
    })
  }

  async saveCharData(charId: string) {
    const data = await this.model.findOne({
      where: {
        charId,
      },
    })
    if (!data) throw new Error('no char')
    const baseData = JSON.parse(data.data) as Char.IData
    const skills = data.skills.map(s => JSON.parse(s.data)) as Skill.ISkill[]
    const buildings = JSON.parse(data.buildingSkill.data)
    const res = {
      ...baseData,
    }
  }
}
