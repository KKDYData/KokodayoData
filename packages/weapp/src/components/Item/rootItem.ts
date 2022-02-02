import { IItem } from '@kkdy/data'
import { inject, InjectionKey, provide } from 'vue'

type E = (data: IItem.IData) => void

const RootItemKey: InjectionKey<{
  emit: E
}> = Symbol()

export const provideRootItemState = (e: E) => {
  provide(RootItemKey, { emit: e })
}

export const useRootItemState = () => {
  return inject(RootItemKey, null)
}
