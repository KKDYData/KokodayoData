import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Validate,
  ALL,
} from '@midwayjs/decorator'
import { GetResType } from '../dto/utils'
import { ApiData } from '../interface'
import { ActivityService } from '../service/data/activity.s'
import { CharService } from '../service/data/char.s'
import {
  DataUpdateRelativeDTO,
  DataUpdateCharCharComment,
  DataUpdateCharSkillComment,
} from '../dto/data'

@Provide()
@Controller('/data')
export class DataController {
  @Inject()
  charService: CharService

  @Inject()
  activityService: ActivityService

  @Get('/list')
  async listCharacters(): Promise<GetResType<ApiData.GetCharacterList>> {
    return this.charService.listCharacters()
  }

  @Get('/acts')
  async listActivity(): Promise<GetResType<ApiData.GetActivityList>> {
    return this.activityService.listActivity()
  }

  @Post('/char/relative')
  @Validate()
  async addRelative(@Body(ALL) body: DataUpdateRelativeDTO) {
    await this.charService.updateRelativeChar(body.targetId, body.relativeId)
  }

  @Post('/char/charComment')
  @Validate()
  async updateCharCharComment(@Body(ALL) body: DataUpdateCharCharComment) {
    await this.charService.updateCharComment(body.id, body.comment)
  }

  @Post('/char/skillComment')
  @Validate()
  async updateCharSkillComment(@Body(ALL) body: DataUpdateCharSkillComment) {
    await this.charService.updateSkillComment(body.id, body.comment)
  }
}
