import { Controller, Get, Inject, Provide } from '@midwayjs/decorator'
import { GetResType } from '../dto/utils'
import { ApiData } from '../interface'
import { CharService } from '../service/data/char.s'

@Provide()
@Controller('/data')
export class DataController {
  @Inject()
  charService: CharService

  @Get('/list')
  async listCharacters(): Promise<GetResType<ApiData.GetCharacterList>> {
    return this.charService.listCharacters()
  }
}
