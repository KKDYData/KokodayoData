<template>
  <div class="home-wrapper">
    <el-drawer
      ref="chapter-selecter"
      title="章节选择"
      :visible.sync="drawer"
      :size="short ? '70%' : '30%'"
      direction="ltr"
      :props="selMapNode"
    >
      <div class="chapter-wrapper">
        <el-tree
          @node-click="choseMap"
          :data="stageList"
          accordion
          :highlight-current="true"
          :auto-expand-parent="true"
        ></el-tree>
      </div>
    </el-drawer>
    <el-alert show-icon type="warning" description>
      <div slot="title">注意</div>
      <p>敌人的突袭数据由这里的数据和地图加成计算得出</p>
    </el-alert>
    <div class="map-wrapper">
      <div class="map-title-part">
        <div>
          <el-button @click="drawer = true" type="primary">
            {{selectedMap !== '' ? selectedMap : '选择地图'}}
            <i class="el-icon-edit-outline"></i>
          </el-button>
        </div>
        <p v-if="selMapDataEx" v-html="mapDesc"></p>
      </div>
      <div class="map-data-wrapper">
        <div class="map-data-container">
          <div class="map-left-panel">
            <el-image class="map-pic-contianer" fit="fill" :src="mapPath"></el-image>
            <div class="left-layout">
              <my-title style="margin: 20px 0 0;" :title="selectedMap === '' ? '所有敌人' : '出现敌人'"></my-title>
              <enemy-data-layout
                ref="layout"
                :short="short"
                v-if="load"
                :data="data"
                :appear-map="appearMap"
              ></enemy-data-layout>
            </div>
          </div>
          <div v-if="mapCode" class="map-option-container-wrapper">
            <div class="map-option-container">
              <content-slot
                class="map-option-content"
                :long="true"
                :width="126"
                v-for="([k,v]) in options"
                :key="k"
              >
                <template slot="title">{{k}}</template>
                <template slot="content">{{v == '999999' ? '0' : v}}</template>
              </content-slot>
            </div>

            <div class="map-drop-container-wrapper">
              <drop-list v-if="firstDrop.length > 0" :list="firstDrop" :short="short" title="首次掉落"></drop-list>
              <drop-list
                v-if="commonDrop.length > 0"
                :list="commonDrop"
                :short="short"
                title="常规掉落"
              ></drop-list>

              <drop-list
                v-if="rarityDrop.length > 0"
                :list="rarityDrop"
                :short="short"
                title="稀有掉落"
              ></drop-list>
              <drop-list
                v-if="almostDrop.length > 0"
                :list="almostDrop"
                :short="short"
                title="概率掉落"
              ></drop-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import loadingC from './components/Loading';
import MyTitle from './components/MyTitle';
import ContentSlot from './components/ContentSlot';
// import ItemViewer from './components/ItemViewer';
import DropList from './DropLIst';

import { Alert, Tree, Drawer, Button, Image } from 'element-ui';

import Vue from 'vue';
Vue.use(Alert);
Vue.use(Button);
Vue.use(Tree);
Vue.use(Drawer);
Vue.use(Image);

import mapPic from '../assets/wk_fly_1.png';

import {
  getEnemyList,
  getEneAppearMap,
  isMoblie,
  getMapData,
  path,
  getMapDataLsitVer,
  changeDesc,
  fetchGet
} from './utils';

import { mapOptionsKey, campToCode } from './utils/string';

import StageList from './components/stageListPro';

const StageType = {
  main: '主线',
  tr: 'TR',
  hard: '困难',
  wk: '日常',
  camp: '剿灭作战',
  guid: '教程',
  sub: '支线'
};

