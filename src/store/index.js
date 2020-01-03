import Vuex from 'vuex';
import Vue from 'vue';
import actions from './action';
import { UA } from '../utils';
import { charListVer } from '../utils/listVer';
import { EnemyPanel } from './Enemy';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    enemy: EnemyPanel
  },
  state: {
    listVer: new Date(+charListVer.toString().split('').reverse().join('')).toLocaleString(),
    pageVer: '',
    enemyVer: '',
    apperMapVer: '',
    webVer: new Date(process.env.VERSION).toLocaleString(),
    dropList: null,
    stageTree: null,
    extraSkins: null,
    short: UA.isMoblie || window.innerWidth < 600 ? true : false,
    screenWidth: document.body.clientWidth,
    isNeedUpdate: false,
  },
  getters: {
    itemDropList: (state) => id => {
      if (state.dropList) {
        return state.dropList[id];
      }
    }
  },
  mutations: {
    setShort: (state, v) => {
      state.short = v;
    },
    setScreenWidth: (state, v) => {
      state.screenWidth = v;
    },
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
    setisNeedUpdate(state, v) {
      state.isNeedUpdate = v;
    }
  },
  ...actions
});
