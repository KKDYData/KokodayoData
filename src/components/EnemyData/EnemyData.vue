<template>
  <div
    v-loading.fullscreen.lock="load"
    class="home-wrapper"
    element-loading-background="rgba(168, 168, 168, 0.1)"
  >
    <!-- 地图选择的抽屉 -->
    <el-drawer
      ref="chapter-selecter"
      title="章节选择"
      :visible.sync="drawer"
      :size="short ? '70%' : drawerSize"
      direction="ltr"
      :props="selMapNode"
      :show-close="false"
    >
      <template slot="title">
        <span>章节选择</span>
        <el-button v-if="selMapData" type="danger" size="small" @click="$router.push(path)">取消选择</el-button>
      </template>
      <div class="chapter-wrapper">
        <el-tree
          ref="chapter-tree"
          :data="stageTree"
          accordion
          node-key="path"
          :highlight-current="true"
          :auto-expand-parent="true"
          :render-after-expand="false"
          @node-click="changeMapCode"
        />
      </div>
    </el-drawer>
    <!-- 主体 -->

    <div class="map-wrapper">
      <!-- 地图信息、控制栏 -->
      <div ref="map-title-part" class="map-title-part">
        <div>
          <el-button type="primary" @click="drawer = true">
            {{ selectedMap !== '' ? selectedMap : '选择地图' }}
            <i class="el-icon-edit-outline" />
          </el-button>

          <span :style="short ? 'margin-top: 10px; display: block' : ''">
            <el-button
              v-if="selMapDataEx && (selMapDataEx.hardStagedId || selMapDataEx.difficulty === 'FOUR_STAR')"
              :type="!runesMode ? '': 'warning'"
              :plain="!runesMode"
              class="runes-mode-button"
              @click="loadRunes"
            >突袭</el-button>
            <el-button
              v-if="selMapDataEx"
              :type="!showMap ? '': 'warning'"
              :plain="!showMap"
              class="runes-mode-button"
              @click="openMap"
            >地图</el-button>
            <el-button
              v-if="devMode === 'beta' && selMapDataEx"
              :type="!showMap ? '': 'warning'"
              :plain="!showMap"
              class="runes-mode-button"
              @click="loopAllRoutes"
            >加载所有路线</el-button>

            <el-tooltip v-if="mapCode && showMap" class="runes-mode-button">
              <el-button type="info">地图说明</el-button>
              <div slot="content">
                <p>白色是路，浅黄是不能放干员的路，</p>
                <p>蓝色是能放干员的高台, 橙色是隧道出入口，深蓝是坑</p>
                <p>粉色或者其它颜色是特别功能地板，点击查看效果</p>
              </div>
            </el-tooltip>
          </span>
        </div>
        <div v-if="selMapDataEx" ref="map-desc" style="margin-left: 5px">
          <p v-if="selMapDataEx.dangerLevel !== '-'" style="font-size: 0.9em">
            <span>推荐等级</span>
            <span style="color: #f49800;">{{ selMapDataEx.dangerLevel }}</span>
          </p>
          <p :key="runesMode" style="font-size: 0.9em" v-html="mapDesc" />
        </div>
      </div>
      <div class="map-data-wrapper">
        <el-alert
          v-if="isEdge && showMap"
          type="error"
          :closable="false"
        >旧版Edge 不支持translateZ, 所以请考虑使用手机或者其它浏览器，或者试下那个新版的Edge</el-alert>
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
                class="map-pic-contianer"
                fit="fill"
                :src="mapPath"
                @load="mapPicLoad = false"
                @error="loadPicFalse"
              />
              <canvas
                v-show="showMap"
                id="map-canvas-container"
                ref="canvas"
                width="890"
                height="500"
              />
            </div>
            <div class="left-layout" />
          </div>
          <enemy-map-info
            v-if="!short && mapCode"
            :options="options"
            :drop-info="detailsDropList"
            :global-buffs="globalBuffs"
            :wave-time="waveTime"
          />
        </div>
      </div>
      <my-slide-title
        v-if="data"
        ref="layout-control"
        :control="mapCode ? true : false"
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
            @click="simpleShow = !simpleShow"
          >
            <i class="el-icon-refresh" />
            {{ simpleShow ? '简要显示': '路线模式' }}
          </el-button>
          <el-tooltip v-if="mapCode && !simpleShow">
            <el-button type="info" size="mini">说明</el-button>
            <div slot="content">
              <p>假设这波开始的时间是2分10秒, 敌人延迟4秒，间隔30</p>
              <p>在上面地图方块中出现X秒的意思是</p>
              <p>会在这个标出时间的方块上停留X秒</p>
              <p>延迟4s，就是这个敌人2分14秒的时候出发</p>
              <p>数量2，间隔30秒</p>
              <p>就是2分44秒之后会有第2个一样的敌人也走这一条线路</p>
            </div>
          </el-tooltip>
        </div>
        <!-- 不能用margin会影响动画，margin合并 -->
        <enemy-data-layout
          v-if="!load && data"
          ref="layout"
          :style="short && !mapCode? 'margin-top: -10px':'padding-top: 20px'"
          :data="data"
          :map-data="selMapData"
          :runes-mode="runesMode"
          :simple-show="simpleShow"
          @showRoute="loopRoutes"
          @closeRoute="loopRoutes"
        />
      </my-slide-title>
      <my-slide-title v-if="short && mapCode" title="地图信息">
        <enemy-map-info
          style="margin-top: 20px"
          :show-title="false"
          :options="options"
          :global-buffs="globalBuffs"
          :wave-time="waveTime"
        />
      </my-slide-title>
      <my-slide-title v-if="mapCode && showPredefine && preData" title="地图预设">
        <map-pre-defined
          style="margin-top: 10px"
          :pre-data="selMapData.predefines"
          :data="preData"
          :runes-data="runesMode ? selMapData.runes : null"
        />
      </my-slide-title>
      <!-- 一不小心吧silde写到dropList里面了，不过效果一样，不管了 -->
      <map-drop-list
        v-if="mapCode && detailsDropList.length > 0"
        style="margin-top: 20px"
        :drop-info="detailsDropList"
        :target-stage="mapCode"
      />
    </div>
  </div>
