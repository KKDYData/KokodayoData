import { IChar } from '@kkdy/data'
import { ProfessionCnMap, ProfessionIconMap } from './constants'
import { reactify } from '@vueuse/core'

export const getProfessionIcon = (type: IChar.Profession) =>
  ProfessionIconMap[type]

export const useProfessionIcon = reactify(getProfessionIcon)

export const getProffessionCn = (type: IChar.Profession) =>
  ProfessionCnMap[type]
