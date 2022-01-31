import { IChar, IPatchInfo, ICharWordDict } from '@kkdy/data'
import { Inject, Logger } from '@midwayjs/decorator/dist'
import { Provide } from '@midwayjs/decorator/dist'
import { ILogger } from '@midwayjs/logger'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { CharacterData } from '../../entity/Character.e'
import { getOrCreateModel } from '../../utils/entity'
import { BuildingSkillService } from './buildingSkill.s'
import { CharInfoService } from './charInfo.s'
import { CharwordService } from './charword.s'
import { OssService } from '../oss.s'
import { SkillService } from './skill.s'
import { omit, pick } from 'ramda'
import { TeamInfoService } from './teamInfo.s'
import { Context } from '@midwayjs/koa'
import { EquipService } from './equip.s'

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
  teamInfoService: TeamInfoService

  @Inject()
  equipService: EquipService

  @Inject()
  ctx: Context

  @Inject()
  oss: OssService

  async createOrUpdate(
    id: string,
    data: IChar.IData,
    voiceLangDict: ICharWordDict.IDict
  ) {
    const char = await getOrCreateModel(this.model, { where: { charId: id } })

    char.charId = id
    char.data = data
    char.voiceLangDict = voiceLangDict
    char.name = data.name
    char.words = await this.charwordService.getWordsByCharId(char.charId)
    char.skills = await Promise.all(
      Array.from(new Set(data.skills.map(s => s.skillId)).values()).map(s =>
        this.skillService.getSkillById(s)
      )
    )

    char.buildingSkill =
      await this.buildingSkillService.getBuildingSkillByCharId(id)

    char.info = await this.infoService.getCharInfoByCharId(id)

    char.teamInfo = await Promise.all(
      [data.teamId, data.groupId, data.nationId]
        .filter(e => e)
        .map(id => this.teamInfoService.getTeamInfoById(id))
    )
    char.teamInfo.forEach(t => {
      this.ctx.logger.warn(t.powerId, t.id)
    })

    char.equips = await this.equipService.getEquipByCharId(id)

    try {
      await this.model.save(char)
      this.ctx.logger.info('save char ' + data.name + ' , ' + id)
    } catch (err) {
      this.ctx.logger.warn('c ' + data.name + ' ' + id)
      this.ctx.logger.error(err)
    }
  }

  async getCharByCharId(charId: string) {
    return this.model.findOne({
      where: { charId },
      relations: [
        'words',
        'skills',
        'buildingSkill',
        'buildingSkill.buffs',
        'info',
        'teamInfo',
        'relativeChars',
        'equips',
      ],
    })
  }

  async updatePatchData(charId: string, patchInfo: IPatchInfo.IInfo) {
    const data = await this.getCharByCharId(charId)
    if (!data) throw new Error('no this char ' + charId)
    data.patchInfo = patchInfo
    await this.model.save(data)

    this.ctx.logger.info('save patch data of ' + charId)
  }

  async buildCharData(charId: string) {
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
      relativeChars,
      charComment,
      equips,
      voiceLangDict,
    } = modelData

    const res = {
      data,
      patchInfo,
      skills: skills.map(s => pick(['comments', 'data'], s)),
      buildings: buildingSkill?.data,
      buildingBuffs: buildingSkill?.buffs.map(b => b.data),
      info: info?.data,
      words: words.map(w => w.data),
      teamInfo: teamInfo.map(i => i.data),
      relativeChars: relativeChars?.map(c => c.charId),
      charComment,
      equips,
      voiceLangDict,
    }

    return res
  }

  async listCharacters() {
    const list = await this.model.find({
      select: ['charId', 'updatedDate', 'version', 'installId', 'name', 'data'],
      relations: ['teamInfo'],
    })

    return list.map(char => ({
      ...omit(['data', 'teamInfo'], char),
      ...pick(
        ['tagList', 'rarity', 'profession', 'subProfessionId'],
        char.data
      ),
      teamInfo: char.teamInfo.map(info => omit(['color'], info.data)),
      enName: char.data.appellation,
    }))
  }

  async updateRelativeChar(id: string, relativeId: string) {
    const target = await this.model.findOne({
      where: { charId: id },
      relations: ['relativeChars'],
    })
    const relativieTarget = await this.model.findOne({
      where: { charId: relativeId },
      relations: ['relativeChars'],
    })

    // 双绑
    if (!target.relativeChars.find(char => char.charId === relativeId)) {
      target.relativeChars.push(relativieTarget)
    }

    if (!relativieTarget.relativeChars.find(char => char.charId === id)) {
      relativieTarget.relativeChars.push(target)
    }

    await this.model.save(target)
    await this.model.save(relativieTarget)
  }

  async updateCharComment(id: string, comment: string) {
    const target = await this.model.findOne({ where: { charId: id } })
    target.charComment = comment
    await this.model.save(target)
  }
}
