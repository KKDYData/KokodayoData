import { IItem } from '@kkdy/data'
import { reactify } from '@vueuse/core'

const AssetsOrigin = 'https://andata.somedata.top'

export const useItemImg = reactify((data?: IItem.IData | null) => {
  if (!data) return ''
  return `${AssetsOrigin}/dataX/item/pic/${data.iconId}.png`
})
