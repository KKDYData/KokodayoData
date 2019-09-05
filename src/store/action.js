import { fetchGet, getStageList } from '../utils';
import { StageType } from '../utils/string';
const url = 'https://penguin-stats.io/PenguinStats/api/result/matrix';

const change = (list) => {
  return Object.entries(list).map(([key, value]) => {
    if (Array.isArray(value)) {
      return {
        label: StageType[key] || key,
        children: value.map(el => {
          if (el.type && el.data) {
            return {
              label: '支线',
              children: el.data.map(el => {
                const keys = el.split(' ');
                return {
                  label: keys.slice(0, 2).join(' '),
                  path: keys[2],
                  apCost: keys[3]
                };
              }) //change(el.data)
            };
          } else {
            const keys = el.split(' ');
            return {
              label: keys.slice(0, 2).join(' '),
              path: keys[2],
              apCost: keys[3],
              etCost: keys[4]
            };
          }
        })
      };
    } else {
      return { label: StageType[key] || key, children: change(value) };
    }
  });
};

const actions = {
  async setDropList({ commit, state }) {
    if (state.dropList) return;
    const data = await fetchGet(url);
    const res = data.matrix ? data.matrix.reduce((res, el) => {
      if (!res[el.itemId]) res[el.itemId] = [];
      res[el.itemId].push(el);
      delete el.itemId;
      return res;
    }, {}) : {};
    commit('setDropList', res);
  },

  async setStageTree({ commit, state }) {
    if (state.stageTree) return;
    const data = await getStageList();
    commit('setStageTree', change(data));
  }
};

export default {
  actions
};
