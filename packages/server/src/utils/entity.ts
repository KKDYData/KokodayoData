import { Repository, FindOneOptions } from 'typeorm'

export async function getOrCreateModel<T>(
  model: Repository<T>,
  options: FindOneOptions<T>
) {
  const d = (await model.findOne(options)) ?? model.create()
  return d
}