const EnemyDataLayout = () => ({
  component: import(
    /* webpackChunkName: "EnemyDataLayout" */ './components/EnemyDataLayout'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  components: {
    EnemyDataLayout,
    MyTitle,
    ContentSlot,
    DropList
  },
  data() {
    return {
      short: false,
      data: [],
      rowData: [],
      load: false,
      appearMap: null,
      drawer: false,
      selectedMap: '',
      selMapData: null,
      mapCode: '',
      selMapDataEx: null,
      selMapNode: null,
      detailsDropList: []
    };
  },
  computed: {
    firstDrop() {
      return this.detailsDropList.filter(el => el.dropType === 1);
    },
    commonDrop() {
      return this.detailsDropList.filter(el => el.dropType === 2);
    },
    rarityDrop() {
      return this.detailsDropList.filter(el => el.dropType === 3);
    },
    almostDrop() {
      return this.detailsDropList.filter(el => el.dropType === 4);
    },
    mapDesc() {
      console.log(changeDesc(this.selectedMap.description));
      console.log(this.selectedMap.description);
      return this.selMapDataEx ? changeDesc(this.selMapDataEx.description) : '';
    },
    mapPath() {
      return this.mapCode
        ? path + 'map/pic/' + this.mapCode + '_optimized.png'
        : mapPic;
    },
    options() {
      return !this.selMapData
        ? {}
        : Object.entries(
          Object.assign(this.selMapData.options, this.selMapDataEx)
        )
          .filter(([k, v]) => mapOptionsKey[k])
          .map(([k, v]) => [mapOptionsKey[k], v]);
    },
    stageList() {
      const change = list => {
        return Object.entries(list).map(([key, value]) => {
          if (Array.isArray(value)) {
            return {
              label: StageType[key] || key,
              children: value.map(el => {
                if (el.type && el.data) {
                  return {
                    label: '支线',
                    children: el.data.map(el => {
                      const keys = el.split(' ');
                      return {
                        label: keys.slice(0, 2).join(' '),
                        path: keys[2]
                      };
                    }) //change(el.data)
                  };
                }
                return { label: el };
              })
            };
          } else {
            return { label: StageType[key] || key, children: change(value) };
          }
        });
      };
      return change(StageList)
        .filter(el => el.label !== 'st')
        .sort((pre, cur) => (pre.label > cur.label ? -1 : 1));
    },
    direction() {
      return this.short ? 'btt' : 'rtl';
    }
  },
  created() {
    this.linkStart();
  },
  beforeMount() {
    this.short = isMoblie();
  },
  mounted() {},
  methods: {
    async testMap() {
      const parent = 'hard_05-04';
      this.mapCode = parent;
      const [mapData, exData] = await Promise.all([
        getMapData('level_' + parent),
        getMapDataLsitVer(parent)
      ]);

      console.log(mapData);
      if (mapData) {
        exData.stageDropInfo &&
          this.getItemList(exData.stageDropInfo.displayDetailRewards).then(
            data => (this.detailsDropList = data)
          );

        this.selectedMap = parent;
        this.selMapData = mapData;
        this.selMapDataEx = exData;
        const temp = {};
        Object.entries(this.rowData).forEach(([k, v]) => {
          const target = mapData.enemyDbRefs.find(el => el.id === k);
          if (target) {
            temp[k] = Object.assign(v, {
              level: target.level
            });
          }
        });
        this.data = temp;
      }
    },
    async choseMap(data, node) {
      const oneToTwo = n => {
        if (n.charAt(0) === 'H') n = '0' + n.substring(1);
        return n.length < 2 ? '0' + n : n;
      };
      if (!data.children) {
        this.selMapNode = data;
        const type = {};
        Object.entries(StageType).forEach(([key, text]) => (type[text] = key));
        let parent = '';

        while (node.parent) {
          let labelIndex = /剿灭作战/.test(node.data.label) ? 1 : 0;
          let label =
            type[node.data.label] || node.data.label.split(' ')[labelIndex];

          const sp = label.split('-');
          if (sp.length > 1) {
            label = oneToTwo(sp[0]) + '-' + oneToTwo(sp[1]);
          }
          if (/\d/.test(label) && label.length === 2) {
            label = '';
          } else if (!/sub/.test(parent)) {
            parent = parent === '' ? label : label + '_' + parent;
          } else if (/sub/.test(parent)) {
            parent = data.path;
            break;
          }
          node = node.parent;
          console.log(parent);
        }

        if (/camp/.test(parent)) {
          parent = parent
            .split('_')
            .map((el, index) => {
              console.log(index + ' ' + el);
              return index === 1 ? campToCode[el] : el;
            })
            .join('_');
        }
        this.mapCode = parent;

        this.$refs['chapter-selecter'].closeDrawer();

        console.log(parent);
        const [mapData, exData] = await Promise.all([
          getMapData('level_' + parent),
          getMapDataLsitVer(parent)
        ]);

        console.log(exData);
        if (mapData) {
          exData.stageDropInfo &&
            this.getItemList(exData.stageDropInfo.displayDetailRewards).then(
              data => (this.detailsDropList = data)
            );

          this.selectedMap = data.label;
          this.selMapData = mapData;
          this.selMapDataEx = exData;
          const temp = {};
          Object.entries(this.rowData).forEach(([k, v]) => {
            const target = mapData.enemyDbRefs.find(el => el.id === k);
            if (target) {
              temp[k] = Object.assign(v, {
                level: target.level
              });
            }
          });
          this.data = temp;
          // Object.fromEntries(
          //   Object.entries(this.rowData).filter(([key]) =>
          //     mapData.enemyDbRefs.find(el => el.id === key)
          //   )
          // );
        }
      }
    },
    linkStart() {
      return this.getData().then(data => {
        this.data = this.rowData = data[0];
        // this.appearMap = data[1];
        this.load = true;
        // this.testMap();
      });
    },
    getData() {
      return Promise.all([getEnemyList(), getEneAppearMap()]);
    },
    getItemList(list) {
      if (!list) return Promise.resolve([]);
      return Promise.all(
        list.map(async el => ({
          data: await fetchGet(
            path +
              (el.type === 'FURN'
                ? 'custom/furnitures/data/'
                : el.type === 'CHAR'
                  ? 'item/data/p_'
                  : 'item/data/') +
              el.id +
              '.json'
          ),
          type: el.type,
          dropType: el.dropType
        }))
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.chapter-wrapper {
  padding-left: 20px;
}

.map-wrapper {
  margin: 20px auto 0;
  max-width: 1500px;
  padding: 20px;
  min-width: 1000px;

  .map-title-part {
    margin: 0 0 20px;
  }

  .map-data-wrapper {
    margin-bottom: 20px;

    .map-data-container {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
    }
  }

  .map-option-container-wrapper {
    margin-left: 20px;
    max-width: 450px;
    min-width: 385px;

    .map-option-container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-content: start;

      .map-option-content {
        margin: 0 0 20px;
        width: calc(50% - 40px);
      }
    }
  }

  --height: 28vw;

  .map-left-panel {
    width: calc(var(--height) * 1.78);
    box-sizing: border-box;
  }

  .map-pic-contianer {
    height: var(--height);
    width: calc(var(--height) * 1.78);
    box-sizing: border-box;
    border: 2px solid #313131;
  }
}

@media screen and (min-width: 1800px) {
  .map-wrapper {
    --height: 500px;
  }
}

@media screen and (max-width: 700px) {
  .map-wrapper {
    --height: calc(62.5vw - 36px);
    min-width: 360px;
    box-sizing: border-box;
    padding: 3vw;

    // .map-option-container-wrapper {
    // margin-left: 20px;
    // max-width: 450px;
    // min-width: 385px;

    // .map-option-container {
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // align-content: start;

    // .map-option-content {
    // margin: 0 0 20px;
    // width: calc(50% - 40px);
    // }
    // }
    // }
    .map-option-container-wrapper {
      min-width: auto;
      margin: 20px 0;

      .map-option-container {
        min-width: auto;

        .map-option-content {
          margin: 0 10px 10px 0;
          width: calc(50% - 10px);
        }
      }
    }
  }
}
</style>

