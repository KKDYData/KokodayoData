import { getMapDataListVer } from '@/utils/fetch';

const actions = {
  async loadRunes({ state, dispatch, commit, getters }) {
    if (!state.runesMode) {
      state.selMapDataEx = await getMapDataListVer(state.mapCode + '%23f%23');
      state.runesMode = true;
    } else {
      state.runesMode = false;
      state.selMapDataEx = await getMapDataListVer(state.mapCode);
    }
  },
};
export {
  actions
};
