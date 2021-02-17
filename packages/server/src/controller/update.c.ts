import { CharWord, Char, Skill, CharInfo } from '@kkdy/data'
import { ALL, Get, Query } from '@midwayjs/decorator'
import { Body, Controller, Inject, Post, Provide } from '@midwayjs/decorator'
import { CharService } from '../service/char.s'
import { CharInfoService } from '../service/charInfo.s'
import { CharwordService } from '../service/charword.s'
import { SkillService } from '../service/skill.s'

@Provide()
@Controller('/update')
export class UpdateController {
  @Inject()
  charwordService: CharwordService

  @Inject()
  charService: CharService

  @Inject()
  skillService: SkillService

  @Inject()
  charInfoService: CharInfoService

  @Post('/charword')
  async updateCharword(@Body(ALL) data: CharWord.IWord) {
    await this.charwordService.createOrUpdate(data)

    return true
  }

  @Post('/char')
  async updateChar(@Body(ALL) data: { id: string; data: Char.IData }) {
    await this.charService.createOrUpdate(data.id, data.data)

    return true
  }

  @Get('/char')
  async getChar(@Query(ALL) q: { id: string }) {
    const data = await this.charService.getCharByCharId(q.id)

    return data
  }

  @Post('/skill')
  async updateSkill(@Body(ALL) data: Skill.ISkill) {
    await this.skillService.createOrUpdate(data)

    return true
  }

  @Post('/charInfo')
  async updateCharInfo(@Body(ALL) data: CharInfo.IInfo) {
    await this.charInfoService.createOrUpdate(data)

    return true
  }
}
