<template>
  <div class="home-wrapper" v-loading.fullscreen.lock="load">
    <el-drawer
      ref="chapter-selecter"
      title="章节选择"
      :visible.sync="drawer"
      :size="short ? '70%' : '25%'"
      direction="ltr"
      :props="selMapNode"
      :show-close="false"
    >
      <template slot="title">
        <span>章节选择</span>
        <el-button v-if="selMapData" type="danger" size="small" @click="clearMap">取消选择</el-button>
      </template>
      <div class="chapter-wrapper">
        <el-tree
          ref="chapter-tree"
          @node-click="choseMap"
          :data="stageList"
          accordion
          node-key="path"
          :highlight-current="true"
          :auto-expand-parent="true"
          :render-after-expand="false"
        ></el-tree>
      </div>
    </el-drawer>
    <el-alert show-icon type="warning" description>
      <div slot="title">注意</div>
      <p>即将更新敌人路线、所有敌人的出现地图、其它地图数据...</p>
    </el-alert>
    <div class="map-wrapper">
      <div ref="map-title-part" class="map-title-part">
        <div>
          <el-button @click="drawer = true" type="primary">
            {{selectedMap !== '' ? selectedMap : '选择地图'}}
            <i class="el-icon-edit-outline"></i>
          </el-button>

          <el-button
            @click="loadRunes"
            v-if="selMapDataEx && selMapDataEx.stageType === 'MAIN'"
            :type="!runesMode ? '': 'warning'"
            :plain="!runesMode"
            class="runes-mode-button"
          >突袭</el-button>
        </div>
        <p ref="map-desc" v-if="selMapDataEx" :key="runesMode" v-html="mapDesc"></p>
      </div>
      <div class="map-data-wrapper">
        <div class="map-data-container">
          <div :style="!mapCode ? {width: 'auto'} : {}" class="map-left-panel">
            <div
              v-if="mapCode"
              v-loading="mapPicLoad"
              element-loading-background="rgba(0, 0, 0, 0.5)"
            >
              <el-image
                @load="mapPicLoad = false"
                class="map-pic-contianer"
                fit="fill"
                :src="mapPath"
              ></el-image>
            </div>
            <div class="left-layout">
              <my-title style="margin: 20px 0 0;" :title="selectedMap === '' ? '所有敌人' : '出现敌人'"></my-title>
              <enemy-data-layout
                ref="layout"
                :short="short"
                v-if="data"
                :data="data"
                :appear-map="appearMap"
                :map-data="selMapData"
                :runes-mode="runesMode"
              ></enemy-data-layout>
            </div>
          </div>
          <div v-if="mapCode" class="map-option-container-wrapper">
            <my-title title="地图信息"></my-title>
            <div class="map-option-container">
              <content-slot
                class="map-option-content"
                :long="true"
                :no-wrap="true"
                :width="126"
                v-for="([k,v]) in options"
                :key="k"
              >
                <template slot="title">{{k}}</template>
                <template slot="content">{{v == '999999' ? '0' : v}}</template>
              </content-slot>
            </div>

            <div class="map-drop-container-wrapper">
              <div class="map-drop-list-wrapper">
                <drop-list
                  v-if="firstDrop.length > 0"
                  :list="firstDrop"
                  :short="short"
                  title="首次掉落"
                ></drop-list>
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
              </div>
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
import DropList from './components/DropLIst';

import { Alert, Tree, Drawer, Button, Image, Loading } from 'element-ui';

import Vue from 'vue';
Vue.use(Loading);
Vue.use(Alert);
Vue.use(Button);
Vue.use(Tree);
Vue.use(Drawer);
Vue.use(Image);

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

import Mode from './stats';

