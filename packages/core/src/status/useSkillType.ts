import { SkillType } from '../const/skillType'
import { reactify } from '@vueuse/shared'

export const useSkillType = reactify((type: number): { value: string } => {
  const res = SkillType[type as keyof typeof SkillType]
  if (!res) throw new Error('skill 类型异常')
  return res
})
