import {
  getMapData,
  getMapDataListVer,
  getCharItem,
  getItem,
  getFurn,
} from '@/utils/fetch'
import { Message } from 'element-ui'
import { initSomeMap } from '@/components/EnemyData/initData'
import { SET_DATA } from './mutations'
import { router } from '@/router'
import { findStage, preDefineGet, sleep } from '@/utils'
import { Assets } from '@/Api'
//! this.preData = null;
//! const data = this.selMapData.predefines;
//! this.preData = { tokenInsts, tokenCards, characterInsts, characterCards };

const getItemList = (list) => {
  if (!list) return Promise.resolve([])
  return Promise.all(
    list.map(async (el) => ({
      data: await (el.type === 'FURN'
        ? getFurn(el.id)
        : el.type === 'CHAR'
        ? getCharItem(el.id)
        : getItem(el.id)),
      type: el.type,
      dropType: el.dropType,
    }))
  )
}

const actions = {
  async linkStart({ dispatch, commit, getters, rootState }) {
    let key
    while (!(key = rootState.Base.info?.level?.enemy?.key)) {
      console.log('await')
      await sleep(50)
    }
    console.log('await', key)
    const data = await Assets.getEnemyList(key)
    commit(SET_DATA, { key: 'rawData', value: data })
    if (rootState.stageTree) dispatch('loadMap')
    else commit(SET_DATA, { key: 'watchTree', value: true })
  },
  async loadMap({ commit, dispatch, rootState }, map) {
    const parent = map || router.currentRoute.params.map
    if (!parent || !rootState.stageTree) return

    console.log('parent ?', parent)
    const target = rootState.mapList.find((e) => e.levelId === parent)

    commit(SET_DATA, { key: 'mapCode', parent })
    if (target) {
      // const value = target.path
      // .replace('weekly', 'wk')
      // .replace('promote', 'pro')
      // .level
      dispatch('choseMap', target)
    } else {
      console.log('没有这个地图，路由失败')
    }
  },
  async choseMap({ commit, state, dispatch }, data) {
    const exData = await getMapDataListVer(data.levelId.replace('level_', ''))
    /**
     * 匹配常驻图id
     * 当初应该用levelId当索引才对的，万万没想到，StageId会对不上
     */
    // const id = exData.stageId
    //   .replace('wk', 'weekly')
    //   .replace('kc', 'killcost')
    //   .replace('pro', 'promote')
    const mapData = await getMapData(data.levelId).catch((err) => null)

    if (!mapData) {
      Message.error('获取数据失败')
      return
    }

    exData.stageDropInfo &&
      getItemList(exData.stageDropInfo.displayDetailRewards).then((value) =>
        commit(SET_DATA, { key: 'detailsDropList', value })
      )

    // ! to watch
    // ! if (this.$refs.layout) this.$refs.layout.clearRoutes(true);

    const enemyData = Object.entries(state.rawData).reduce((res, [k, v]) => {
      const target = mapData.enemyDbRefs.find((el) => el.id === k)
      if (target) {
        res[k] = Object.assign({}, v, target)
        return res
      } else return res
    }, {})
    commit(SET_DATA, { key: 'data', value: enemyData })
    commit(SET_DATA, { key: 'selectedMap', value: data.label })
    commit(SET_DATA, { key: 'selMapData', value: mapData })
    commit(SET_DATA, { key: 'selMapDataEx', value: exData })

    await dispatch('getPreData')

    // 去掉地图的loading遮罩
    commit(SET_DATA, { key: 'mapPicLoad', value: false })
    // todo need change
    const canvas = document.getElementById('map-canvas-container')
    commit(SET_DATA, {
      key: 'map',
      value: initSomeMap(mapData, canvas, state.preData),
    })
  },
  async getPreData({ state, commit }) {
    commit(SET_DATA, { key: 'preData', value: null })
    commit(SET_DATA, { key: 'preData', value: null })

    const data = state.selMapData.predefines
    if (!data) return
    const tasks = [
      preDefineGet('tokenInsts', data),
      preDefineGet('tokenCards', data),
      preDefineGet('characterInsts', data),
      preDefineGet('characterCards', data),
    ]
    const [
      tokenInsts,
      tokenCards,
      characterInsts,
      characterCards,
    ] = await Promise.all(tasks)
    commit(SET_DATA, {
      key: 'preData',
      value: { tokenInsts, tokenCards, characterInsts, characterCards },
    })
  },
  async loadRunes({ state, dispatch, commit, getters }) {
    // todo
    if (!state.runesMode) {
      const runesData = await getMapDataListVer(
        state.mapCode + '%23f%23'
      ).catch((err) => {
        console.log('可能没索引，但就是有突袭数据')
        return {}
      })

      commit(SET_DATA, { key: 'selMapDataEx', value: runesData })
      commit(SET_DATA, { key: 'runesMode', value: true })
    } else {
      const data = await getMapDataListVer(state.mapCode)
      commit(SET_DATA, { key: 'selMapDataEx', value: data })
      commit(SET_DATA, { key: 'runesMode', value: false })
    }
  },
}
export { actions }
