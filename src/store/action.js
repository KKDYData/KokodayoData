import {
  fetchGet, fetchByKey,
} from '@/utils/fetch'
const url = 'https://penguin-stats.io/PenguinStats/api/v2/result/matrix'


const actions = {
  async setDropList({ commit, state }) {
    if (state.dropList) return
    const data = await fetchGet(url)
    const res = data.matrix ? data.matrix.reduce((res, el) => {
      if (!res[el.itemId]) res[el.itemId] = []
      res[el.itemId].push(el)
      delete el.itemId
      return res
    }, {}) : {}
    commit('setDropList', res)
  },

  async setExtraSkins({ commit, state }) {
    if (state.extraSkins) return
    const data = await fetchByKey('char')('extraSkins')
    commit('setExtraSkins', data)
  }
}

export default {
  actions
}
