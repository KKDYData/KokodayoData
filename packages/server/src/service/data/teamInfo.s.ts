import { ITeamInfo } from '@kkdy/data'
import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { TeamInfo } from '../../entity/TeamInfo.e'
import { BaseService } from '../base.s'
import { Repository, Raw } from 'typeorm'
import { getOrCreateModel } from '../../utils/entity'
import { CharacterData } from '../../entity/Character.e'

const PowerLevelMap = {
  0: 'nationId',
  1: 'groupId',
  2: 'teamId',
}

@Provide()
export class TeamInfoService extends BaseService {
  @InjectEntityModel(TeamInfo)
  model: Repository<TeamInfo>

  @InjectEntityModel(CharacterData)
  charModel: Repository<CharacterData>

  async createOrUpdate(data: ITeamInfo.IInfo) {
    const info = await getOrCreateModel(this.model, {
      where: { powerId: data.powerId },
    })

    info.powerId = data.powerId

    // info.chars = await this.charModel.
    info.chars = await this.charModel.find({
      where: {
        data: Raw(
          columnAlias =>
            `json_extract(json_unquote(${columnAlias}), '$.${
              PowerLevelMap[data.powerLevel]
            }') = :value`,
          { value: data.powerId }
        ),
      },
    })

    info.data = data

    await this.model.save(info)

    this.ctx.logger.info(
      'teamId %s, %s, len: %d',
      data.powerId,
      data.powerName,
      info.chars.length
    )
  }

  getTeamInfoById(id: string) {
    return this.model.findOne({ where: { powerId: id } })
  }
}
