import { defineStore } from 'pinia'
import { Data } from '@kkdy/api-taro'
import { IChar, IToken, ITrap } from '@kkdy/data'

export const useListStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'list',
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    charList: Array.from(
      {
        length: 4,
      },
      () => ({
        charId: 'char_124_kroos',
        name: '克洛丝',
        rarity: 6,
        profession: IChar.Profession.Sniper,
        _skeleton: true,
      })
    ) as BaseCharIndex[],
    t: [],
  }),
  // optional getters
  getters: {
    latestChars(): BaseCharIndex[] {
      const res = this.charList
        .filter((e) => e.profession !== IToken.Profession.Token)
        .splice(-20)
      console.log('res', res)
      return res
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
      const available = new Set(Object.values(IChar.Profession))
      this.t = [...this.charList]
      this.charList = data.result.filter((e) =>
        available.has(e.profession as any)
      )
    },
    switchList() {
      const l = [...this.t]
      this.t = [...this.charList] as any
      this.charList = [...l]
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
