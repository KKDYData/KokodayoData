import { IChar, IPatchInfo } from '@kkdy/data'
import { IWord } from '@kkdy/data/lib/CharWord'
import { Inject, Logger } from '@midwayjs/decorator/dist'
import { Provide } from '@midwayjs/decorator/dist'
import { ILogger } from '@midwayjs/logger'
import { InjectEntityModel } from '@midwayjs/orm'
import { IMidwayWebContext } from '@midwayjs/web'
import { Repository } from 'typeorm'
import { CharacterData } from '../../entity/Character.e'
import { Skill } from '../../entity/Skill.e'
import { getOrCreateModel } from '../../utils/entity'
import { BuildingSkillService } from './buildingSkill.s'
import { CharInfoService } from './charInfo.s'
import { CharwordService } from './charword.s'
import { OssService } from '../oss.s'
import { SkillService } from './skill.s'

@Provide()
export class CharService {
  @InjectEntityModel(CharacterData)
  model: Repository<CharacterData>

  @Inject()
  charwordService: CharwordService

  @Inject()
  skillService: SkillService

  @Inject()
  buildingSkillService: BuildingSkillService

  @Inject()
  infoService: CharInfoService

  @Inject()
  ctx: IMidwayWebContext

  @Inject()
  oss: OssService

  async createOrUpdate (id: string, data: IChar.IData) {
    const char = await getOrCreateModel(this.model, { where: { charId: id } })

    char.charId = id
    char.data = data
    char.words = await this.charwordService.getWordsByCharId(char.charId)
    char.skills = await Promise.all(
      Array.from(new Set(data.skills.map(s => s.skillId)).values()).map(s =>
        this.skillService.getSkillById(s)
      )
    )

    char.buildingSkill = await this.buildingSkillService.getBuildingSkillByCharId(
      id
    )

    char.info = await this.infoService.getCharInfoByCharId(id)

    try {
      await this.model.save(char)
      this.ctx.logger.info('save char ' + data.name + ' , ' + id)
    } catch (err) {
      this.ctx.logger.warn('c ' + data.name + ' ' + id)
      this.ctx.logger.error(err)
    }
  }

  async getCharByCharId (charId: string) {
    return this.model.findOne({
      where: { charId },
      relations: [
        'words',
        'skills',
        'buildingSkill',
        'buildingSkill.buffs',
        'info',
        'teamInfo',
      ],
    })
  }

  async updatePatchData (charId: string, patchInfo: IPatchInfo.IInfo) {
    const data = await this.getCharByCharId(charId)
    if (!data) throw new Error('no this char ' + charId)
    data.patchInfo = patchInfo
    await this.model.save(data)

    this.ctx.logger.info('save patch data of ' + charId)
  }

  async buildCharData (charId: string) {
    const modelData = await this.getCharByCharId(charId)
    if (!modelData) throw new Error('no char')

    const {
      buildingSkill,
      patchInfo,
      info,
      skills,
      words,
      data,
      teamInfo,
    } = modelData

    const res = {
      ...data,
      patchInfo,
      skills: skills.map(s => s.data),
      buildings: buildingSkill.data,
      buildingBuffs: buildingSkill.buffs.map(b => b.data),
      info: info.data,
      words: words.map(w => w.data),
      teamInfo,
    }

    return res
  }
}
