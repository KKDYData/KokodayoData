const SET_DATA = 'SET_DATA';

const mutations = {
  clearMap(state) {
    state.data = state.rowData;
    state.mapCode = '';
    state.selectedMap = '';
    state.selMapData = null;
    state.selMapDataEx = null;
    state.runesMode = false;
    state.preData = null;
  },
  [SET_DATA](state, { key, value }) {
    if (typeof state[key] === undefined)
      console.error('state dose not has this property');
    state[key] = value;
  }
};

export {
  mutations,
  SET_DATA
};
