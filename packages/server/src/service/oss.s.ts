import { Config, Init, Provide } from '@midwayjs/decorator'
import { BaseService } from './base.s'
import OSS from 'ali-oss'

@Provide()
export class OssService extends BaseService {
  client: OSS

  @Config('OssAccessKey')
  OssAccessKey

  constructor() {
    super()
  }

  @Init()
  initOss() {
    this.client = new OSS(this.OssAccessKey)
  }

  async putJson(name: string, json: Record<string, any>) {
    this.client.put(name, Buffer.from(JSON.stringify(json), 'utf-8'))
  }
}
