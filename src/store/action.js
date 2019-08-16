import { fetchGet } from '../utils';
const url = 'https://penguin-stats.io/PenguinStats/api/result/matrix';

const actions = {
  async getDropList({ commit, state }) {
    if (state.dropList) return;
    const data = await fetchGet(url);
    const res = data.matrix ? data.matrix.reduce((res, el) => {
      if (!res[el.itemId]) res[el.itemId] = [];
      res[el.itemId].push(el);
      delete el.itemId;
      return res;
    }, {}) : {};
    commit('setDropList', res);
  }
};

export default {
  actions
};
