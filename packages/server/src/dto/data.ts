import { Rule, RuleType } from '@midwayjs/decorator'
import {
  GetGachaPoolListByIds,
  UpdateCharCharComment,
  UpdateCharSkillComment,
  UpdateRelativeChar,
} from '../interface/data'
import { BodyType } from './utils'

export class DataUpdateRelativeDTO implements BodyType<UpdateRelativeChar> {
  @Rule(RuleType.string().required())
  relativeId: string

  @Rule(RuleType.string().required())
  targetId: string
}

export class DataUpdateCharSkillCommentsDTO
  implements BodyType<UpdateCharSkillComment> {
  @Rule(RuleType.array().items(RuleType.string()).required())
  comments: string[]

  @Rule(RuleType.string().required())
  id: string
}

export class DataUpdateCharCharComment
  implements BodyType<UpdateCharCharComment> {
  @Rule(RuleType.string().required())
  comment: string

  @Rule(RuleType.string().required())
  id: string
}

export class SimpleIdDTO {
  @Rule(RuleType.string().required())
  id: string
}

export class DataGetGachaPoolsByIdsDTO
  implements BodyType<GetGachaPoolListByIds> {
  @Rule(RuleType.array().items(RuleType.number()).required())
  ids: number[]
}

export class DataUpdateEnemyCommentsDTO
  implements BodyType<UpdateCharSkillComment> {
  @Rule(RuleType.array().items(RuleType.string()).required())
  comments: string[]

  @Rule(RuleType.string().required())
  id: string
}