</template>
<script>
import loadingC from '../base/Loading';
import MySlideTitle from '../base/MySlideTilte';
import MapDropList from './MapDropList';
import EnemyMapInfo from './EnemyMapInfo';
import MapPreDefined from './MapPreDefined';

import { initSomeMap } from './initData.js';




import { Tree, Drawer, Button, Image, Loading, Message } from 'element-ui';

import Vue from 'vue';
import { mapState } from 'vuex';

Vue.use(Loading);
Vue.use(Button);
Vue.use(Tree);
Vue.use(Drawer);
Vue.use(Image);

import {
  changeDesc,
  findStage,
  preDefineGet,
  UA,
  findValue
} from '../../utils';

import {
  getEnemyList,
  getMapData,
  getMapDataListVer,
  getCharItem,
  getItem,
  getFurn,
} from '../../utils/fetch';

import { path } from '../../utils/listVer';


import { mapOptionsKey } from '../../utils/string';
import { devMode, rootPath } from '../../stats';

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
        this.selectedMap ? this.selectedMap + ' |' : ''}敌人图鉴 | 明日方舟`,
      meta: [
        {
          vmid: 'description',
          name: 'Description',
          content: this.selectedMap
            ? this.mapDesc
            : '霜星 塔露拉 梅菲斯特 浮士德 弑君者 碎骨 W 粉碎攻坚组长'
        }
      ]
    };
  },
  components: {
    EnemyDataLayout,
    MySlideTitle,
    MapDropList,
    EnemyMapInfo,
    MapPreDefined
  },
  data() {
    const browser = UA.Browser;
    return {
      data: null,
      rowData: [],
      load: false,
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
      showMap: true,
      watchTree: false,
      simpleShow: true,
      preData: null,
      map: null,
      mapUp: null,
      isEdge: browser.name === 'Edge' && browser.major < 19,
      devMode
    };
  },
  computed: {
    ...mapState(['stageTree', 'screenWidth', 'short']),
    drawerSize() {
      return Math.floor((300 / this.screenWidth) * 100) + '%';
    },
    waveTime() {
      let enemyNum = 0;
      // 看起来像是简单算个时间，但是实际上，顺便把数量和每波开始的时间加进数据了
      return this.selMapData
        ? this.selMapData.waves.reduce(
          (wRes, cur) =>
            wRes +
            cur.preDelay +
            cur.postDelay +
            cur.fragments.reduce((fRes, cur) => {
              let fTemp = fRes + cur.preDelay;
              cur.time = fTemp;

              enemyNum = cur.enemyNum = cur.actions.reduce((res, el) => {
                if (el.actionType === 0) return res + el.count;
                else return res;
              }, enemyNum);

              fTemp += cur.actions.reduce((res, cur) => {
                const curTime = cur.preDelay + cur.interval * cur.count;
                // 找出每波最长的
                return Math.max(res, curTime);
              }, 0);
              return fTemp;
            }, 0),
          0
        )
        : 0;
    },

    showPredefine() {
      if (!this.selMapData || !this.selMapData.predefines) return false;
      return (
        Object.values(this.selMapData.predefines).reduce(
          (res, cur) => (res += cur.length),
          0
        ) > 0
      );
    },
    path() {
      return (
        (process.env.NODE_ENV === 'development' ? '' : rootPath) + '/enemydata/'
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
    globalBuffs() {
      if (!this.selMapData) return [];
      const BuffKeys = {
        kill_to_add_cost: '杀敌额外回复',
        periodic_damage: '地图周期伤害'
        // ebuff_attribute: '属性增益'
      };
      const globalBuffs = this.selMapData.globalBuffs
        ? this.selMapData.globalBuffs
        : [];
      const target = this.runesMode
        ? [...globalBuffs, ...this.selMapData.runes]
        : [...globalBuffs];
      return target
        .map(({ prefabKey, key, blackboard }) => {
          const k = prefabKey ? prefabKey : key;
          if (BuffKeys[k]) return [BuffKeys[k], blackboard];
        })
        .filter(el => el);
    },
    options() {
      return !this.selMapData
        ? []
        : Object.entries(
          Object.assign(this.selMapData.options, this.selMapDataEx)
        )
          .filter(([k, v]) => mapOptionsKey[k])
          .map(([k, v]) => {
            v = k === 'costIncreaseTime' ? Math.round(10 / v) / 10 : v;
            let costBuff;
            if (this.runesMode) {
              if (k === 'maxLifePoint') {
                const lifePointBuff = findValue(this.selMapData, 'runes', 'gbuff_lifepoint');
                if (lifePointBuff) {
                  v = findValue(lifePointBuff, 'blackboard', 'value').value;
                }
              }
              if (k === 'costIncreaseTime' && (costBuff = findValue(this.selMapData, 'runes', 'cbuff_cost_recovery'))) {
                // 暂时只保留0.3，不然会换行
                v = Math.round((v / findValue(costBuff, 'blackboard', 'scale').value) * 10) / 10;
              }
            }
            return [mapOptionsKey[k], v];
          });
    },
    direction() {
      return this.short ? 'btt' : 'rtl';
    }
  },
  watch: {
    stageTree(v) {
      if (v && this.watchTree) this.loadMap();
      this.watchTree = false;
    },
    preData(v) {
      if (
        v &&
        Object.values(v).reduce((res, cur) => res + cur.length, 0) > 0 &&
        this.map
      ) {
        console.log('load predefinedData');
        this.map = initSomeMap(
          this.selMapData,
          this.$refs.canvas,
          this.preData,
          this.t,
          this.p
        );
      }
    }
  },
  created() {
    this.linkStart();
  },
  mounted() {
    // this.choseMap();
  },

  methods: {
    loadPicFalse() {
      Message.info('游戏地图的预览图片缺失，但是地图数据还是有的，敌人的路线一样可以看, 3s后自动打开地图');
      setTimeout(() => {
        this.openMap();
      }, 3000);
    },
    clearMap() {
      this.$refs['chapter-selecter'].closeDrawer();
      this.data = this.rowData;
      this.mapCode = '';
      this.selectedMap = '';
      this.selMapData = null;
      this.selMapDataEx = null;
      this.runesMode = false;
      this.preData = null;
      this.pTransition();
    },
    async loadRunes() {
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
    // 让每个地图的文字说明高度变化地更好看的动画函数，需要先设置好pTranisitionTemp，保存原先的高度
    async pTransition() {
      const target = this.$refs['map-title-part'];
      target.style.height = 'auto';
      await this.$nextTick();
      if (!target) return;
      const targetHeight = window.getComputedStyle(target).height;
      target.style.height = this.pTranisitionTemp;
      setTimeout(() => {
        target.style.height = targetHeight;
      }, 50);
    },
    async loadMap(map) {
      const parent = map || this.$route.params.map;
      if (!parent || !this.stageTree) return;
      const target = findStage(parent, this.stageTree);
      if (target) {
        this.mapCode = target.path
          .replace('weekly', 'wk')
          .replace('promote', 'pro');
        this.choseMap(target);
      } else {
        console.log('没有这个地图，路由失败');
      }
    },
    // 选择章节
    changeMapCode(data) {
      if (!data.children) {
        this.$refs['chapter-selecter'].closeDrawer();
        this.load = true;
        this.mapPicLoad = true;

        this.runesMode = false;
        this.selMapNode = data;
        let codeFromPath = data.path;
        let shortCode = codeFromPath
          .replace('weekly', 'wk')
          .replace('promote', 'pro');
        this.mapCode = shortCode;
        this.$router.push(this.path + shortCode);

        setTimeout(() => {
          this.load = false;
          this.mapPicLoad = false;
          this.$refs['layout-control'].click(true);
        }, 500);
      }
    },
    async choseMap(data) {
      const [mapData, exData] = await Promise.all([
        getMapData('level_' + data.path.replace('kc', 'killcost')),
        getMapDataListVer(this.mapCode)
      ]).catch(err => {
        Message.error('获取数据失败');
        return [];
      });

      if (mapData) {
        this.pTranisitionTemp = window.getComputedStyle(
          this.$refs['map-title-part']
        ).height;

        exData.stageDropInfo &&
          this.getItemList(exData.stageDropInfo.displayDetailRewards).then(
            data => (this.detailsDropList = data)
          );

        if (this.$refs.layout) this.$refs.layout.clearRoutes(true);
        this.data = Object.entries(this.rowData).reduce((res, [k, v]) => {
          const target = mapData.enemyDbRefs.find(el => el.id === k);
          if (target) {
            res[k] = Object.assign({}, v, target);
            return res;
          } else return res;
        }, {});
        this.selectedMap = data.label;
        this.selMapData = mapData;
        this.selMapDataEx = exData;
        this.getPreData();
        this.pTransition();


        // 去掉地图的loading遮罩
        this.mapPicLoad = false;
        this.map = null;
        await this.$nextTick();
        this.map = initSomeMap(
          mapData,
          this.$refs.canvas,
          this.preData,
          this.t,
          this.p
        );


      }
    },
    // 子组件传出来清空map的事件处理
    clearRoutes() {
      console.log('clear map');
      this.map.deleteAll();
      this.$refs.layout.clearRoutes();
    },
    checkCodeBase() {
      if (!this.map) {
        Message('地图数据还没加载完成，等一会再看看吧');
        return false;
      } else return true;
    },
    loopRoutes(index, color) {
      if (!this.checkCodeBase()) return;

      if (!this.showMap) {
        this.showMap = true;
      }
      const route = this.selMapData.routes[index];
      console.log(index, color, route);
      if (!route) throw Error('没有这个线路');
      this.map.loopRoute(index, color);
    },
    loopAllRoutes() {
      if (this.checkCodeBase()) {
        console.log('load all routes begin');
        this.showMap = true;
        this.map.loopRoutes();
      } else {
        this.openMap();
        setTimeout(this.loopAllRoutes, 500);
      }
    },
    openMap() {
      if (this.showMap) {
        this.showMap = false;
      } else {
        if (this.checkCodeBase()) {
          this.showMap = true;
        } else {
          Message('地图数据还没加载完成，请重试');
        }
      }
    },
    linkStart() {
      return this.getData().then(data => {
        this.data = this.rowData = data[0];
        // this.appearMap = data[1];
        if (this.stageTree) this.loadMap();
        else this.watchTree = true;
      });
    },
    getData() {
      return Promise.all([getEnemyList()]);
    },
    getItemList(list) {
      if (!list) return Promise.resolve([]);
      return Promise.all(
        list.map(async el => ({
          data: await (el.type === 'FURN'
            ? getFurn(el.id)
            : el.type === 'CHAR'
              ? getCharItem(el.id)
              : getItem(el.id)),
          type: el.type,
          dropType: el.dropType
        }))
      );
    },
    async getPreData() {
      this.preData = null;
      const data = this.selMapData.predefines;
      if (!data) return;
      const tasks = [
        preDefineGet('tokenInsts', data),
        preDefineGet('tokenCards', data),
        preDefineGet('characterInsts', data),
        preDefineGet('characterCards', data)
      ];
      const [
        tokenInsts,
        tokenCards,
        characterInsts,
        characterCards
      ] = await Promise.all(tasks);
      this.preData = { tokenInsts, tokenCards, characterInsts, characterCards };
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
  //有空再算一下，到底应该给多少，先随便给个80
  min-height: 80vh
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
  left: 0
}

filter() {
  -moz-filter: arguments
  -webkit-filter: arguments
  -o-filter: arguments
  -ms-filter: arguments
  filter: arguments
}

@media screen and (min-width: 1350px) {
  .map-data-container {
    margin-bottom: 20px
    display: flex
    flex-wrap: wrap
  }

  .map-wrapper {
    min-width: calc(100% - 40px)
  }
}

@media screen and (min-width: 1500px) {
  .map-wrapper {
    --height: 500px
  }
}

@media screen and (min-width: 1600px) {
  .map-wrapper {
    --height: 500px
    min-width: 1520px
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