import { mapOptionsKey } from './utils/string';

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
  metaInfo() {
    return {
      titleTemplate: `${
        this.selectedMap ? this.selectedMap + ' |' : ''
      }敌人图鉴 | 明日方舟`,
      meta: [
        {
          vmid: 'description',
          name: 'Description',
          content: '霜星 塔露拉 梅菲斯特 浮士德 弑君者 碎骨 W 粉碎攻坚组长'
        }
      ]
    };
  },
  components: {
    EnemyDataLayout,
    MyTitle,
    ContentSlot,
    DropList
  },
  data() {
    return {
      short: false,
      data: null,
      rowData: [],
      load: false,
      appearMap: null,
      drawer: false,
      selectedMap: '',
      selMapData: null,
      mapCode: '',
      selMapDataEx: null,
      selMapNode: null,
      detailsDropList: [],
      runesMode: false,
      pTranisitionTemp: 0,
      treeId: '',
      mapPicLoad: true
    };
  },
  computed: {
    path() {
      return (
        (process.env.NODE_ENV === 'development' ? '' : Mode) + '/enemydata/'
      );
    },
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
      return this.selMapDataEx ? changeDesc(this.selMapDataEx.description) : '';
    },
    mapPath() {
      return this.mapCode
        ? path +
        'map/pic/' +
        this.mapCode +
        '_optimized.png?x-oss-process=style/jpg-test'
        : '';
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
                } else {
                  const keys = el.split(' ');
                  return {
                    label: keys.slice(0, 2).join(' '),
                    path: keys[2]
                  };
                }
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
  mounted() { },
  methods: {
    clearMap() {
      this.data = this.rowData;
      this.mapCode = '';
      this.selectedMap = '';
      this.selMapData = null;
      this.selMapDataEx = null;
      this.runesMode = false;
      this.$refs['chapter-selecter'].closeDrawer();
      this.pTransition();
      this.$router.push(this.path);
    },
    async loadRunes() {
      // const target = this.$refs['map-title-part'];
      this.pTranisitionTemp = window.getComputedStyle(
        this.$refs['map-title-part']
      ).height;
      // target.style.transition = 'none'; // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~
      if (!this.runesMode) {
        this.selMapDataEx = await getMapDataLsitVer(this.mapCode + '%23f%23');
        this.runesMode = true;
      } else {
        this.runesMode = false;
        this.selMapDataEx = await getMapDataLsitVer(this.mapCode);
      }
      this.pTransition();
    },
    async pTransition() {
      const target = this.$refs['map-title-part'];
      target.style.height = 'auto';
      await this.$nextTick();
      const targetHeight = window.getComputedStyle(target).height;
      target.style.height = +this.pTranisitionTemp.replace('px', '') + 'px';
      setTimeout(() => {
        target.style.height = targetHeight.replace('px', '') + 'px';
      }, 50);
    },
    async loadMap() {
      const parent = this.$route.params.map; //|| 'main_05-10';
      if (!parent) return;
      const treeIndex = {
        hard: 0,
        camp: 1,
        main: 2,
        sub: 3
      };
      const splitTemp = parent.split('_');
      const pIndex = treeIndex[splitTemp[0]];
      const chapter = splitTemp[1].split('-');
      if (pIndex > 1) {
        if (pIndex < 3) {
          const nodes = this.stageList[2].children[+chapter[0]];
          const targetData = nodes.children[+chapter[1] - 1];
          this.choseMap(targetData);
        } else {
          const temp = this.stageList[2].children[+chapter[0]];
          const nodes = temp.children[temp.children.length - 1];
          console.log(chapter, pIndex, chapter, temp, nodes);

          const targetData = nodes.children[+chapter[1] - 1];

          this.choseMap(targetData);
        }
      } else {
        const index = chapter[chapter.length - 1] - 1;
        const targetData = this.stageList[pIndex].children[index];
        this.choseMap(targetData);
      }
    },
    async choseMap(data) {
      this.pTranisitionTemp = window.getComputedStyle(
        this.$refs['map-title-part']
      ).height;

      if (!data.children) {
        this.runesMode = false;
        this.selMapNode = data;
        let parent = data.path;
        console.log(parent);
        this.mapCode = parent;
        this.$refs['chapter-selecter'].closeDrawer();
        this.load = true;
        this.mapPicLoad = true;
        const [mapData, exData] = await Promise.all([
          getMapData('level_' + parent),
          getMapDataLsitVer(parent)
        ]);
        this.load = false;
        this.$router.push(this.path + parent);

        // console.log(exData);
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
              temp[k] = Object.assign({}, v, {
                level: target.level
              });
            }
          });
          this.data = temp;

          this.pTransition();
        }
      }
    },
    linkStart() {
      return this.getData().then(data => {
        this.data = this.rowData = data[0];
        this.appearMap = data[1];
        this.loadMap();
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
  padding-left: 20px
}

.map-wrapper {
  margin: 20px auto 0
  max-width: 1200px
  padding: 20px
  //min-height: 100vh删了看看
  min-width: 1100px

  .map-title-part {
    margin: 0 0 20px
    transition: height 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)
  }

  .map-data-wrapper {
    margin-bottom: 20px

    .map-data-container {
      margin-bottom: 20px
      display: flex
      flex-wrap: wrap
    }
  }

  .map-option-container-wrapper {
    margin-left: 5vw
    max-width: 450px
    min-width: 385px

    .map-option-container {
      display: flex
      justify-content: space-between
      flex-wrap: wrap
      align-content: start

      .map-option-content {
        margin: 0 0 20px
        width: calc(50% - 40px)
      }
    }
  }

  --height: 28vw

  .map-left-panel {
    width: calc(var(--height) * 1.78)
    box-sizing: border-box
  }

  .map-pic-contianer {
    height: var(--height)
    width: calc(var(--height) * 1.78)
    box-sizing: border-box
    border: 2px solid #313131
  }
}

.map-drop-list-wrapper {
  display: flex
}

.runes-mode-button {
  padding-top: 7px
  padding-bottom: 4px
  vertical-align: bottom
  border-radius: 2px
}

@media screen and (min-width: 1350px) {
  .map-wrapper {
    min-width: 100%
  }
}

@media screen and (min-width: 1500px) {
  .map-wrapper {
    --height: 500px
    min-width: 1500px
  }
}

@media screen and (max-width: 800px) {
  .map-wrapper {
    --height: calc(52.8vw)
    min-width: 360px
    box-sizing: border-box
    padding: 3vw

    .map-option-container-wrapper {
      min-width: auto
      max-width: inherit
      margin: 20px 0

      .map-option-container {
        min-width: auto
        margin-left: 2vw

        .map-option-content {
          margin: 0 10px 10px 0
          width: calc(50% - 10px)
        }
      }
    }
  }

  .map-drop-container-wrapper {
    margin-top: 10px
  }
}

@media screen and (max-width: 500px) {
  .map-drop-container-wrapper {
    margin-top: 0px
  }

  .runes-mode-button {
    padding-top: 5px
    padding-bottom: 5px
  }
}
</style>

