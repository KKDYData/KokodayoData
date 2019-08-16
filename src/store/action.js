import { fetchGet } from '../utils';
const url = 'https://penguin-stats.io/PenguinStats/api/result/matrix';

const actions = {
  async getDropList({ commit, state }) {
    if (state.dropList) return;
    const data = await fetchGet(url);
    const res = {};
    if (data.matrix) {
      data.matrix.forEach(el => {
        if (!res[el.itemId]) res[el.itemId] = [];
        res[el.itemId].push(el);
        delete el.itemId;
      });
    }
    commit('setDropList', res);
  }
};

export default {
  actions
};
