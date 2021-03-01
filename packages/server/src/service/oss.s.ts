import { Provide } from '@midwayjs/decorator'
import { BaseService } from './base.s'
import OSS from 'ali-oss'

@Provide()
export class OssService extends BaseService {
  client: OSS

  constructor() {
    super()
    this.client = new OSS({
      //阿里云
      region: 'oss-cn-beijing',
      //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
      accessKeyId: 'LTAIV0wudzrbO0px',
      accessKeySecret: 'h7MV1kdyTYUaO81t42xVYkQbgxNCns',
      bucket: 'arknights-data',
    })
  }

  async putJson(name: string, json: Record<string, any>) {
    this.client.put(name, Buffer.from(JSON.stringify(json), 'utf-8'))
  }
}
