<template>
  <div class="home-wrapper" element-loading-background="rgba(168, 168, 168, 0.1)">
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
      <div class="map-title-part">
        <el-button type="primary" @click="drawer = true">
          {{ selectedMap ? selectedMap : '选择地图' }}
          <i class="el-icon-edit-outline" />
        </el-button>

        <div v-if="selMapDataEx" class="title-button-wrapper">
          <div v-if=" (selMapDataEx.hardStagedId || selMapDataEx.difficulty === 'FOUR_STAR')">
            <el-button
              :type="!runesMode ? '': 'warning'"
              :plain="!runesMode"
              class="runes-mode-button"
              @click="loadRunes"
            >突袭</el-button>
          </div>
          <div>
            <el-button
              :type="!showMap ? '': 'warning'"
              :plain="!showMap"
              class="runes-mode-button"
              @click="openMap"
            >地图</el-button>
          </div>
          <div>
            <el-tooltip v-if="mapCode && showMap" class="runes-mode-button">
              <el-button type="info">地图说明</el-button>
              <div slot="content">
                <p>点击地板砖，会有砖的基本说明，</p>
                <p>被重写的地图模块，因为旧的实现对于点击事件的捕获有问题</p>
                <p>也是因为这个问题，所以一直没有加摆箱子的功能</p>
              </div>
            </el-tooltip>
          </div>
          <div class="long-button">
            <el-button
              v-if="devMode === 'beta'"
              :type="!loopAll ? '': 'warning'"
              :plain="!showMap"
              class="runes-mode-button"
              @click="loopAllRoutes"
            >加载所有路线</el-button>
          </div>
        </div>
      </div>
      <!--! 地图 kkdy-somemap -->
      <div v-if="selectedMap" class="left-panel">
        <canvas v-show="showMap" id="map-canvas-container" ref="canvas" width="890" height="500" />
      </div>
      <div v-if="selectedMap" class="left-bottom">
        <div v-if="selMapDataEx" ref="map-desc" style="margin-left: 5px">
          <p v-if="selMapDataEx.dangerLevel !== '-'" style="font-size: 0.9em">
            <span>推荐等级</span>
            <span style="color: #f49800;">{{ selMapDataEx.dangerLevel }}</span>
          </p>
          <p :key="runesMode" style="font-size: 0.9em" v-html="mapDesc" />
        </div>
      </div>

      <div v-if="selectedMap" class="right-panel">
        <accordion-panel v-model="activePanel">
          <slide-panel title="敌人数据" name="x">
            <template v-slot:button>
              <div style="text-align: left">
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
                <el-button
                  v-if="!simpleShow && mapCode"
                  size="mini"
                  type="danger"
                  class="clear-route-button"
                  @click="clearRoutes"
                >清空路线</el-button>
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
            </template>
            <enemy-data-layout
              v-if="!load && data"
              ref="layout"
              :style="mapCode? 'padding-top: 40px':''"
              :data="data"
              :map-data="selMapData"
              :runes-mode="runesMode"
              :simple-show="simpleShow"
            />
          </slide-panel>
          <slide-panel control title="地图信息" name="a">
            <div class="map-info-wrapper">
              <div class="theta-controller" style="z-index: 10">
                <div for="theta">
                  地图角度
                  <span>{{ t }}</span>
                </div>
                <el-slider
                  id="theta"
                  v-model="t"
                  type="range"
                  :min="100"
                  :max="180"
                  @input="updateTheta"
                />
              </div>
              <div class="theta-controller" style="z-index: 10">
                <div for="perspective">
                  视距
                  <span>{{ p }}</span>
                </div>
                <el-slider
                  id="theta"
                  v-model="p"
                  type="range"
                  :min="1000"
                  :max="9000"
                  @input="updatePerspective"
                />
              </div>
              <enemy-map-info
                style="margin-top: 20px"
                :show-title="false"
                :options="options"
                :global-buffs="globalBuffs"
                :wave-time="waveTime"
              />
            </div>
          </slide-panel>
          <slide-panel v-if="showPredefine" title="地图预设" name="b">
            <map-pre-defined
              style="margin-top: 10px"
              :pre-data="selMapData.predefines"
              :data="preData"
              :runes-data="runesMode ? selMapData.runes : null"
            />
          </slide-panel>
          <slide-panel title="掉落" name="c">
            <map-drop-list
              v-if="mapCode && detailsDropList.length > 0"
              style="margin-top: 20px"
              :drop-info="detailsDropList"
              :target-stage="mapCode"
            />
          </slide-panel>
        </accordion-panel>
      </div>
      <div v-if="!selectedMap" class="enemy-all">
        <enemy-data-layout v-if="rawData" ref="layout" :data="rawData" :simple-show="true" />
      </div>
    </div>
  </div>
