import { Inject, Provide } from '@midwayjs/decorator'
import { IUserOptions } from '../interface'
import { BaseService } from './base.s'
import { v1 as uuid } from 'uuid'
import { RedisService } from './redis.s'
import { BaseError } from '../utils/error'


const DEFAULT_WXID = 'WXID'

@Provide()
export class UserService extends BaseService {
  @Inject()
  redisService: RedisService

  async getUser (options: IUserOptions) {
    this.coreLogger.info('?')

    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    }
  }

  async getQrCodeLoginToken () {
    const id = uuid()
    await this.redisService.client.setex(id, 60 * 5, DEFAULT_WXID)

    return id
  }

  async getWxIdByToken (token: string) {
    const wxId = await this.redisService.client.get(token)
    if (wxId && wxId !== DEFAULT_WXID) {
      await this.redisService.client.del(token)
    }
    return wxId
  }

  async setWxIdByToken (token: string, wxId: string) {
    this.coreLogger.info('token is ' + token)
    const target = await this.redisService.client.get(token)
    if (target) {
      await this.redisService.client.setex(token, 60 * 5, wxId)
    } else throw new BaseError('timeout', -10001)
  }
}
