import { Inject, Logger } from '@midwayjs/decorator'
import { ILogger } from '@midwayjs/logger'
import { Repository } from 'typeorm'
import { BaseEntity } from '../entity/base.e'

export class BaseService {
  @Logger()
  coreLogger: ILogger
}
