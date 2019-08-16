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
    <!-- 主体 -->
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
          <el-button
            @click="laodRouteMap"
            v-if="selMapDataEx"
            :type="!showMap ? '': 'warning'"
            :plain="!showMap"
            class="runes-mode-button"
          >地图</el-button>
        </div>
        <p ref="map-desc" v-if="selMapDataEx" :key="runesMode" v-html="mapDesc"></p>
      </div>
      <div class="map-data-wrapper">
        <div class="map-data-container">
          <div
            :style="!mapCode ? {width: 'auto', 'min-width': '300px'} : {}"
            class="map-left-panel"
          >
            <div
              v-if="mapCode"
              v-loading="mapPicLoad"
              element-loading-background="rgba(0, 0, 0, 0.5)"
              style="position: relative; font-size: 0"
            >
              <el-image
                @load="mapPicLoad = false"
                class="map-pic-contianer"
                fit="fill"
                :src="mapPath"
              ></el-image>
              <div id="map-canvas-container" :style="showMap ? '' : 'left: -5000px'"></div>
            </div>
            <div class="left-layout"></div>
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
      <my-title style="margin: 20px 0 0;" :title="selectedMap === '' ? '所有敌人' : '出现敌人'"></my-title>
      <enemy-data-layout
        ref="layout"
        :short="short"
        v-if="data"
        :data="data"
        :appear-map="appearMap"
        :map-data="selMapData"
        :runes-mode="runesMode"
        @showRoute="loopRoutes"
        @closeRoute="closeRoute"
      ></enemy-data-layout>
    </div>
  </div>
</template>
<script>
import loadingC from '../Loading';
import MyTitle from '../MyTitle';
import ContentSlot from '../ContentSlot';
import DropList from '../DropLIst';

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
  getMapDataListVer,
  changeDesc,
  fetchGet
} from '../../utils';

import Mode from '../../stats';

import { mapOptionsKey } from '../../utils/string';

import StageList from '../stageListPro';

import { Map } from './draw';

const StageType = {
  main: '主线',
  tr: 'TR',
  hard: '困难',
  wk: '日常',
  camp: '剿灭作战',
  guid: '教程',
  sub: '支线',
  pro: '芯片',
  a001: '第一活动'
};

