<template>
  <div>
    <enemy-data-drawer
      :details-open.sync="detailsOpen"
      :runes-mode="runesMode"
      :current-enemy="currEnemy"
      :drawer-size="drawerSize"
      :pic-path="enemyPicPath(showKey)"
    >
      <template slot="enemy-status">
        <enemy-status
          v-if="currEnemy"
          v-loading="!currentData"
          :data="currentData"
          :key-name="showKey"
          :map-level="currEnemy.level"
          :appear-map="appearMap"
          :map-data="mapData"
          :runes-mode="runesMode"
        >
          <div v-if="currEnemy.ability">
            <div>
              <b>能力</b>
            </div>
            <p>{{currEnemy.ability}}</p>
          </div>
        </enemy-status>
      </template>
    </enemy-data-drawer>
    <div
      class="enemy-data-layout-body"
      :style="short? {'max-height': '400px'} : {}"
      v-if="!simpleShow && waveData && data"
    >
      <div
        v-for="({fragments, name, postDelay, preDelay, maxTimeWaitingForNextWave}, wIndex) in waveData"
        :key="wIndex"
      >
        <my-title v-if="name" style="margin-top: 10px" :title="name || '一波'"></my-title>
        <p
          v-if="waveData.length > 1 && (postDelay || preDelay || maxTimeWaitingForNextWave)"
        >最大等待时间：{{maxTimeWaitingForNextWave}}s | 延迟：{{preDelay}}s</p>
        <div
          class="wave-enemy-container"
          v-for="({actions, name, preDelay, time, enemyNum}, fIndex) in fragments"
          :key="fIndex"
        >
          <p class="wave-info" style="width: 100%; margin-bottom: -20px">
            第{{fIndex+1}}波
            <span style="color: hsl(218, 58%, 14%)">{{name}}</span>
            <span>
              <i class="el-icon-position"></i>
              {{time | time}}
              <span
                style="margin-left: 10px"
              >{{enemyNum}}/{{fragments[fragments.length - 1].enemyNum}}</span>
              <span style="margin-left: 10px" v-if="preDelay">距离上一波{{preDelay}}s</span>
            </span>
          </p>
          <!-- .filter(el => mapData.routes[el.routeIndex]) -->
          <div
            v-for="({key, actionType, count, interval, preDelay, routeIndex}, aIndex) in actions.filter(({actionType}) => actionType === 0 || actionType === 6)"
            :key="aIndex"
            class="wave-enemy-single"
          >
            <enemy-cube
              v-if="data[key]"
              :style="selectedStlye[routeIndex]"
              :name="data[key].name"
              :src="enemyPicPath(key)"
              @click.native="showRoute(routeIndex)"
            ></enemy-cube>
            <enemy-cube
              style="background: linear-gradient(45deg, hsl(163, 100%, 6%), transparent);box-shadow: inset 0px 0px 0px 5px #313131"
              v-else-if="/trap_007_ballis/.test(key)"
              name="弩炮"
              :src="ballis"
            ></enemy-cube>
            <div v-else class="wave-enemy-single" style="height: 100px; margin: 30px 0">
              <p>{{key.replace('trap_007_ballis', '弩炮')}}</p>
            </div>
            <div style class="enemy-cube-wave-info">
              <div>数量:{{count}} 间隔:{{interval}}s</div>
              <div style="display: flex;justify-content: space-between; width: calc(100% - 20px)">
                延迟: {{preDelay}}s
                <i
                  :style="selectedStlye[routeIndex] ? 'color: #313131' : ''"
                  class="el-icon-s-flag"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="enemy-data-layout" :style="!short ? 'margin: 0 10px' : ''">
      <enemy-cube
        v-for="(enemy, key) in data"
        @mouseover.native="mouseHoverOpen(key, enemy)"
        @mouseleave.native="cancelOpen"
        @click.native="openDetails(key, enemy)"
        :name="enemy.name"
        :index="enemy.enemyIndex"
        :src="enemyPicPath(key)"
        :key="enemy.enemyId"
      ></enemy-cube>
      <div
        class="fill-item img-container"
        :style="fillItemWidth"
        v-for="item in fillItems"
        :key="item"
      ></div>
    </div>
  </div>
</template>

<script>
import { Image, Drawer, Button } from 'element-ui';
import Vue from 'vue';
import { mapState } from 'vuex';
Vue.use(Image);
Vue.use(Drawer);
Vue.use(Button);
import MyTitle from '../MyTitle';

import EnemyStatus from './EnemyStatus';
import EnemyDataDrawer from './EnemyDataDrawer';
import EnemyCube from './EnemyCube';

import { getEnemyData } from '../../utils/fetch';
import { path } from '../../utils/listVer';

