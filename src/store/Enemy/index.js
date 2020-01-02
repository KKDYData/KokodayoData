import { state } from './state';
import { getters } from './gettters';
import { mutations } from './mutations';
import { actions } from './action';

export const EnemyPanel = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

