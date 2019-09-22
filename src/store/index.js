import Vuex from 'vuex';
import Vue from 'vue';
import actions from './action';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    listVer: new Date(1568990623279).toLocaleString(),
    pageVer: '',
    enemyVer: '',
    apperMapVer: '',
    // eslint-disable-next-line no-undef
    webVer: new Date(VERSION).toLocaleString(),
    dropList: null,
    stageTree: null,
    extraSkins: null
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
    },
    setStageTree: (state, tree) => {
      state.stageTree = tree;
    },
    setExtraSkins: (state, list) => {
      state.extraSkins = list;
    },
  },
  ...actions
});
