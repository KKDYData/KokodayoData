const SET_DATA = 'SET_DATA'

const mutations = {
  [SET_DATA](state, { key, value }) {
    if (typeof state[key] === 'undefined') {
      throw new Error('state dose not has this property')
    }
    state[key] = value
  }
}
export { SET_DATA, mutations }
