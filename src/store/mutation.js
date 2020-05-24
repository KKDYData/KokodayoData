const SET_DATA = 'SET_DATA'

const mutations = {
  [SET_DATA](state, { key, value }) {
    if (typeof state[key] === undefined)
      console.error('state dose not has this property')
    state[key] = value
  }
}
export { SET_DATA, mutations }
