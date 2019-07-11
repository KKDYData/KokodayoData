<template>
  <div class="enemy-data-layout">
    <div v-for="(enemy, key) in data" :key="enemy.enemyId">
      <el-popover
        :trigger="isHover"
        :width="short? shortWidth : 700"
        :open-delay="500"
        @show="openDetails(key)"
        @hide="currentData = null"
        placement="top"
        :popper-options="{Defaults:{positionFixed:true}}"
        :visible-arrow="!short"
      >
        <div slot="reference" class="enemy-container">
          <div class="enemy-img-container">
            <div class="enemy-index-container">
              <span>{{enemy.enemyIndex}}</span>
            </div>
            <el-image :src="path +  key + '.png'" lazy></el-image>
            <div>
              <span>{{enemy.name}}</span>
            </div>
          </div>
        </div>
        <div v-if="showKey === key" class="enemy-content-container">
          <el-button @click="$el.click()" type="danger" size="mini" class="close-button">
            <i class="el-icon-close"></i>
          </el-button>
          <div style="display: flex">
            <div class="enemy-img-container">
              <el-image :src="path +  key + '.png'"></el-image>
            </div>
            <div>
              <div style="display: flex">
                <div class="enemy-details-type-index-container">
                  <span>{{enemy.enemyIndex}}</span>
                </div>
                <div>
                  <h1 style="margin: 0">{{enemy.name}}</h1>
                  <h3 style="margin: 0">{{enemy.enemyRace}}</h3>
                </div>
              </div>
              <div v-if="short" style="margin-left: 10px">
                <p>
                  <span>攻击方式</span>
                  <span style="color: #000">{{enemy.attackType}}</span>
                </p>
              </div>
              <div v-if="!short" class="enemy-status-container">
                <div class="enemy-status-abc-container">
                  <div>
                    <div class="enemy-status-abc-title" style="margin: 0">
                      <el-image style="width: 13px; " :src="smallPicPath +  'nj.png'"></el-image>
                      <div class="enemy-status-abc-title-text">耐久</div>
                    </div>
                  </div>
                  <h1>{{enemy.endure}}</h1>
                </div>
                <div class="enemy-status-abc-container">
                  <div class="enemy-status-abc-title" style="margin: 0">
                    <el-image style="width: 13px; " :src="smallPicPath +  'gj.png'"></el-image>
                    <div class="enemy-status-abc-title-text">攻击力</div>
                  </div>
                  <h1>{{enemy.attack}}</h1>
                </div>
                <div class="enemy-status-abc-container">
                  <div>
                    <div class="enemy-status-abc-title" style="margin: 0">
                      <el-image style="width: 13px; " :src="smallPicPath +  'fy.png'"></el-image>
                      <div class="enemy-status-abc-title-text">防御力</div>
                    </div>
                  </div>
                  <h1>{{enemy.defence}}</h1>
                </div>
                <div class="enemy-status-abc-container">
                  <div>
                    <div class="enemy-status-abc-title" style="margin: 0">
                      <el-image style="width: 13px; " :src="smallPicPath +  'fk.png'"></el-image>
                      <div class="enemy-status-abc-title-text">法术抗性</div>
                    </div>
                  </div>
                  <h1>{{enemy.resistance}}</h1>
                </div>
              </div>
            </div>
          </div>
          <div v-if="short" class="enemy-status-container">
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image style="width: 13px; " :src="smallPicPath +  'nj.png'"></el-image>
                  <div class="enemy-status-abc-title-text">耐久</div>
                </div>
              </div>
              <h1>{{enemy.endure}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div class="enemy-status-abc-title" style="margin: 0">
                <el-image style="width: 13px; " :src="smallPicPath +  'gj.png'"></el-image>
                <div class="enemy-status-abc-title-text">攻击力</div>
              </div>
              <h1>{{enemy.attack}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image style="width: 13px; " :src="smallPicPath +  'fy.png'"></el-image>
                  <div class="enemy-status-abc-title-text">防御力</div>
                </div>
              </div>
              <h1>{{enemy.defence}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image style="width: 13px; " :src="smallPicPath +  'fk.png'"></el-image>
                  <div class="enemy-status-abc-title-text">法术抗性</div>
                </div>
              </div>
              <h1>{{enemy.resistance}}</h1>
            </div>
          </div>
          <div v-if="!short">
            <p>
              <span>攻击方式</span>
              <span style="color: #000">{{enemy.attackType}}</span>
            </p>
          </div>
          <div v-if="enemy.ability">
            <div>
              <b>能力</b>
            </div>
            <p>{{enemy.ability}}</p>
          </div>
          <div>
            <div>
              <b>描述</b>
            </div>
            <p>{{enemy.description}}</p>
          </div>

          <div>
            <enemy-status
              v-loading="key !== 'enemy_1503_talula' && !currentData"
              :data="currentData"
              :short="short"
              :key-name="key"
            ></enemy-status>
          </div>
        </div>
      </el-popover>
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
import { Image, Popover } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);
Vue.use(Popover);

import EnemyStatus from './EnemyStatus';

import { path, getEnemyData } from '../utils';

export default {
  components: { EnemyStatus },
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
        process.env.NODE_ENV === 'development' || this.short
          ? 'click'
          : 'hover',
      showKey: '',
      currentData: [],
      smallPicPath: path + 'others/',
      fillItemWidth: { width: '100px' },
      fillItems: [],
      shortWidth: 350
    };
  },
  mounted() {
    this.calFillAmount();
    this.shortWidth = this.$el.clientWidth - 30;
  },
  methods: {
    async openDetails(key) {
      this.showKey = key;
      // setTimeout(async () => {}, 100);
      if (key !== 'enemy_1503_talula')
        this.currentData = await getEnemyData(key);
      // this.showDetails = true;
    },
    calFillAmount() {
      if (!this.data) return;
      const width = this.$el.clientWidth,
        cWidth = this.$el.querySelector('.enemy-container').clientWidth;
      this.fillItemWidth = { width: cWidth + 'px' };
      let size = Math.floor(width / cWidth);
      size = size - (Object.keys(this.data).length % size);
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

<style scoped>
.enemy-data-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
  padding: 20px;
}

.enemy-container {
  display: flex;
  margin: 30px 0;
  /* max-width: calc(50vw - 20px); */
  min-width: 120px;
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
  margin: 10px;
  display: flex;
}

.enemy-details-type-index-container {
  width: 42px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid;
  margin: 0 10px 0 5px;
}

.enemy-details-type-index-container span {
  font-size: 1.6em;
}
.enemy-status-abc-container {
  border: 4px solid rgb(82, 82, 82);
  width: 65px;
  height: 48px;
  margin: 0 5px;
  color: rgb(82, 82, 82);
}

.enemy-status-abc-container h1 {
  margin: 0;
  text-align: center;
  font-size: 2.5em;
  line-height: 0.8em;
}

.enemy-status-abc-title {
  display: flex;
  align-items: center;
  font-size: 0;
}

.enemy-status-abc-title-text {
  display: inline-block;
  text-align: center;
  flex-grow: 1;
  font-size: 12px;
}

.slide-enter-active {
  transition: all 0.25 cubic-bezier(0.18, 0.54, 0.71, 0.99);
  height: 156px;
  overflow: hidden;
  opacity: 1;
}
.slide-enter {
  height: 0;
  opacity: 0;
}

.enemy-content-container {
  min-height: 300px;
}

@media screen and (max-width: 1000px) {
  .enemy-data-layout {
    padding: 0 15px;
  }
}

@media screen and (max-width: 700px) {
  .enemy-status-container {
    margin: 10px 0;
  }
  .enemy-status-wrapper {
    flex-wrap: wrap;
  }

  .status-phases-wrapper {
    width: 100%;
  }
  .enemy-content-container {
    max-height: 80vh;
    overflow-y: scroll;
  }
}

@media screen and (max-width: 400px) {
  .enemy-container {
    min-width: calc(90px + 5vw);
  }
}
</style>
