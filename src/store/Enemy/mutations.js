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
};

export {
  mutations
};
