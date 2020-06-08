import { changeDesc, findValue } from '@/utils'
import { path } from '@/utils/listVer'
import { mapOptionsKey } from '@/utils/string'

const getters = {
  drawerSize(state, getters, rootState) {
    return Math.floor((300 / rootState.screenWidth) * 100) + '%'
  },
  drawerSizeDouble(state, getters, rootState) {
    return Math.floor((300 / rootState.screenWidth) * 100 * 2) + '%'
  },
  waveTime(state, getters, rootState) {
    let enemyNum = 0
    // 看起来像是简单算个时间，但是实际上，顺便把数量和每波开始的时间加进数据了
    return state.selMapData
      ? state.selMapData.waves.reduce(
        (wRes, cur) =>
          wRes +
          cur.preDelay +
          cur.postDelay +
          cur.fragments.reduce((fRes, fCur) => {
            fRes += fCur.preDelay
            fCur.time = fRes

            enemyNum = fCur.enemyNum = fCur.actions.reduce((res, el) => {
              if (el.actionType === 0) return res + el.count
              else return res
            }, enemyNum)

            fRes += fCur.actions.reduce((res, cur) => {
              const curTime = cur.preDelay + cur.interval * (cur.count - 1)
              // 找出每波最长的
              return Math.max(res, curTime)
            }, 0)

            return fRes
          }, 0),
        0
      ) : 0
  },
  showPredefine(state, getters, rootState) {
    if (!state.selMapData || !state.selMapData.predefines) return false
    return (
      Object.values(state.selMapData.predefines).reduce(
        (res, cur) => (res += cur.length),
        0
      ) > 0
    )
  },
  mapDesc(state, getters, rootState) {
    return state.selMapDataEx ? changeDesc(state.selMapDataEx.description) : ''
  },
  mapPath(state, getters, rootState) {
    return state.mapCode
      ? path +
      'map/pic/' +
      state.mapCode +
      '_optimized.png?x-oss-process=style/jpg-test'
      : ''
  },
  globalBuffs(state, getters, rootState) {
    if (!state.selMapData) return []
    const BuffKeys = {
      kill_to_add_cost: '杀敌额外回复',
      periodic_damage: '地图周期伤害'
      // ebuff_attribute: '属性增益'
    }
    const globalBuffs = state.selMapData.globalBuffs
      ? state.selMapData.globalBuffs
      : []
    // console.log(state.selMapData);
    const target = state.runesMode
      ? [...globalBuffs]
      : [...globalBuffs]
    if (state.selMapData.runes) target.push(...state.selMapData.runes)
    return target
      .map(({ prefabKey, key, blackboard }) => {
        const k = prefabKey ? prefabKey : key
        if (BuffKeys[k]) return [BuffKeys[k], blackboard]
      })
      .filter(el => el)
  },
  options(state, getters, rootState) {
    return !state.selMapData
      ? []
      : Object.entries(
        Object.assign(state.selMapData.options, state.selMapDataEx)
      )
        .filter(([k, v]) => mapOptionsKey[k])
        .map(([k, v]) => {
          v = k === 'costIncreaseTime' ? Math.round(10 / v) / 10 : v
          let costBuff
          if (state.runesMode) {
            console.log('runes mode', state.runesMode)
            if (k === 'maxLifePoint') {
              const lifePointBuff = findValue(state.selMapData, 'runes', 'gbuff_lifepoint')
              if (lifePointBuff) {
                v = findValue(lifePointBuff, 'blackboard', 'value').value
              }
            }
            if (k === 'costIncreaseTime' && (costBuff = findValue(state.selMapData, 'runes', 'cbuff_cost_recovery'))) {
              // 暂时只保留0.3，不然会换行
              v = Math.round((v / findValue(costBuff, 'blackboard', 'scale').value) * 10) / 10
            }
          }
          return [mapOptionsKey[k], v]
        })
  },
  direction(state, getters, rootState) {
    return state.short ? 'btt' : 'rtl'
  }
}
export {
  getters
}
