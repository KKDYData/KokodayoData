<template>
  <div>
    <enemy-data-drawer
      :short="short"
      :details-open="detailsOpen"
      :runesMode="runesMode"
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

    <div class="enemy-data-layout" v-for="(enemy, key) in data" :key="enemy.enemyId">
      <div
        slot="reference"
        class="enemy-container"
        @mouseover="mouseHoverOpen(key, enemy)"
        @mouseleave="cancelOpen"
        @click="openDetails(key, enemy)"
      >
        <div class="enemy-img-container">
          <div class="enemy-index-container">
            <span>{{enemy.enemyIndex}}</span>
          </div>
          <el-image :src="enemyPicPath(key)"></el-image>
          <div>
            <span :style="enemy.name.length > 6 ? 'font-size: 14px' : ''">{{enemy.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fill-item img-container"
      :style="fillItemWidth"
      v-for="item in fillItems"
      :key="item"
    ></div>
  </div>
</template>

<script>
import { Image, Drawer } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);
Vue.use(Drawer);

import EnemyStatus from './EnemyStatus';
import EnemyDataDrawer from './EnemyDataDrawer';

import { path, getEnemyData, isMoblie, debounce } from '../../utils';

export default {
  components: { EnemyStatus, EnemyDataDrawer },
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
      debounceOpen: null
    };
  },
  beforeMount() {
    this.short = isMoblie();
  },
  mounted() {
    this.calFillAmount();
    this.drawerSize = Math.floor((600 / document.body.clientWidth) * 100) + '%';
    // console.log(this.drawerSize);

    window.addEventListener(
      'resize',
      debounce(function() {
        this.short = window.innerWidth < 500 ? true : false;
        this.calFillAmount();
        this.drawerSize =
          Math.floor((600 / document.body.clientWidth) * 100) + '%';
        // console.log(this.drawerSize);
      }, 1000).bind(this)
    );
    this.shortWidth = this.$el.clientWidth - 30;
  },
  methods: {
    enemyPicPath(key) {
      return this.path + key + '.png?x-oss-process=style/jpg-test';
    },
    async openDetails(key, v) {
      this.showKey = key;
      this.detailsOpen = true;
      this.currEnemy = v;
      if (key !== 'enemy_1503_talula')
        this.currentData = await getEnemyData(key);
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
        throw new Error('Some thing wrong!');
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
  //display: flex
  //flex-wrap: wrap
  ///*justify-content: start;*/
  //margin: 0 auto
  //max-width: 1200px
  //padding: 0 20px
  max-height: 600px
  overflow-y: scroll

.enemy-container
  display: flex
  margin: 30px 0
  min-width: 120px

.enemy-img-container
  height: 100px
  width: 100px
  min-width: 100px
  position: relative

.enemy-index-container
  position: absolute
  z-index: 1
  background-color: rgba(0, 0, 0, 0.5)
  color: white
  top: -2px
  left: -2px
  padding: 2px 5px

@media screen and (max-width: 700px)
  .enemy-data-layout
    padding: 0
    justify-content: center

@media screen and (max-width: 400px)
  .enemy-img-container
    --imgW: calc(80px + 5vw)
    height: var(--imgW)
    width: var(--imgW)
    min-width: var(--imgW)
</style>
