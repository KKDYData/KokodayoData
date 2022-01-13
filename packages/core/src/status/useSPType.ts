import { reactify } from '@vueuse/shared'
import { SPType } from '../const/spType'

export const useSpType = reactify(
  (type: number): { value: string; style: any } => {
    const res = SPType[type as keyof typeof SPType]
    if (!res) throw new Error('sp 类型异常')
    return res
  }
)
