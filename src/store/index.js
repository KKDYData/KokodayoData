import Vuex from 'vuex';
import Vue from 'vue';
import actions from './action';

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    listVer: '',
    pageVer: '',
    enemyVer: '',
    apperMapVer: '',
    // eslint-disable-next-line no-undef
    webVer: new Date(VERSION).toLocaleString(),
    dropList: null
  },
  getters: {
    itemDropList: (state) => id => {
      if (state.dropList) {
        return state.dropList[id];
      }
    }
  },
  mutations: {
    setListVer: (state, ver) => {
      state.listVer = ver;
    },
    setPageVer: (state, ver) => {
      state.pageVer = ver;
    },
    setEnemyVer: (state, ver) => {
      state.enemyVer = ver;
    },
    setApperMapVer: (state, ver) => {
      state.apperMapVer = ver;
    },
    setDropList: (state, list) => {
      state.dropList = list;
    }
  },
  ...actions
});
