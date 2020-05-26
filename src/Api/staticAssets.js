import { dataPath, target } from '@/utils/listVer'
import { fetchGet } from './fetch'

const fetchByKey = (keyPath) => {
  return key => fetchGet(`${dataPath}/${target}/${keyPath}/${key}.json`, { isApi: false })
}




const getProfileList = (key) => fetchByKey('char/list')(key)
const getStageList = (key) => fetchByKey('lists/stage')(key) //fetchGetSliceSet('stageList');
const getEnemyList = (key) => fetchByKey('lists/enemy')(key) //fetchGetSliceSet('enemyList', 'setEnemyVer');
const getBuildingList = (key) => fetchByKey('lists/buildingSkills')(key) //fetchGetSliceSet('enemyList', 'setEnemyVer');

export const Assets = {
  getProfileList,
  getBuildingList,
  getEnemyList,
  getStageList
}
