import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { IndexList } from '../entity/indexList'
import { Repository } from 'typeorm'

@Provide()
export class IndexListService {
  @InjectEntityModel(IndexList)
  indexListModel: Repository<IndexList>

  async getList() {
    const list = await this.indexListModel.find()

    return list
  }
}
