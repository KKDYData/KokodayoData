import { Rule, RuleType } from '@midwayjs/decorator'
import {
  UpdateGachaPoolByDateRange,
  UpdateGachaPoolByName,
} from '../interface/update'
import { BodyType } from './utils'

export class UpdateGachaPoolByNameDTO
  implements BodyType<UpdateGachaPoolByName> {
  @Rule(RuleType.string().required())
  name: string

  @Rule(RuleType.array().items(RuleType.string()))
  chars: string[]

  @Rule(RuleType.string())
  link: string
}

export class UpdateGachaPoolByDateRangeDTO
  implements BodyType<UpdateGachaPoolByDateRange> {
  @Rule(RuleType.date().required())
  startDate: Date

  @Rule(RuleType.date().required())
  endDate: Date

  @Rule(RuleType.array().items(RuleType.string()))
  chars: string[]

  @Rule(RuleType.string())
  link: string
}
