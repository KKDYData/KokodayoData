<template>
  <div
    class="home-wrapper"
    v-loading.fullscreen.lock="load"
    element-loading-background="rgba(168, 168, 168, 0.1)"
  >
    <!-- 地图选择的抽屉 -->
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
          :data="stageTree"
          accordion
          node-key="path"
          :highlight-current="true"
          :auto-expand-parent="true"
          :render-after-expand="false"
        ></el-tree>
      </div>
    </el-drawer>
    <!-- 主体 -->

    <div class="map-wrapper">
      <!-- 地图信息、控制栏 -->
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
              element-loading-background="rgba(0, 0, 0, 0.8)"
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
          <enemy-map-info
            v-if="!short && mapCode"
            :short="short"
            :options="options"
            :dropInfo="detailsDropList"
          ></enemy-map-info>
        </div>
      </div>
      <my-slide-title
        :control="mapCode ? true : false"
        style="margin: 20px 0 0;"
        :short="short"
        :title="selectedMap === '' ? '所有敌人' : '出现敌人'"
      >
        <div slot="extra-button">
          <el-button
            v-if="!simpleShow && mapCode"
            size="mini"
            type="danger"
            class="clear-route-button"
            @click="clearRoutes"
          >清空路线</el-button>
          <el-button
            v-if="mapCode"
            size="mini"
            type="info"
            :plain="simpleShow ? false: true"
            class="clear-route-button"
            @click="simpleShow = !simpleShow"
          >{{simpleShow ? '简要显示': '路线模式'}}</el-button>
        </div>
        <enemy-data-layout
          ref="layout"
          :short="short"
          v-if="data"
          :data="data"
          :appear-map="appearMap"
          :map-data="selMapData"
          :runes-mode="runesMode"
          :simple-show="simpleShow"
          @showRoute="loopRoutes"
          @closeRoute="closeRoute"
        ></enemy-data-layout>
      </my-slide-title>
      <my-slide-title style="margin-top: 20px" v-if="short && mapCode" title="地图信息" :short="short">
        <enemy-map-info :show-title="false" :short="short" :options="options"></enemy-map-info>
      </my-slide-title>
      <map-drop-list style="margin-top: 20px" :short="short" :drop-info="detailsDropList"></map-drop-list>
    </div>
  </div>
</template>
<script>
import loadingC from '../Loading';
import MyTitle from '../MyTitle';
import MySlideTitle from '../MySlideTilte';
import ContentSlot from '../ContentSlot';
import MapDropList from './MapDropList';
import EnemyMapInfo from './EnemyMapInfo';


import { Tree, Drawer, Button, Image, Loading } from 'element-ui';

import Vue from 'vue';
import { mapState } from 'vuex';

Vue.use(Loading);
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
  fetchGet,
  findStage
} from '../../utils';

import Mode from '../../stats';

