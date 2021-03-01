import {
  ICharWord,
  IChar,
  ISkill,
  ICharInfo,
  IBuildingBuff,
  IBuilding,
  IPatchInfo,
  ITeamInfo,
} from '@kkdy/data'
import { ALL, Get, Query } from '@midwayjs/decorator'
import { Body, Controller, Inject, Post, Provide } from '@midwayjs/decorator'
import { BuildingSkillService } from '../service/buildingSkill.s'
import { BuildingBuffService } from '../service/buildingBuff.s'
import { CharService } from '../service/char.s'
import { CharInfoService } from '../service/charInfo.s'
import { CharwordService } from '../service/charword.s'
import { SkillService } from '../service/skill.s'
import { OssService } from '../service/oss.s'
import { TeamInfoService } from '../service/teamInfo.s'

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

  @Inject()
  buildingBuffService: BuildingBuffService

  @Inject()
  buildingSkillService: BuildingSkillService

  @Inject()
  teamInfoService: TeamInfoService

  @Inject()
  ossService: OssService

  @Post('/charword')
  async updateCharword(@Body(ALL) data: ICharWord.IWord) {
    await this.charwordService.createOrUpdate(data)

    return true
  }

  @Post('/char')
  async updateChar(@Body(ALL) data: { id: string; data: IChar.IData }) {
    await this.charService.createOrUpdate(data.id, data.data)

    return true
  }

  @Get('/char')
  async getChar(@Query(ALL) q: { id: string }) {
    const data = await this.charService.getCharByCharId(q.id)

    return data
  }

  @Post('/skill')
  async updateSkill(@Body(ALL) data: ISkill.ISkill) {
    await this.skillService.createOrUpdate(data)

    return true
  }

  @Post('/charInfo')
  async updateCharInfo(@Body(ALL) data: ICharInfo.IInfo) {
    await this.charInfoService.createOrUpdate(data)

    return true
  }

  @Post('/buildingBuff')
  async updateBuildingBuff(@Body(ALL) data: IBuildingBuff.IBuff) {
    await this.buildingBuffService.createOrUpdate(data)

    return true
  }

  @Post('/buildingSkill')
  async updateBuildingSkill(@Body(ALL) data: IBuilding.ISkill) {
    await this.buildingSkillService.createOrUpdate(data)

    return true
  }

  @Post('/patchInfo')
  async updatePatchInfo(
    @Body(ALL) data: { charId: string; info: IPatchInfo.IInfo }
  ) {
    await this.charService.updatePatchData(data.charId, data.info)

    return true
  }

  @Post('/teamInfo')
  async updateTeamInfo(@Body(ALL) data: ITeamInfo.IInfo) {
    await this.teamInfoService.createOrUpdate(data)

    return true
  }

  @Post('/saveChar')
  async saveChar(@Body(ALL) data: { charId: string }) {
    const res = await this.charService.buildCharData(data.charId)

    return res
  }
}
