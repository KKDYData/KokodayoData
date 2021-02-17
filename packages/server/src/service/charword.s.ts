import { Logger, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Charword } from '../entity/Charword.e'
import { Repository } from 'typeorm'
import { CharWord as ICharWord, Skill as ISkill } from '@kkdy/data'
import { ILogger } from '@midwayjs/logger'
import { Skill } from '../entity/Skill.e'

@Provide()
export class CharwordService {
  @Logger()
  coreLogger: ILogger

  @InjectEntityModel(Charword)
  model: Repository<Charword>

  async createOrUpdate(data: ICharWord.IWord) {
    const word =
      (await this.model.findOne({
        where: { charWordId: data.charWordId },
      })) ?? new Charword()
    word.charId = data.charId
    word.charWordId = data.charWordId
    word.data = JSON.stringify(data)
    await this.model.save(word)

    this.coreLogger.info('save word ' + word.charWordId + ' !')
  }

  async getWordsByCharId(charId: string) {
    return this.model.find({ where: { charId } })
  }
}
