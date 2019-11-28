const charListVer = 7120440414751;//3584596121751;//9494734989651;
const stageListVer = 6076469254751;//2781318314751;//1569786667996;
const enemyListVer = 1574138107584;
const api = '/api/arknights/';
const dataPath = process.env.PRODUCTION === 'beta' ? 'https://arknights-data.oss-cn-beijing.aliyuncs.com'
  : 'https://andata.somedata.top';
const path = process.env.NODE_ENV === 'development' ? 'https://arknights-data.oss-cn-beijing.aliyuncs.com/dataX/'
  : 'https://andata.somedata.top/dataX/';

export {
  charListVer,
  stageListVer,
  enemyListVer,
  dataPath,
  api,
  path
};

// PRODUCTION
