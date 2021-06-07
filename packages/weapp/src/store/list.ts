import { defineStore } from 'pinia'
import { Data } from '@kkdy/api-taro'
import { IChar, IToken } from '@kkdy/data'

export const useListStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'list',
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    charList: Array.from(
      {
        length: 3,
      },
      () => ({
        charId: 'char_124_kroos',
        name: '克洛丝',
        rarity: 6,
        profession: IChar.Profession.Sniper,
        _skeleton: true,
      })
    ) as BaseCharIndex[],
  }),
  // optional getters
  getters: {
    latestChars(): BaseCharIndex[] {
      return this.charList
        .filter((e) => e.profession !== IToken.Profession.Token)
        .splice(-3)
    },
  },
  // optional actions
  actions: {
    async initList(force = false) {
      // `this` is the store instance
      if (!this.charList.some((e) => e._skeleton) && !force) return

      const { data } = await Data.GetCharacterList()
      if (!data.ok) {
        throw new Error('net error')
      }

      setTimeout(() => {
        this.charList = data.result
      }, 2300)
    },
  },
})

interface BaseCharIndex {
  updatedDate: Date
  charId: string
  rarity: number
  profession: string
  name: string
  _skeleton: boolean
}
