import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository, Raw } from 'typeorm'
import { IActivityInfo, IGachaPoolInfo } from '@kkdy/data'
import { getOrCreateModel } from '../../utils/entity'
import { GachaPool } from '../../entity/GachaPool.e'
import { BaseError } from '../../utils/error'
import { ErrorMap } from '../../utils/ErrorMap'
import { CharacterData } from '../../entity/Character.e'
import { dissoc } from 'ramda'

@Provide()
export class GachaPoolService {
  @InjectEntityModel(GachaPool)
  model: Repository<GachaPool>

  @InjectEntityModel(CharacterData)
  charModel: Repository<CharacterData>

  async createOrUpdate(index: number, data: IGachaPoolInfo.IInfo) {
    const info = await getOrCreateModel(this.model, {
      where: { gachaIndex: index },
    })

    info.gachaIndex = index
    info.gachaRuleType = data.gachaRuleType
    info.data = data
    info.gachaPoolId = data.gachaPoolId

    return this.model.save(info)
  }

  async listGachaPool() {
    const acts = await this.model.find()
    return acts.map(a => a.data)
  }

  async updateByGachaPoolName(
    name: string,
    relativeChars: string[] = [],
    link?: string
  ) {
    const pool = await this.model.findOne({
      where: {
        data: Raw(
          columnAlias =>
            `json_extract(json_unquote(${columnAlias}), '$.gachaPoolName') =:value`,
          { value: name }
        ),
      },
    })

    if (!pool) throw BaseError.create(ErrorMap['NO_DATA'])

    await this.updateCharsAndLink(pool, relativeChars, link)
  }

  async updateByDateRange(
    startDate: Date,
    endDate: Date,
    relativeChars: string[] = [],
    link?: string
  ) {
    const openTime = formatTime(startDate)
    const endTime = formatTime(endDate)

    const pool = await this.model.findOne({
      where: {
        data: Raw(
          columnAlias =>
            `json_extract(json_unquote(${columnAlias}), '$.openTime') =:openTime 
            and json_extract(json_unquote(${columnAlias}), '$.endTime') =:endTime`,
          { openTime, endTime }
        ),
      },
    })

    if (!pool) throw BaseError.create(ErrorMap['NO_DATA'])

    await this.updateCharsAndLink(pool, relativeChars, link)
  }

  async updateCharsAndLink(
    pool: GachaPool,
    relativeChars: string[] = [],
    link?: string
  ) {
    const chars = await Promise.all(
      relativeChars.map(e =>
        this.charModel.findOne({
          where: {
            name: e,
          },
        })
      )
    )
    if (chars.length) pool.relativeChars = chars
    if (link) pool.link = link

    await this.model.save(pool)
  }

  async getByIds(ids: string[]) {
    return this.model.findByIds(ids, { relations: ['relativeChars'] })
  }
}

function formatTime(d: Date) {
  return Math.floor(+new Date(d) / 1000)
}