</template>
<script>
import loadingC from '../base/Loading'
import MapDropList from './MapDropList'
import EnemyMapInfo from './EnemyMapInfo'
import MapPreDefined from './MapPreDefined'
import AccordionPanel from '@/components/base/AccrordionPanel'
import SlidePanel from '@/components/base/AccrordionPanel/SlidePanel'
import MyTitle from '@/components/base/MyTitle'


import { Tree, Drawer, Button, Image, Loading, Slider } from 'element-ui'

import Vue from 'vue'
import { SET_DATA } from '../../store/Enemy/mutations'
import { createNamespacedHelpers, mapState as Root } from 'vuex'
import { debounce } from '../../utils'
const { mapState, mapActions, mapGetters, mapMutations } = createNamespacedHelpers('enemy')

Vue.use(Loading)
Vue.use(Button)
Vue.use(Tree)
Vue.use(Drawer)
Vue.use(Image)
Vue.use(Slider)


const EnemyDataLayout = () => ({
  component: import(
    /* webpackChunkName: "EnemyDataLayout" */ './EnemyDataLayout'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
})

export default {
  metaInfo() {
    return {
      titleTemplate: `${this.selectedMap ? this.selectedMap + ' |' : ''}敌人图鉴 | 明日方舟`,
      meta: [
        {
          vmid: 'description',
          name: 'Description',
          content: this.selectedMap
            ? this.mapDesc
            : '霜星 塔露拉 梅菲斯特 浮士德 弑君者 碎骨 W 粉碎攻坚组长'
        }
      ]
    }
  },
  components: {
    EnemyDataLayout,
    MapDropList,
    EnemyMapInfo,
    MapPreDefined,
    SlidePanel,
    AccordionPanel,
  },
  data() {
    return {
      load: false,
      activePanel: 'x',
      simpleShow: true,
      drawer: false,
      loopAll: false,
      t: 140,
      p: 3000
    }
  },
  computed: {
    ...mapState([
      'data',
      'selectedMap',
      'selMapDataEx',
      'selMapData',
      'devMode',
      'mapCode',
      'showMap',
      'runesMode',
      'preData',
      'detailsDropList',
      'selMapNode',
      'path',
      'map',
      'rawData'
    ]),
    ...Root(['stageTree', 'short',]),
    ...mapGetters([
      'mapDesc',
      'options',
      'globalBuffs',
      'waveTime',
      'showPredefine',
      'drawerSize'
    ]),
    theta() {
      console.log('theta', this.t)
      return (this.t / 360) * Math.PI
    }
  },
  mounted() {
    if (this.$route.params) this.clearMap()
    this.linkStart()
    window.addEventListener('resize', debounce(() => {
      this.linkStart()
      console.log('resize & reinit somemap')
    }, 1000))
  },
  methods: {
    ...mapActions(['linkStart', 'loadRunes']),
    ...mapMutations([SET_DATA, 'clearMap']),
    openMap() {

    },
    clearRoutes() {
      this.map.deleteAll()
      this.$refs.layout.clearRoutes()
      this.loopAll = false

    },
    loopAllRoutes() {
      if (!this.loopAll) {
        this.map.loopRoutes()
        this.loopAll = true
      }
      else {
        this.loopAll = false
        this.map.deleteAll()
      }
    },
    changeMapCode(data) {
      if (!data.children) {
        let codeFromPath = data.path
        let shortCode = codeFromPath
          .replace('weekly', 'wk')
          .replace('promote', 'pro')

        this.$refs['chapter-selecter'].closeDrawer()

        this.load = true
        this[SET_DATA]({ key: 'mapPicLoad', value: true })
        // this.mapPicLoad = true;

        this[SET_DATA]({ key: 'runesMode', value: false })
        // this.runesMode = false;
        this[SET_DATA]({ key: 'selMapNode', value: data })
        this[SET_DATA]({ key: 'mapCode', value: shortCode })

        // this.selMapNode = data;
        // this.mapCode = shortCode;
        console.log(this.path, shortCode)
        this.$router.push(this.path + shortCode)

        //! 没看懂
        setTimeout(() => {
          this.load = false
          this[SET_DATA]({ key: 'mapPicLoad', value: false })
          // this.mapPicLoad = false;
        }, 500)
      }
    },
    updateTheta() {
      this.map.setPerspective({ theta: this.theta * 2 })
    },
    updatePerspective() {
      this.map.setPerspective({ perspective: { PERSPECTIVE: +this.p } })
    }

  }
}
</script>

<style lang="stylus" scoped>
.chapter-wrapper {
  padding-left: 20px
  margin-bottom: 70px
}

.map-wrapper {
  display: grid
  --cwidth: calc(100vw - 600px)
  grid-template-columns: var(--cwidth) 500px
  grid-template-rows: 80px calc(var(--cwidth) * 0.56) 1fr
  grid-gap: 20px 50px
  padding: 20px
  overflow: hidden

  .map-title-part {
    grid-row: 1 / 2
    grid-column: 1 / 3
    //background-color: rgba(144, 25, 230, 0.3)
  }

  .map-title-part-2 {
    grid-row: 3 / 3
    grid-column: 1 / 3
    margin: 0 0 20px
  }

  .left-panel, .right-panel, .left-bottom {
    width: 100%
    height: 100%
    position: relative
  }

  .left-bottom {
    grid-row: 3 / 4
    grid-column: 1 / 2
    border-top: 1px solid #818181
  }

  .left-panel {
    grid-row: 2 / 3
    grid-column: 1 / 2
    border: 1px solid #818181
  }

  .right-panel {
    grid-row: 2 / 4
    grid-column: 2 / 3
  }

  .enemy-all {
    overflow-y: scroll
    grid-row: 2 / 4
    grid-column: 1 / 4
    overflow: hidden
  }
}

.runes-mode-button {
  padding-top: 4px
  padding-bottom: 4px
  vertical-align: bottom
  border-radius: 2px
}

#map-canvas-container {
  position: relative
  height: 100%
  width: 100%
}

