import { IItem } from '@kkdy/data'
import { defineStore } from 'pinia'
import axios from 'taro-axios'
import { debounce } from 'lodash-es'
import { ref } from 'vue'

const AssetsOrigin = 'https://andata.somedata.top'
const target = 'data-2020'

export const useItemsStore = defineStore('items', () => {
  const itemMap = ref(new Map<string, IItem.IData>())
  const dropMap = ref(new Map<string, MatrixElement[]>())

  const getItem = async (id: string) => {
    const item = itemMap.value.get(id)
    if (item) return item
    else {
      const { data } = await axios.get(
        `${AssetsOrigin}/${target}/item/${id}.json`
      )
      itemMap.value.set(id, data)
      return data
    }
  }
  const initItemsStore = debounce(async () => {
    if (dropMap.value.size) return

    const url = 'https://penguin-stats.cn/PenguinStats/api/v2/result/matrix'
    const { data } = await axios.get(url)
    if (data.matrix) {
      data.matrix.forEach((cur) => {
        let list = dropMap.value.get(cur.itemId)
        if (!list) {
          list = []
          dropMap.value.set(cur.itemId, list)
        }
        list.push(cur)
      })
    }
  }, 50)

  const itemList = ref<string[]>([])

  return {
    itemMap,
    dropMap,
    getItem,
    initItemsStore,
    itemList,
  }
})

export interface Matrix {
  matrix: MatrixElement[]
}

export interface MatrixElement {
  stageId: string
  itemId: string
  quantity: number
  times: number
  start: number
  end?: number
}
