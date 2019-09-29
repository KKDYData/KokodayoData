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
      :size="short ? '70%' : drawerSize"
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

          <span :style="short ? 'margin-top: 10px; display: block' : ''">
            <el-button
              @click="loadRunes"
              v-if="selMapDataEx && (selMapDataEx.hardStagedId || selMapDataEx.difficulty === 'FOUR_STAR')"
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
        <div style="margin-left: 5px" ref="map-desc" v-if="selMapDataEx">
          <p style="font-size: 0.9em" v-if="selMapDataEx.dangerLevel !== '-'">
            <span>推荐等级</span>
            <span style="color: #f49800;">{{selMapDataEx.dangerLevel}}</span>
          </p>
          <p style="font-size: 0.9em" :key="runesMode" v-html="mapDesc"></p>
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
                @load="mapPicLoad = false"
                class="map-pic-contianer"
                fit="fill"
                :src="mapPath"
              ></el-image>
              <div id="map-canvas-container" :style="showMap ? '' : 'left: -5000px'"></div>
              <div
                id="map-canvas-container-up"
                :style="isEdge ? 'transform: perspective(1200px) rotateX(40deg); filter: none' : ''"
                :class="showMap ? '' : 'map-canvas-bottom'"
              ></div>
            </div>
            <div class="left-layout"></div>
          </div>
          <enemy-map-info
            v-if="!short && mapCode"
            :options="options"
            :dropInfo="detailsDropList"
            :global-buffs="globalBuffs"
            :wave-time="waveTime"
          ></enemy-map-info>
        </div>
      </div>
      <my-slide-title
        v-if="data"
        :control="mapCode ? true : false"
        :title="selectedMap === '' ? '所有敌人' : '出现敌人'"
        ref="layout-control"
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
            <i class="el-icon-refresh"></i>
            {{simpleShow ? '简要显示': '路线模式'}}
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
          :style="short && !mapCode? 'margin-top: -10px':'padding-top: 20px'"
          ref="layout"
          v-if="!load && data"
          :data="data"
          :map-data="selMapData"
          :runes-mode="runesMode"
          :simple-show="simpleShow"
          @showRoute="loopRoutes"
          @closeRoute="closeRoute"
        ></enemy-data-layout>
      </my-slide-title>
      <my-slide-title v-if="short && mapCode" title="地图信息">
        <enemy-map-info
          style="margin-top: 20px"
          :show-title="false"
          :options="options"
          :global-buffs="globalBuffs"
          :wave-time="waveTime"
        ></enemy-map-info>
      </my-slide-title>
      <my-slide-title v-if="mapCode && showPredefine && preData" title="地图预设">
        <map-pre-defined
          style="margin-top: 10px"
          :pre-data="selMapData.predefines"
          :data="preData"
          :runes-data="runesMode ? selMapData.runes : null"
        ></map-pre-defined>
      </my-slide-title>
      <!-- 一不小心吧silde写到dropList里面了，不过效果一样，不管了 -->
      <map-drop-list
        v-if="mapCode && detailsDropList.length > 0"
        style="margin-top: 20px"
        :drop-info="detailsDropList"
        :target-stage="mapCode"
      ></map-drop-list>
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
import MapPreDefined from './MapPreDefined';


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
} from '../../utils';

import {
  getEnemyList,
  getMapData,
  getMapDataListVer,
  getCharItem,
  getItem,
  getFurn,
  importSpriteJs,
} from '../../utils/fetch';

