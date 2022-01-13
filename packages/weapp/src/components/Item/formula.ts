import { IItem } from '@kkdy/data'
import { reactify } from '@vueuse/core'
import { Formula } from './type'
import F from './formula.json'

export const useFormula = reactify((data?: IItem.IData | null) => {
  if (!data) return []
  return data.buildingProductList
    .filter((el) => el.roomType === 'WORKSHOP')
    .map((el) => F[el.formulaId] as Formula)
    .filter((e) => e)
})
