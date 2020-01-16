import listData from '../../GameData/listData.json'
const { char, stage, enemy } = listData

// ?处理数据的脚本涉及服务器账号，也就GameData那个文件夹，所以，这里提供一个11.19日版本的列表。
const charListVer = char //7120440414751
const stageListVer = stage //6076469254751
const enemyListVer = enemy //1574138107584
const api = '/api/arknights/'
const dataPath = process.env.PRODUCTION === 'beta' ? 'https://arknights-data.oss-cn-beijing.aliyuncs.com'
  : 'https://andata.somedata.top'
const target = 'data-2020'
const path = process.env.NODE_ENV === 'development' ? 'https://arknights-data.oss-cn-beijing.aliyuncs.com/dataX/'
  : 'https://andata.somedata.top/dataX/'

export {
  charListVer,
  stageListVer,
  enemyListVer,
  dataPath,
  api,
  path,
  target
}
