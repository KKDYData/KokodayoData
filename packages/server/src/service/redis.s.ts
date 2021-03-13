import { Provide } from '@midwayjs/decorator'
import { BaseService } from './base.s'
import redis, { Redis } from 'ioredis'


@Provide()
export class RedisService extends BaseService {
  client: Redis

  constructor () {
    super()

    this.client = new redis({
      port: 6379, // Redis port
      host: "127.0.0.1", // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      keyPrefix: 'kkdy:',
      db: 2,
    })
  }
}