import { path } from '../../utils/listVer';

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
          content: this.selectedMap ? this.mapDesc :
            '霜星 塔露拉 梅菲斯特 浮士德 弑君者 碎骨 W 粉碎攻坚组长'
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
      showMap: false,
      watchTree: false,
      simpleShow: true,
      preData: null,
      map: null,
      mapUp: null,
      isEdge: browser.name === 'Edge' && browser.major < 19
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
      return this.selMapData ? this.selMapData.waves.reduce((wRes, cur) =>
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
        }, 0)
      , 0) : 0;

    },

    showPredefine() {
      if (!this.selMapData || !this.selMapData.predefines) return false;
      return Object.values(this.selMapData.predefines).reduce((res, cur) => res += cur.length, 0) > 0;
    },
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
    globalBuffs() {
      if (!this.selMapData) return {};
      const BuffKeys = {
        kill_to_add_cost: '杀敌额外回复',
        periodic_damage: '地图周期伤害',
        // ebuff_attribute: '属性增益'
      };
      const globalBuffs = this.selMapData.globalBuffs ? this.selMapData.globalBuffs : [];
      const target = this.runesMode ? [...globalBuffs, ...this.selMapData.runes] : [...globalBuffs];
      return target
        .map(({ prefabKey, key, blackboard }) => {
          const k = prefabKey ? prefabKey : key;
          if (BuffKeys[k]) return [BuffKeys[k], blackboard];
        }).filter(el => el);
    },
    options() {
      return !this.selMapData ? {}
        : Object.entries(Object.assign(this.selMapData.options, this.selMapDataEx))
          .filter(([k, v]) => mapOptionsKey[k])
          .map(([k, v]) => {
            if (this.runesMode) {
              if (k === 'maxLifePoint') {
                const lifePointBuff = this.selMapData.runes.find(el => el.key === 'gbuff_lifepoint');
                if (lifePointBuff) {
                  v = lifePointBuff.blackboard.find(el => el.key === 'value').value;
                }
              }
              if (k === 'costIncreaseTime') {
                const costBuff = this.selMapData.runes.find(el => el.key === 'cbuff_cost_recovery');
                if (costBuff) {
                  // 暂时只保留0.3，不然会换行
                  v = Math.round(v / costBuff.blackboard.find(el => el.key === 'scale').value * 10) / 10;
                }
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
      if (v && Object.values(v).reduce((res, cur) => res + cur.length, 0) > 0 && this.map) {
        console.log('load predefinedData');
        this.map.setData(this.selMapData, this.preData);
        this.mapUp.setData(this.selMapData, this.preData);
      }
    }
  },
  created() {
    this.linkStart();
  },


  methods: {
    clearMap() {
      this.data = this.rowData;
      this.mapCode = '';
      this.selectedMap = '';
      this.selMapData = null;
      this.selMapDataEx = null;
      this.runesMode = false;
      this.preData = null;
      this.pTransition();
      this.$router.push(this.path);
      setTimeout(() => {
        // pc端关闭会反复弹出，怀疑是enemy-layout大幅变化导致pc有这个问题,移动端没事
        this.$refs['chapter-selecter'].closeDrawer();
      }, 100);
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
      if (!target) return;
      const targetHeight = window.getComputedStyle(target).height;
      target.style.height = this.pTranisitionTemp;
      setTimeout(() => {
        target.style.height = targetHeight;
      }, 50);
    },
    async loadMap() {
      const parent = this.$route.params.map; //|| 'main_05-10';
      if (!parent || !this.stageTree) return;
      console.log(parent);
      const target = findStage(parent, this.stageTree);
      if (target) this.choseMap({ ...target, first: true });
    },
    async choseMap(data, node) {
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
        // 不用路由守卫了,改起来过于麻烦
        if (!data.first) this.$router.push(this.path + shortCode);
        else console.log('first? ');

        const [mapData, exData] = await Promise.all([
          getMapData('level_' + codeFromPath.replace('kc', 'killcost')),
          getMapDataListVer(shortCode)
        ]).catch(err => {
          Message.error('获取数据失败');
          return [];
        });


        setTimeout(() => {
          this.load = false;
          this.mapPicLoad = false;
          this.$refs['layout-control'].click(true);
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
              res[k] = Object.assign({}, v, target);
              return res;
            } else return res;
          }, {});
          this.selectedMap = data.label;
          this.selMapData = mapData;
          this.selMapDataEx = exData;
          this.getPreData();
          this.pTransition();
          if (this.map) {
            this.map.setData(mapData, this.preData);
            this.mapUp.setData(mapData, this.preData);
          } else {
            const initMap = async () => {
              const { Map } = await import('./draw');
              await this.$nextTick();
              this.map = new Map('#map-canvas-container', 100, mapData, this.preData);
              this.mapUp = new Map('#map-canvas-container-up', 100, mapData, this.preData, true);
            };
            if (window.spritejs) {
              initMap();
            } else {
              importSpriteJs(initMap);
            }
          }
        }
      }
    },
    // 子组件传出来清空map的事件处理
    clearRoutes() {
      this.map.clearRoutes();
      this.mapUp.clearRoutes();
      this.$refs.layout.clearRoutes();
    },
    loopRoutes(index, color) {
      console.log(index, color);
      if (!this.map) Message('地图数据还没加载完成，等一会再看看吧');
      if (!this.showMap) {
        this.showMap = true;
      }
      const route = this.selMapData.routes[index];
      if (!route) throw Error('没有这个线路');
      if (this.map) {
        if (route.motionMode === 1) this.mapUp.addRoutes(route, index, color);
        else this.map.addRoutes(route, index, color);
      }
    },
    laodRouteMap() {
      if (this.showMap) {
        this.showMap = false;
      } else {
        if (this.map) {
          this.showMap = true;
        } else {
          Message('地图数据还没加载完成，请重试');
        }
      }
    },
    closeRoute(index) {
      console.log('close', index);
      if (this.map) {
        this.map.deleteRoute(index);
        this.mapUp.deleteRoute(index);
      }
      else Message('地图数据还没加载完成，等一会再看看吧');

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
          data: await (el.type === 'FURN' ? getFurn(el.id)
            : el.type === 'CHAR' ? getCharItem(el.id)
              : getItem(el.id)),
          type: el.type,
          dropType: el.dropType
        }))
      );
    },
    async getPreData() {
      const data = this.selMapData.predefines;
      if (!data) return;
      const tasks = [
        preDefineGet('tokenInsts', data),
        preDefineGet('tokenCards', data),
        preDefineGet('characterInsts', data),
        preDefineGet('characterCards', data),
      ];
      const [tokenInsts, tokenCards, characterInsts, characterCards] = await Promise.all(tasks);
      // preDefineCompute()
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

#map-canvas-container-up, #map-canvas-container {
  position: absolute
  height: 100%
  width: 100%
  top: 0
  transform: perspective(1200px) rotateX(40deg)
}

filter() {
  -moz-filter: arguments
  -webkit-filter: arguments
  -o-filter: arguments
  -ms-filter: arguments
  filter: arguments
}

#map-canvas-container-up {
  filter(drop-shadow(calc(var(--height) * 0.03) calc(var(--height) * 0.08) 18px rgba(0, 0, 0, 0.6)))
  transform: perspective(1200px) rotateX(40deg) translateZ(calc(var(--height) * 0.05))
  transition: transform 0.7s ease
}

#map-canvas-container-up.map-canvas-bottom {
  left: -5000px
  transform: perspective(1200px) rotateX(40deg)
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

  #map-canvas-container-up {
    filter: drop-shadow(1vw 4vw 10px rgba(0, 0, 0, 0.6))
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

