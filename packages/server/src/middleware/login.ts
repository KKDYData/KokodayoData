import { Inject, Provide } from '@midwayjs/decorator'

import {
  IWebMiddleware,
  IMidwayWebNext,
  IMidwayWebContext,
} from '@midwayjs/web'
import { RedisService } from '../service/redis.s'
import { BaseError } from '../utils/error'
import { ErrorMap } from '../utils/ErrorMap'

const NoLoginData = {
  ok: false,
  code: ErrorMap['-400'].code,
  msg: ErrorMap['-400'].msg,
  message: ErrorMap['-400'].msg,
}

@Provide()
export class LoginMiddleware implements IWebMiddleware {
  @Inject()
  redisService: RedisService

  resolve() {
    return async (ctx: IMidwayWebContext, next: IMidwayWebNext) => {
      // 控制器前执行的逻辑

      const token = ctx.headers['x-token']

      if (!token || typeof token !== 'string') {
        ctx.response.body = NoLoginData
        return
      }

      try {
        const loginData = JSON.parse(
          await this.redisService.getJson(token, '.')
        )
        if (!loginData) {
          ctx.response.body = NoLoginData
          return
        }

        ctx.loginData = loginData
        ctx.loginToken = token
      } catch (err) {
        ctx.response.body = NoLoginData
        return
      }

      // 执行下一个 Web 中间件，最后执行到控制器

      await next()

      // 控制器之后执行的逻辑
    }
  }
}