import { mapOptionsKey } from '../../utils/string';

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
      titleTemplate: `${this.selectedMap
        ? this.selectedMap + ' |' : ''}敌人图鉴 | 明日方舟`,
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
    MySlideTitle,
    ContentSlot,
    MapDropList,
    EnemyMapInfo
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
      showMap: false,
      watchTree: false,
      simpleShow: false
    };
  },
  watch: {
    stageTree(v) {
      if (v && this.watchTree) this.loadMap();
      this.watchTree = false;
    }
  },
  computed: {
    ...mapState(['stageTree']),
    path() {
      return (
        (process.env.NODE_ENV === 'development' ? '' : Mode) + '/enemydata/'
      );
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
      const parent = this.$route.params.map; //|| 'main_05-10';
      if (!parent || !this.stageTree) return;
      console.log(parent);
      const target = findStage(parent, this.stageTree);
      target.first = true;
      if (target) this.choseMap(target);
    },
    async choseMap(data, node, first) {
      this.pTranisitionTemp = window.getComputedStyle(
        this.$refs['map-title-part']
      ).height;

      if (!data.children) {
        this.runesMode = false;
        this.selMapNode = data;
        let codeFromPath = data.path;
        let shortCode = codeFromPath.replace('weekly', 'wk').replace('promote', 'pro');
        this.mapCode = shortCode;
        this.$refs['chapter-selecter'].closeDrawer();
        this.load = true;
        this.mapPicLoad = true;
        // 不用路由守卫了
        if (!data.first) this.$router.push(this.path + shortCode);
        else console.log('first? ', first);

        const [mapData, exData] = await Promise.all([
          getMapData('level_' + codeFromPath.replace('kc', 'killcost')),
          getMapDataListVer(shortCode)
        ]);

        setTimeout(() => {
          this.load = false;
          this.mapPicLoad = false;
        }, 500);

        if (mapData) {
          exData.stageDropInfo &&
            this.getItemList(exData.stageDropInfo.displayDetailRewards).then(
              data => (this.detailsDropList = data)
            );

          if (this.$refs.layout) this.$refs.layout.clearRoutes(true);
          this.data = Object.entries(this.rowData).reduce((res, [k, v]) => {
            const target = mapData.enemyDbRefs.find(el => el.id === k);
            if (target) {
              res[k] = Object.assign(v, { level: target.level });
              return res;
            } else return res;
          }, {});
          this.selectedMap = data.label;
          this.selMapData = mapData;
          this.selMapDataEx = exData;
          this.pTransition();
          if (this.map) this.map.setData(mapData.mapData, mapData.routes);
          else {
            const body = document.querySelector('head');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = async () => {
              const { Map } = await import('./draw');
              await this.$nextTick();
              this.map = new Map('#map-canvas-container', 100, mapData.mapData, mapData.routes);
            };
            script.src = 'https://unpkg.com/spritejs/dist/spritejs.min.js';
            body.appendChild(script);
          }
        }
      }
    },
    // 子组件传出来清空map的事件处理
    clearRoutes() {
      this.map.clearRoutes();
      this.$refs.layout.clearRoutes();
    },
    async loopRoutes(index, color) {
      console.log(index, color);
      if (!this.showMap) {
        this.showMap = true;
        await this.$nextTick();
        this.map.loadMap();
      }
      if (!this.selMapData.routes[index]) throw Error('没有这个线路');
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
        if (this.stageTree) this.loadMap();
        else this.watchTree = true;
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
  margin-bottom: 70px
}

.map-wrapper {
  margin: 20px auto 0
  max-width: 1200px
  padding: 20px
  //min-width: 1000px
  min-height: 100vh
  display: flex
  flex-direction: column
  overflow: hidden

  .map-title-part {
    margin: 0 0 20px
    transition: height 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)
  }

  .map-data-wrapper {
    .map-data-container {
      margin-bottom: 20px
      display: flex
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
    //opacity: 0.5
  }
}

.runes-mode-button {
  padding-top: 4px
  padding-bottom: 4px
  vertical-align: bottom
  border-radius: 2px
}

#map-canvas-container {
  position: absolute
  height: 100%
  width: 100%
  top: 0
  transform: perspective(500px) rotateX(18deg) translate3d(0px, -10px, -20px)
}

.clear-route-button {
  //background-color: #ffffff
}

@media screen and (min-width: 1350px) {
  .map-data-container {
    margin-bottom: 20px
    display: flex
    flex-wrap: wrap
  }

  .map-wrapper {
    min-width: 100%
    //--height: 68vw
  }
}

@media screen and (min-width: 1500px) {
  .map-wrapper {
    --height: 500px
    //--height: 50vw
    min-width: 1600px
  }
}

@media screen and (max-width: 800px) {
  .map-wrapper {
    --height: calc(52.8vw)
    min-width: 360px
    box-sizing: border-box
    padding: 3vw
  }
}

@media screen and (max-width: 500px) {
  .runes-mode-button {
    padding-top: 5px
    padding-bottom: 5px
  }

  .chapter-wrapper {
    //margin-bottom 有70px， 1px防止滚动穿透
    min-height: calc(100% - 69px)
  }
}
</style>

