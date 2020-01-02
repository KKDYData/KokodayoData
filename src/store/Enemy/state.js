import { devMode, rootPath } from '@/stats';

const state = {
  path: (process.env.NODE_ENV === 'development' ? '' : rootPath) + '/enemydata/',
  short: true,
  data: null,
  rowData: [],
  load: false,
  drawer: false,
  selectedMap: '',
  selMapData: '',
  mapCode: '',
  selMapDataEx: null,
  selMapNode: null,
  detailsDropList: [],
  runesMode: false,
  treeId: '',
  mapPicLoad: true,
  showMap: true,
  watchTree: false,
  simpleShow: true,
  preData: null,
  map: null,
  mapUp: null,
  devMode,
};

export {
  state
};
