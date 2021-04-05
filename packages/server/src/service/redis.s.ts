import { Config, Init, Provide } from '@midwayjs/decorator'
import { BaseService } from './base.s'
import redis, { Redis } from 'ioredis'
import JSONCache from 'redis-json'
import { ReJSON } from 'redis-modules-sdk'
@Provide()
export class RedisService extends BaseService {
  reJson: ReJSON
  client: Redis
  prefix: string = 'kkdy'

  @Config('redis')
  redisConfig

  constructor() {
    super()
  }

  @Init()
  async init() {
    this.prefix = this.redisConfig.keyPrefix
    this.reJson = new ReJSON(this.redisConfig)
    await this.reJson.connect()
    this.client = this.reJson.redis
  }

  async setJson<T>(key: string, path: string, data: T, expire?: number) {
    await this.reJson.set(this.formatKey(key), path, JSON.stringify(data))
    if (expire) {
      await this.client.expire(key, expire)
    }
  }

  async getJson(key: string, path: string) {
    return this.reJson.get(this.formatKey(key), path)
  }

  async delJson(key: string, path: string) {
    return this.reJson.del(this.formatKey(key), path)
  }

  async mGetJson(keys: string[]) {
    const [k, ...path] = keys
    this.client.mget
    return this.reJson.mget([this.formatKey(k), ...path])
  }

  formatKey(key: string) {
    return this.prefix + key
  }

  formatPathWithBracket(path: string) {
    return `["${path}"]`
  }
}
