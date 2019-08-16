<template>
  <div>
    <enemy-data-drawer
      :short="short"
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
          :short="short"
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
    <div style="max-height: 720px;overflow-y: scroll; flex-grow: 1" v-if="waveData && data">
      <div
        v-for="({fragments, name, postDelay, preDelay, maxTimeWaitForNextWave}, wIndex) in waveData"
        :key="wIndex"
      >
        <my-title v-if="name" style="margin-top: 10px" :title="name || '一波'"></my-title>
        <p
          v-if="postDelay || preDelay || maxTimeWaitForNextWave"
        >max{{maxTimeWaitForNextWave}}||post{{postDelay}}||pre{{preDelay}}</p>
        <div
          class="wave-enemy-container"
          v-for="({actions, name, preDelay, time}, fIndex) in fragments"
          :key="fIndex"
        >
          <p style="width: 100%; margin-bottom: -20px">
            第{{fIndex+1}}波
            <span v-if="preDelay">开始时间: {{time | time}}， 距离上一波: {{preDelay}}s</span>
          </p>
          <!-- .filter(el => mapData.routes[el.routeIndex]) -->
          <div
            v-for="({key, actionType, count, interval, preDelay, routeIndex}, aIndex) in actions.filter(el => el.actionType !== 5)"
            :key="aIndex"
            class="wave-enemy-single"
          >
            <enemy-cube
              v-if="data[key]"
              :style="selectedStlye[routeIndex]"
              :name="data[key].name"
              :src="enemyPicPath(key)"
              @click.native="openDetails(key, data[key], routeIndex)"
              @mouseover.native="mouseHoverOpen(key, data[key])"
              @mouseleave.native="cancelOpen"
            ></enemy-cube>
            <div v-else style="height: 100px">
              <p>预设 敌人</p>
              <p>{{key}}</p>
            </div>
            <div @click="showRoute(routeIndex)" style="cursor: pointer">
              <div>数量:{{count}}, 间隔:{{interval}}</div>
              <div style="display: flex;justify-content: space-between; width: calc(100% - 20px)">
                Delay: {{preDelay}}
                <i
                  :class="selectedStlye[routeIndex] ? 'el-icon-s-promotion' : 'el-icon-position'"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="enemy-data-layout">
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
import { Image, Drawer } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);
Vue.use(Drawer);
import MyTitle from '../MyTitle';

import EnemyStatus from './EnemyStatus';
import EnemyDataDrawer from './EnemyDataDrawer';
import EnemyCube from './EnemyCube';

import { path, getEnemyData, isMoblie, debounce } from '../../utils';

export default {
  components: { EnemyStatus, EnemyDataDrawer, EnemyCube, MyTitle },
  props: {
    data: {
      required: true
    },
    appearMap: {
      type: Object
    },
    mapData: {
      type: Object
    },
    runesMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      path: path + 'enemy/pic/',
      showKey: '',
      currentData: [],
      smallPicPath: path + 'others/',
      fillItemWidth: { width: '100px' },
      fillItems: [],
      shortWidth: 350,
      detailsOpen: false,
      currEnemy: null,
      drawerSize: '30%',
      debounceOpen: null,
      selectedRoutes: new Set(),
      selectedStlye: {}
    };
  },
  beforeMount() {
    this.short = isMoblie();
  },
  mounted() {
    // this.calFillAmount();
    this.drawerSize = Math.floor((600 / document.body.clientWidth) * 100) + '%';
    // console.log(this.drawerSize);

    window.addEventListener(
      'resize',
      debounce(function() {
        this.short = window.innerWidth < 500 ? true : false;
        // this.calFillAmount();
        this.drawerSize =
          Math.floor((600 / document.body.clientWidth) * 100) + '%';
        // console.log(this.drawerSize);
      }, 1000).bind(this)
    );
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
    waveData() {
      if (!this.mapData) return;
      const a = this.mapData.waves.reduce((wRes, cur) => {
        return (
          wRes +
          cur.preDelay +
          cur.postDelay +
          cur.fragments.reduce((fRes, cur) => {
            let fTemp = fRes + cur.preDelay;
            cur.time = fTemp;
            fTemp += cur.actions.reduce((res, cur) => {
              const curTime = cur.preDelay + cur.interval * cur.count;
              return Math.max(res, curTime);
            }, 0);
            return fTemp;
          }, 0)
        );
      }, 0);
      console.log('time', a);
      return this.mapData.waves;
    }
  },
  methods: {
    checkFuck(key) {
      if (!this.data[key]) {
        console.log(Object.keys(this.data));
        throw Error('error');
      }
    },
    showRoute(index) {
      if (this.selectedRoutes.has(index)) {
        this.$emit('closeRoute', index);
        this.$set(this.selectedStlye, index, '');
        this.selectedRoutes.delete(index);
      } else {
        this.selectedRoutes.add(index);
        const color = 360 * Math.random();
        this.$set(
          this.selectedStlye,
          index,
          `--border: 7px solid hsl(${color}, 100%, 50%)`
        );
        console.log(this.selectedRoutes);
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
        cWidth = this.$el.querySelector('.enemy-container').clientWidth;
      this.fillItemWidth = { width: cWidth + 'px' };
      let size = Math.floor(width / cWidth);
      // size = size - (Object.keys(this.data).length % size);
      const arr = [];
      if (size > 10) {
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
.enemy-data-layout
  display: flex
  flex-wrap: wrap
  /*justify-content: start;*/
  margin: 0 auto
  max-width: 1200px
  padding: 0 20px

.wave-enemy-container
  display: flex
  flex-wrap: wrap

@media screen and (max-width: 700px)
  .enemy-data-layout
    padding: 0
    justify-content: center
</style>