const EnemyDataLayout = () => ({
  component: import(
    /* webpackChunkName: "EnemyDataLayout" */ './EnemyDataLayout'
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
      mapPicLoad: true,
      map: null,
      showMap: false
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
      return change(StageList);
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
      if (!this.runesMode) {
        this.selMapDataEx = await getMapDataListVer(this.mapCode + '%23f%23');
        this.runesMode = true;
      } else {
        this.runesMode = false;
        this.selMapDataEx = await getMapDataListVer(this.mapCode);
      }
      this.pTransition();
    },
    async pTransition() {
      const target = this.$refs['map-title-part'];
      target.style.height = 'auto';
      await this.$nextTick();
      const targetHeight = window.getComputedStyle(target).height;
      target.style.height = this.pTranisitionTemp;
      setTimeout(() => {
        target.style.height = targetHeight;
      }, 50);
    },
    async loadMap() {
      // test
      const parent = this.$route.params.map || 'main_05-10';
      console.log(parent);
      if (!parent) return;
      const splitTemp = parent.split('_');
      let groupName = splitTemp[0];
      if (groupName === 'sub') groupName = 'main';
      const group = this.stageList.find(
        el => el.label === StageType[groupName]
      );
      if (group.label === '主线') {
        const chapter = splitTemp[1].split('-');
        if (splitTemp[0] === 'main') {
          const nodes = this.stageList[0].children[+chapter[0]];
          const targetData = nodes.children[+chapter[1] - 1];
          this.choseMap(targetData);
        } else {
          //支线
          const temp = this.stageList[0].children[+chapter[0]];
          console.log(temp, this.stageList);
          const nodes = temp.children[temp.children.length - 1];
          const targetData = nodes.children[+chapter[1] - 1];
          this.choseMap(targetData);
        }
      } else {
        console.log(group);
        const targetData = group.children.find(el => el.path === parent);
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
        let dataCode = parent.replace('wk', 'weekly').replace('pro', 'promote');
        this.$refs['chapter-selecter'].closeDrawer();
        this.load = true;
        this.mapPicLoad = true;
        const [mapData, exData] = await Promise.all([
          getMapData('level_' + dataCode),
          getMapDataListVer(parent)
        ]);
        this.load = false;
        this.$router.push(this.path + parent);
        console.log(mapData);
        // console.log(exData);
        if (mapData) {
          exData.stageDropInfo &&
            this.getItemList(exData.stageDropInfo.displayDetailRewards).then(
              data => (this.detailsDropList = data)
            );
          this.data = Object.entries(this.rowData).reduce((res, [k, v]) => {
            const target = mapData.enemyDbRefs.find(el => el.id === k);
            if (target) {
              res[k] = Object.assign(v, { level: target.level });
              return res;
            } else return res;
          }, {});
          console.log(this.data);
          this.selectedMap = data.label;
          this.selMapData = mapData;
          this.selMapDataEx = exData;
          this.pTransition();
          if (this.map) this.map.setData(mapData.mapData, mapData.routes);
          else {
            const { mapData: md, routes: r } = mapData;
            await this.$nextTick();
            this.map = new Map('#map-canvas-container', 100, md, r);
          }
        }
      }
    },
    async loopRoutes(index, color) {
      console.log(index, color);
      this.showMap = true;
      await this.$nextTick();
      this.map.loadMap();
      if (!this.selMapData.routes[index]) return;
      this.map.addRoutes(index, color);
    },
    async laodRouteMap() {
      if (this.showMap) {
        this.showMap = false;
      } else {
        if (this.map) {
          this.showMap = true;
          await this.$nextTick();
          this.map.loadMap();
        } else throw Error('no map ?');
      }
    },
    closeRoute(index) {
      console.log('close', index);
      this.map.deleteRoute(index);
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
.chapter-wrapper
  padding-left: 20px

.map-wrapper
  margin: 20px auto 0
  max-width: 1200px
  padding: 20px
  min-width: 1100px
  min-height: 100vh
  display: flex
  flex-direction: column
  overflow: hidden

  .map-title-part
    margin: 0 0 20px
    transition: height 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)

  .map-data-wrapper
    margin-bottom: 20px

    .map-data-container
      margin-bottom: 20px
      display: flex
      flex-wrap: wrap

  --height: 28vw

  .map-left-panel
    width: calc(var(--height) * 1.78)
    box-sizing: border-box

  .map-pic-contianer
    height: var(--height)
    width: calc(var(--height) * 1.78)
    box-sizing: border-box
    border: 2px solid #313131
    //opacity: 0.5

.map-option-container-wrapper
  margin-left: 5vw
  max-width: 450px
  min-width: 385px

  .map-option-container
    display: flex
    justify-content: space-between
    flex-wrap: wrap
    align-content: start

    .map-option-content
      margin: 0 0 20px
      width: calc(50% - 40px)

.map-drop-list-wrapper
  display: flex

.runes-mode-button
  padding-top: 4px
  padding-bottom: 4px
  vertical-align: bottom
  border-radius: 2px

#map-canvas-container
  position: absolute
  height: 100%
  width: 100%
  top: 0
  transform: perspective(500px) rotateX(18deg) translate3d(0px, -10px, -20px)

@media screen and (min-width: 1350px)
  .map-wrapper
    min-width: 100%
    //--height: 68vw

@media screen and (min-width: 1500px)
  .map-wrapper
    --height: 500px
    //--height: 50vw
    min-width: 1600px

@media screen and (max-width: 800px)
  .map-wrapper
    --height: calc(52.8vw)
    min-width: 360px
    box-sizing: border-box
    padding: 3vw

    .map-option-container-wrapper
      min-width: auto
      max-width: inherit
      margin: 20px 0

      .map-option-container
        min-width: auto
        margin-left: 2vw

        .map-option-content
          margin: 0 10px 10px 0
          width: calc(50% - 10px)

  .map-drop-container-wrapper
    margin-top: 10px

@media screen and (max-width: 500px)
  .map-drop-container-wrapper
    margin-top: 0px

  .runes-mode-button
    padding-top: 5px
    padding-bottom: 5px
</style>

