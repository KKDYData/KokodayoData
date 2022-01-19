import { Logger, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Charword } from '../../entity/Charword.e'
import { Repository } from 'typeorm'
import { ICharWord } from '@kkdy/data'
import { ILogger } from '@midwayjs/logger'
import { getOrCreateModel } from '../../utils/entity'

@Provide()
export class CharwordService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(Charword)
  model: Repository<Charword>

  async createOrUpdate(data: ICharWord.IWord) {
    const word = await getOrCreateModel(this.model, {
      where: { charWordId: data.charWordId },
    })

    word.charId = data.charId
    word.charWordId = data.charWordId
    word.data = data
    await this.model.save(word)

    this.coreLogger.info('save word ' + word.charWordId + ' !')
  }

  async getWordsByCharId(charId: string) {
    return this.model.find({ where: { charId } })
  }
}
