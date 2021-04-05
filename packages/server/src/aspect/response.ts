import {
  Provide,
  Aspect,
  IMethodAspect,
  JoinPoint,
  Logger,
} from '@midwayjs/decorator'
import { ILogger } from '@midwayjs/logger'
import { DataController } from '../controller/data.c'
import { UpdateController } from '../controller/update.c'
import { UserController } from '../controller/user.c'

@Provide()
@Aspect([UserController, UpdateController, DataController])
export class ResponseJson implements IMethodAspect {
  @Logger()
  coreLogger: ILogger

  async around(point: JoinPoint) {
    try {
      const result = await point.proceed(...point.args)
      return {
        ok: true,
        result,
      }
    } catch (err) {
      this.coreLogger.error(err)
      return {
        ok: false,
        message: err.message || err.toString(),
        msg: err.msg || err.message || err.toString(),
        code: err.code,
      }
    }
  }
}
