<template>
  <el-drawer
    :direction="short ? 'btt' : 'rtl'"
    :visible="detailsOpen"
    @close="$emit('update:detailsOpen', false)"
    :size="short ? '85%': drawerSize"
    :destroy-on-close="true"
    :title="'敌人数据' +  (runesMode ? '[突袭]': '' )"
  >
    <div v-if="currentEnemy" class="enemy-drawer">
      <div style="display: flex;">
        <div class="enemy-img-container">
          <el-image :src="picPath"></el-image>
        </div>
        <div style="z-index: 1">
          <div style="display: flex">
            <div class="enemy-details-type-index-container">
              <span
                :style="currentEnemy.enemyIndex.length > 2 ? 'font-size: 1em': ''"
              >{{currentEnemy.enemyIndex}}</span>
            </div>
            <div>
              <h1 style="margin: 0">
                {{currentEnemy.name}}
                <span
                  v-if="currentEnemy.level"
                  style="font-size: 0.5em"
                >Level {{currentEnemy.level}}</span>
              </h1>
              <h3 style="margin: 0">{{currentEnemy.enemyRace}}</h3>
            </div>
          </div>
          <div v-if="short" style="margin-left: 10px">
            <p>
              <span>攻击方式</span>
              <span style="color: #000">{{currentEnemy.attackType}}</span>
            </p>
          </div>
          <!-- 原pc布局 -->
          <div v-if="!short" class="enemy-status-container">
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image style="width: 13px; " :src="smallPicPath +  'nj_optimized.png'"></el-image>
                  <div class="enemy-status-abc-title-text">耐久</div>
                </div>
              </div>
              <h1>{{currentEnemy.endure}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div class="enemy-status-abc-title" style="margin: 0">
                <el-image style="width: 13px; " :src="smallPicPath +  'gj_optimized.png'"></el-image>
                <div class="enemy-status-abc-title-text">攻击力</div>
              </div>
              <h1>{{currentEnemy.attack}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image style="width: 13px; " :src="smallPicPath +  'fy_optimized.png'"></el-image>
                  <div class="enemy-status-abc-title-text">防御力</div>
                </div>
              </div>
              <h1>{{currentEnemy.defence}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image style="width: 13px; " :src="smallPicPath +  'fk_optimized.png'"></el-image>
                  <div class="enemy-status-abc-title-text">法术抗性</div>
                </div>
              </div>
              <h1>{{currentEnemy.resistance}}</h1>
            </div>
          </div>
        </div>

        <div class="enemy-boss-icon" v-if="currentEnemy.enemyLevel !== 'NORMAL'">
          <el-image
            :src="path + 'logo/' + currentEnemy.enemyLevel.toLowerCase() + '_icon_optimized.png?x-oss-process=style/jpg-test'"
          ></el-image>
        </div>
      </div>

      <div v-if="short" class="enemy-status-container">
        <div class="enemy-status-abc-container">
          <div>
            <div class="enemy-status-abc-title" style="margin: 0">
              <el-image
                style="width: 13px; "
                :src="smallPicPath +  'nj_optimized.png?x-oss-process=style/jpg-test'"
              ></el-image>
              <div class="enemy-status-abc-title-text">耐久</div>
            </div>
          </div>
          <h1>{{currentEnemy.endure}}</h1>
        </div>
        <div class="enemy-status-abc-container">
          <div class="enemy-status-abc-title" style="margin: 0">
            <el-image
              style="width: 13px; "
              :src="smallPicPath +  'gj_optimized.png?x-oss-process=style/jpg-test'"
            ></el-image>
            <div class="enemy-status-abc-title-text">攻击力</div>
          </div>
          <h1>{{currentEnemy.attack}}</h1>
        </div>
        <div class="enemy-status-abc-container">
          <div>
            <div class="enemy-status-abc-title" style="margin: 0">
              <el-image
                style="width: 13px; "
                :src="smallPicPath +  'fy_optimized.png?x-oss-process=style/jpg-test'"
              ></el-image>
              <div class="enemy-status-abc-title-text">防御力</div>
            </div>
          </div>
          <h1>{{currentEnemy.defence}}</h1>
        </div>
        <div class="enemy-status-abc-container">
          <div>
            <div class="enemy-status-abc-title" style="margin: 0">
              <el-image
                style="width: 13px; "
                :src="smallPicPath +  'fk_optimized.png?x-oss-process=style/jpg-test'"
              ></el-image>
              <div class="enemy-status-abc-title-text">法术抗性</div>
            </div>
          </div>
          <h1>{{currentEnemy.resistance}}</h1>
        </div>
      </div>
      <div>
        <div>
          <b>描述</b>
        </div>
        <p>{{currentEnemy.description}}</p>
      </div>
      <slot name="enemy-status"></slot>
    </div>
  </el-drawer>
</template>

<script>
import { path } from '../../utils';

import { Image, Drawer } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);
Vue.use(Drawer);

export default {
  props: {
    short: {
      type: Boolean
    },
    detailsOpen: {
      required: true,
      type: Boolean
    },
    runesMode: {
      default: false,
      type: Boolean
    },
    currentEnemy: {
      required: true
    },
    drawerSize: {
      default: '30%',
      type: String
    },
    picPath: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      smallPicPath: path + 'others/',
      bossIcon: path + 'logo/boss_icon.png?x-oss-process=style/jpg-test',
      path,
    };
  }
};
</script>

<style lang="stylus" scoped>
.enemy-img-container {
  height: 100px
  width: 100px
  min-width: 100px
  position: relative
}

.enemy-index-container {
  position: absolute
  z-index: 1
  background-color: rgba(0, 0, 0, 0.5)
  color: white
  top: -2px
  left: -2px
  padding: 2px 5px
}

.enemy-status-container {
  margin: 10px
  display: flex
}

.enemy-details-type-index-container {
  width: 42px
  height: 36px
  display: flex
  justify-content: center
  align-items: center
  border: 5px solid
  margin: 0 10px 0 5px
}

.enemy-details-type-index-container span {
  font-size: 1.6em
}

.enemy-status-abc-container {
  border: 4px solid rgb(82, 82, 82)
  width: 65px
  height: 48px
  color: rgb(82, 82, 82)
}

.enemy-status-abc-container + .enemy-status-abc-container {
  margin-left: 5px
}

.enemy-status-abc-container h1 {
  margin: 0
  text-align: center
  font-size: 2.5em
  line-height: 0.8em
}

.enemy-status-abc-title {
  display: flex
  align-items: center
  font-size: 0
}

.enemy-status-abc-title-text {
  display: inline-block
  text-align: center
  flex-grow: 1
  font-size: 12px
}

.slide-enter-active {
  transition: all 0.25 cubic-bezier(0.18, 0.54, 0.71, 0.99)
  height: 156px
  overflow: hidden
  opacity: 1
}

.slide-enter {
  height: 0
  opacity: 0
}

.enemy-drawer {
  padding: 0 20px 30px
}

.enemy-boss-icon {
  filter: invert(100%) contrast(2) opacity(0.15)
}

@media screen and (max-width: 700px) {
  .enemy-status-container {
    margin: 10px 0
  }

  .enemy-status-wrapper {
    flex-wrap: wrap
  }

  .status-phases-wrapper {
    width: 100%
  }

  .enemy-boss-icon {
    position: absolute
    right: 20px
  }
}

@media screen and (max-width: 400px) {
  .enemy-img-container {
    --imgW: calc(80px + 5vw)
    height: var(--imgW)
    width: var(--imgW)
    min-width: var(--imgW)
  }
}

/*.enemy-drawer
//似乎bug到body去了这里无效
min-height: calc(100% + 1px)*/
</style>