export default {
  components: { EnemyStatus, EnemyDataDrawer, EnemyCube, MyTitle },
  props: {
    data: {
      required: true
    },
    mapData: {
      type: Object
    },
    runesMode: {
      type: Boolean,
      default: false
    },
    simpleShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ballis: path + 'char/profile/trap_007_ballis_optimized.png?x-oss-process=style/small-test',
      path: path + 'enemy/pic/',
      showKey: '',
      currentData: [],
      smallPicPath: path + 'others/',
      fillItemWidth: { width: '100px' },
      fillItems: [],
      shortWidth: 350,
      detailsOpen: false,
      currEnemy: null,
      debounceOpen: null,
      selectedRoutes: new Set(),
      selectedStlye: {}
    };
  },

  watch: {
    simpleShow(v) {
      if (v) this.calFillAmount();
    }
  },
  mounted() {
    // console.log(this.drawerSize);
    if (this.$el && this.$el.querySelector('.enemy-container')) this.calFillAmount();
    this.shortWidth = this.$el.clientWidth - 30;
  },
  filters: {
    time(v) {
      const sec = Math.floor((v % 60) * 10) / 10,
        min = Math.floor(v / 60);
      return min > 0 ? min + ' 分 ' + sec + ' 秒' : sec + ' 秒';
    }
  },
  computed: {
    ...mapState(['screenWidth', 'short']),
    drawerSize() {
      return Math.floor((600 / this.screenWidth) * 100) + '%';
    },
    appearMap() {
      // 之后改成从vuex拿
      return {};
    },
    waveData() {
      if (!this.mapData) return;
      return this.mapData.waves;
    }
  },
  methods: {
    clearRoutes(v) {
      this.selectedStlye = {};
      this.selectedRoutes.clear();
    },
    showRoute(index) {
      if (this.selectedRoutes.has(index)) {
        this.$emit('closeRoute', index);
        this.$set(this.selectedStlye, index, '');
        this.selectedRoutes.delete(index);
      } else {
        this.selectedRoutes.add(index);
        const color = Math.round(360 * Math.random());
        this.$set(
          this.selectedStlye,
          index,
          `--border: 7px solid hsl(${color}, 100%, 50%)`
        );
        console.log(this.selectedRoutes, color);
        this.$emit('showRoute', index, color);
      }
    },
    enemyPicPath(key) {
      return this.path + key + '.png?x-oss-process=style/jpg-test';
    },
    async openDetails(key, v, index) {
      this.showKey = key;
      this.detailsOpen = true;
      this.currEnemy = v;
      if (key !== 'enemy_1503_talula') {
        this.currentData = await getEnemyData(key);
        if (v.overwrittenData) {
          const index = this.currentData.findIndex(el => el.level === v.level);
          const target = this.currentData[index];
          this.currentData[index].enemyData = Object.keys(target.enemyData).reduce((res, key) => {
            if (v.overwrittenData[key]) {
              if (v.overwrittenData[key].m_defined) {
                res[key] = v.overwrittenData[key].m_value;
              } else if (key === 'attributes') {
                res.attributes = Object.keys(res.attributes).reduce((res, key) => {
                  if (v.overwrittenData.attributes[key].m_defined) {
                    res[key].m_defined = true;
                    res[key].m_value = v.overwrittenData.attributes[key].m_value;
                  }
                  return res;
                }, res.attributes);
              }
            }
            return res;
          }, target.enemyData);
        }

      }
    },
    mouseHoverOpen(k, v) {
      clearTimeout(this.debounceOpen);
      this.debounceOpen = setTimeout(() => {
        this.openDetails(k, v);
      }, 1000);
    },
    cancelOpen() {
      clearTimeout(this.debounceOpen);
    },
    calFillAmount() {
      if (!this.data) return;
      const width = this.$el.clientWidth,
        target = this.$el.querySelector('.enemy-container'),
        style = getComputedStyle(target),
        cWidth = style.width,
        vw = style['margin-right'],
        res = (+cWidth.slice(0, -2) + +vw.slice(0, -2));
      this.fillItemWidth = { width: res + 'px' };
      let size = Math.floor(width / res);
      const arr = [];
      if (size > 30) {
        throw new Error('Some thing wrong!', size);
      }
      for (let i = 0; i < size; i++) {
        arr.push(i);
      }
      this.fillItems = arr;
    }
  }
};
</script>

<style lang="stylus" scoped>
.enemy-data-layout-body {
  max-height: 40vh
  overflow-y: scroll
  flex-grow: 1
  position: relative
  padding-top: 40px
  //吃掉title的margin-buttom 20px
  margin-top: -20px
}

.enemy-data-layout {
  display: flex
  flex-wrap: wrap
  /*justify-content: start;*/
  margin: 0 auto
  max-width: 1200px
  padding: 0px 20px 0
}

.wave-enemy-container {
  display: flex
  flex-wrap: wrap
}

.enemy-cube-wave-info {
  font-size: 15px
  color: rgb(168, 168, 168)
}

.wave-info {
  color: #313131

  &:before {
    content: ''
    width: 7px
    height: 1.5em
    background-color: #525252
    display: inline-block
    vertical-align: bottom
  }
}

@media screen and (max-width: 700px) {
  .enemy-data-layout {
    padding: 20px 0 0
    justify-content: center
  }
}
</style>
