import { Api, Assets } from '@/Api'
import { change } from './utils'

const namespaced = true

const state = {
  info: {}
}

const actions = {
  async getInfo({ state, commit }) {
    state.info = await Api.getInfo()
    commit('setListVer', new Date(state.info.agent.char.update_time).toLocaleString(), { root: true })

    if (state.info?.level?.stage) {
      const data = await Assets.getStageList(state.info.level.stage.key)
      const arr = change(data).sort((a, b) => a.label.localeCompare(b.label))
      commit('setStageTree', arr, { root: true })
    }
  }
}

export {
  state,
  actions,
  namespaced
}
