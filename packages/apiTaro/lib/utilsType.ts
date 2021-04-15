export type BaseEntityType<T> = {
  id: number
  createdDate?: Date
  updatedDate?: Date
  version?: number
  data: T
}
