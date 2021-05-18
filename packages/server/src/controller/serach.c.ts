import {
  ALL,
  Controller,
  Get,
  Inject,
  Provide,
  Query,
} from '@midwayjs/decorator'
import { SkillService } from '../service/data/skill.s'

@Provide()
@Controller('/s')
export class SerachController {
  @Inject()
  skillService: SkillService

  @Get('/skill')
  async getSkillById(@Query(ALL) query: { skillId: string }) {
    const raw = await this.skillService.getSkillByIdWithChars(query.skillId)
    const { skillId, data, chars } = raw

    return {
      skillId,
      data,
      chars: chars.map(c => c.data),
    }
  }
}
