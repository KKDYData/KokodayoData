<template>
  <div class="enemy-data-layout">
    <div v-for="(enemy, key) in data" :key="enemy.enemyId">
      <el-popover :trigger="isHover" :width="500" :open-delay="500">
        <div slot="reference" class="enemy-container">
          <div class="enemy-img-container">
            <div class="enemy-index-container">
              <span>{{enemy.enemyIndex}}</span>
            </div>
            <el-image :src="path +  key + '.png'"></el-image>
          </div>
          <div style="width: 90px; padding-left: 10px">
            <div>{{enemy.name}}</div>
            <div>{{enemy.enemyRace}}</div>
            <div>{{enemy.attackType}}</div>
          </div>
          <div class="enemy-status-container">
            <div>
              <span>耐久</span>
              <span>{{enemy.endure}}</span>
            </div>
            <div>
              <span>攻击力</span>
              <span>{{enemy.attack}}</span>
            </div>
            <div>
              <span>防御力</span>
              <span>{{enemy.defence}}</span>
            </div>
            <div>
              <span>法术抗性</span>
              <span>{{enemy.resistance}}</span>
            </div>
          </div>

          <!-- <div>{{enemy}}</div> -->
        </div>
        <div>{{enemy.ability}}</div>
        <div>{{enemy.description}}</div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { Image, Popover } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);
Vue.use(Popover);

import { path } from '../utils';

export default {
  props: {
    data: {
      required: true
    },
    short: {
      default: false
    }
  },
  data() {
    return {
      path: path + 'enemy/pic/',
      isHover:
        process.env.NODE_ENV === 'development' || this.short ? 'click' : 'hover'
    };
  },
  mounted() {
    console.log(this.data.length);
  }
};
</script>

<style scoped>
.enemy-data-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.enemy-container {
  display: flex;
  margin: 30px 0;
  /* max-width: calc(50vw - 20px); */
  min-width: 320px;
}

.enemy-img-container {
  height: 100px;
  width: 100px;
  min-width: 100px;
  position: relative;
}

.enemy-index-container {
  position: absolute;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  top: -2px;
  left: -2px;
  padding: 2px 5px;
}
.enemy-status-container {
  margin-left: 10px;
}

@media screen and (max-width: 1000px) {
  .enemy-data-layout {
    padding: 0 15px;
  }
}
</style>
