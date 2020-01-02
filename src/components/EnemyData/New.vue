<template>
  <div class="home-wrapper" element-loading-background="rgba(168, 168, 168, 0.1)">
    <!-- 地图选择的抽屉 -->
    <!-- <el-drawer
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
    </el-drawer>-->
    <!-- 主体 -->
    <div class="map-wrapper">
      <div class="map-title-part">
        <el-button type="primary" @click="drawer = true">
          {{ selectedMap ? selectedMap : '选择地图' }}
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
      <div class="left-panel">
        <canvas v-show="showMap" id="map-canvas-container" ref="canvas" width="890" height="500" />
      </div>
      <div class="left-bottom">
        <div v-if="selMapDataEx" ref="map-desc" style="margin-left: 5px">
          <p v-if="selMapDataEx.dangerLevel !== '-'" style="font-size: 0.9em">
            <span>推荐等级</span>
            <span style="color: #f49800;">{{ selMapDataEx.dangerLevel }}</span>
          </p>
          <p :key="runesMode" style="font-size: 0.9em" v-html="mapDesc" />
        </div>
      </div>

      <div class="right-panel">
        <accordion-panel v-model="activePanel">
          <slide-panel control title="test:a" name="a">
            <p>test</p>
          </slide-panel>
          <slide-panel title="test:a" name="b">
            <p>test</p>
          </slide-panel>
          <slide-panel title="test:a" name="c">
            <p>test</p>
          </slide-panel>
        </accordion-panel>
      </div>
    </div>
  </div>
</template>
<script>
import loadingC from '../base/Loading';
import MySlideTitle from '../base/MySlideTilte';
import MapDropList from './MapDropList';
import EnemyMapInfo from './EnemyMapInfo';
import MapPreDefined from './MapPreDefined';
import AccordionPanel from '@/components/base/AccrordionPanel';
import SlidePanel from '@/components/base/AccrordionPanel/SlidePanel';


import { Tree, Drawer, Button, Image, Loading } from 'element-ui';

import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('enemy');

Vue.use(Loading);
Vue.use(Button);
Vue.use(Tree);
Vue.use(Drawer);
Vue.use(Image);


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
    };
  },
  components: {
    EnemyDataLayout,
    MySlideTitle,
    MapDropList,
    EnemyMapInfo,
    MapPreDefined,
    SlidePanel,
    AccordionPanel
  },
  data() {
    return {
      load: false,
      activePanel: 'a'
    };
  },
  computed: {
    ...mapState([
      'drawer',
      'selectedMap',
      'short',
      'selMapDataEx',
      'devMode',
      'mapCode',
      'showMap',
      'runesMode',
    ]),
    ...mapGetters([
      'mapDesc'
    ])
  },
  mounted() {
    this.linkStart();
  },
  methods: {
    ...mapActions(['linkStart', 'loadRunes']),
    openMap() {

    },
    loopAllRoutes() {

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
  margin: 0 auto
  max-width: 1200px
  height: calc(100vh - 60px)
  background-color: rgba(230, 25, 144, 0.3)
  padding: 20px
  display: grid
  grid-template-columns: 1000px 570px 1fr
  grid-template-rows: 80px 1fr 1fr
  grid-gap: 20px 50px
  overflow: hidden

  .map-title-part {
    grid-row: 1 / 2
    grid-column: 1 / 3
    background-color: rgba(144, 25, 230, 0.3)
  }

  .map-title-part-2 {
    grid-row: 3 / 3
    grid-column: 1 / 3
    margin: 0 0 20px
  }

  .map-data-wrapper {
    .map-data-container {
      margin-bottom: 20px
      display: flex
    }
  }

  .left-panel, .right-panel, .left-bottom {
    width: 100%
    height: 100%
  }

  .left-bottom {
    grid-row: 3 / 4
    grid-column: 1 / 2
  }

  .left-panel, .right-panel {
    width: 100%
    height: 100%
    grid-row: 2 / 3
    grid-column: 1 / 2
    background-color: rgba(24, 230, 144, 0.3)
  }

  .right-panel {
    width: 100%
    height: 100%
    grid-row: 2 / 4
    grid-column: 2 / 3
    background-color: rgba(24, 230, 144, 0.3)
  }

  --height: 1000px

  .map-left-panel {
    width: 100%
    height: calc(var(--height) * 0.56)
    box-sizing: border-box
  }

  .map-pic-contianer {
    height: calc(var(--height) * 0.56)
    width: calc(var(--height) * 1)
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
  position: relative
  height: 100%
  width: 100%
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
    //--height: 500px
  }
}

@media screen and (min-width: 1600px) {
  .map-wrapper {
    //--height: 500px
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

