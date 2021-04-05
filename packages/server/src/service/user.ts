import { Inject, Provide, Config } from '@midwayjs/decorator'
import { BaseService } from './base.s'
import { v4 as uuid, v5 as uuidV5 } from 'uuid'
import { RedisService } from './redis.s'
import { BaseError } from '../utils/error'
import { InjectEntityModel } from '@midwayjs/orm'
import { User } from '../entity/User.e'
import { Repository } from 'typeorm'
import { ErrorMap } from '../utils/ErrorMap'
import { getOrCreateModel } from '../utils/entity'

const DEFAULT_WXID = 'WXID'

@Provide()
export class UserService extends BaseService {
  @Inject()
  redisService: RedisService

  @Config('UserUUIDNameSpace')
  UserUUIDNameSpace: string

  @InjectEntityModel(User)
  model: Repository<User>

  async getQrCodeKey() {
    const qrcodeKey = uuid()
    const token = uuid()

    await this.redisService.setJson(
      qrcodeKey,
      '.',
      { type: 'loginQrcode', token, [token]: '' },
      60 * 5
    )

    return { qrcodeKey, token }
  }

  async getQrcodeLoginToken(qrcodeKey: string, token: string) {
    try {
      const loginToken = JSON.parse(
        await this.redisService.getJson(
          qrcodeKey,
          this.redisService.formatPathWithBracket(token)
        )
      )

      if (loginToken) {
        await this.redisService.delJson(qrcodeKey, '.')
      }
      return loginToken
    } catch (err) {
      throw BaseError.create(ErrorMap['-1002'])
    }
  }

  async crossLoginByWxId(qrcodeKey: string, token: string, wxId: string) {
    // todo 先校验微信id再走下面流程

    const loginTime = +new Date()

    const loginToken = uuidV5(wxId + loginTime, this.UserUUIDNameSpace)
    try {
      // 设置且续期
      await this.redisService.setJson(
        qrcodeKey,
        this.redisService.formatPathWithBracket(token),
        loginToken,
        60 * 5
      )

      // 登录有效期 3个小时
      const expireTime = 60 * 60 * 3
      await this.redisService.setJson(
        loginToken,
        '.',
        { wxId, loginTime },
        expireTime
      )
    } catch (err) {
      throw BaseError.create(ErrorMap['-1001'])
    }
  }

  async decodeQrcode(token: string) {
    const json = await this.redisService.getJson(token, '.')
    const res: null | QrcodeKeyData = JSON.parse(json)
    return res
  }

  async getUser(loginToken: string) {
    // const data = await this.redisService.getJson(loginToken, '.')
    const loginData = this.ctx.loginData //JSON.parse(data) as LoginData

    if (loginData.userId) {
      const userModel = await this.model.findOne({ id: loginData.userId })
      return userModel
    } else {
      // 注册用户
      const newUser = await getOrCreateModel(this.model, {
        where: { wxId: loginData.wxId },
      })

      newUser.wxId = loginData.wxId
      const savedUser = await this.model.save(newUser)

      // 更新缓存
      await this.redisService.setJson(loginToken, 'userId', savedUser.id)
      return savedUser
    }
  }
}

interface QrcodeKeyData {
  type: 'loginQrcode'
  token: string
}