//todo use postcss?
filter() {
  -moz-filter: arguments
  -webkit-filter: arguments
  -o-filter: arguments
  -ms-filter: arguments
  filter: arguments
}

.title-button-wrapper {
  margin-top: 15px
  display: grid
  grid-template-columns: repeat(4, min-content)
  grid-gap: 20px 2%
  width: 400px
}

@media screen and (min-width: 1900px) {
  .map-wrapper {
    max-width: 1900px
    margin: 0 auto
  }
}

@media screen and (max-width: 1920px) {
  .map-wrapper {
    min-width: 1300px
    padding: 1%
  }
}

@media screen and (max-width: 1300px) {
  .map-wrapper {
    min-width: auto
  }
}

@media screen and (max-width: 1000px) and (min-width: 600px) {
  .map-wrapper {
    min-width: auto
    height: auto
    --cwidth: calc(100vw - 350px)
    grid-template-columns: var(--cwidth) 300px
    grid-template-rows: 80px calc(var(--cwidth) * 0.56) 1fr
    grid-gap: 20px 2%
    padding: 1%

    //? 小屏下的方块的尺寸
    &>>> .enemy-img-container {
      width: 80px
      height: 80px
      min-width: auto

      .small {
        font-size: 11px
      }

      .normal {
        font-size: 14px
      }

      &:before {
        content: ''
        border: 5px solid
        border-color: var(--border)
        width: 100%
        height: 100%
        position: absolute
        box-sizing: border-box
        z-index: 1
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .map-wrapper {
    min-width: auto
    height: auto
    grid-template-columns: 60% 34%
    grid-template-rows: 120px auto 54vw 1fr
    grid-gap: 20px 2%
    padding: 1%

    .left-bottom {
      grid-row: 2 / 3
      grid-column: 1 / 3
      border-top: 1px solid #818181
    }

    .left-panel {
      grid-row: 3 / 4
      grid-column: 1 / 3
      background-color: rgba(24, 230, 144, 0.3)
    }

    .right-panel {
      grid-row: 4 / 5
      grid-column: 1 / 3
    }
  }

  .title-button-wrapper {
    .long-button {
      grid-column: 1 / 4
    }
  }
}
</style>

