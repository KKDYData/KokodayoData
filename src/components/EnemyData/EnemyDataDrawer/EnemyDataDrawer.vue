<template>
  <!-- direction="ltr"1 -->
  <h-drawer
    :direction="short ? 'btt' : 'rtl'"
    :visible="detailsOpen"
    :append-to-body="true"
    :size="short ? '90%' : drawerSizeDouble"
    :destroy-on-close="true"
    :title="'敌人数据' + (runesMode ? '[突袭]': '' )"
    @close="$emit('update:detailsOpen', false)"
  >
    <div v-if="currentEnemy" class="enemy-drawer">
      <div class="enemy-drawer-header">
        <div class="enemy-img-container">
          <c-image :src="picPath" />
        </div>
        <div style="z-index: 1">
          <div style="display: flex">
            <div class="enemy-details-type-index-container">
              <span
                :style="currentEnemy.enemyIndex.length > 2 ? 'font-size: 1em': ''"
              >{{ currentEnemy.enemyIndex }}</span>
            </div>
            <div>
              <h1 :style="(currentEnemy.name.length > 5 ? 'font-size: 1.3em':'' ) +'; margin: 0'">
                {{ currentEnemy.name }}
                <span
                  v-if="currentEnemy.level"
                  style="font-size: 0.5em"
                >Level {{ currentEnemy.level }}</span>
              </h1>
              <h3 style="margin: 0">{{ currentEnemy.enemyRace }}</h3>
            </div>
          </div>
          <div v-if="short" style="margin-left: 10px">
            <p>
              <span>攻击方式</span>
              <span style="color: #000">{{ currentEnemy.attackType }}</span>
            </p>
          </div>
          <!-- 原pc布局 -->
          <div v-if="!short" class="enemy-status-container">
            <base-status-box type="耐久" :level="currentEnemy.endure" />
            <base-status-box type="攻击力" :level="currentEnemy.attack" />
            <base-status-box type="防御力" :level="currentEnemy.defence" />
            <base-status-box type="法术抗性" :level="currentEnemy.resistance" />
          </div>
        </div>

        <div v-if="currentEnemy.enemyLevel !== 'NORMAL'" class="enemy-boss-icon">
          <c-image
            :src="path + 'logo/' + currentEnemy.enemyLevel.toLowerCase() + '_icon_optimized.png?x-oss-process=style/jpg-test'"
          />
        </div>
      </div>

      <div v-if="short" class="enemy-status-container">
        <base-status-box type="耐久" :level="currentEnemy.endure" />
        <base-status-box type="攻击力" :level="currentEnemy.attack" />
        <base-status-box type="防御力" :level="currentEnemy.defence" />
        <base-status-box type="法术抗性" :level="currentEnemy.resistance" />
      </div>
      <div>
        <div>
          <b>描述</b>
        </div>
        <p>{{ currentEnemy.description }}</p>
      </div>
      <slot name="enemy-status" />
    </div>
  </h-drawer>
</template>

<script>
import { path } from '@/utils/listVer'
import BaseStatusBox from './BaseStatusBox'
import CImage from '@/components/base/CImage'
import { Image, Drawer } from 'element-ui'
import HDrawer from '@/components/base/Drawer'
import Vue from 'vue'
Vue.use(Image)
Vue.use(Drawer)


import { createNamespacedHelpers, mapState as Root } from 'vuex'
const { mapGetters } = createNamespacedHelpers('enemy')


export default {
  components: {
    BaseStatusBox,
    CImage,
    HDrawer
  },
  props: {
    detailsOpen: {
      required: true,
      type: Boolean
    },
    runesMode: {
      default: false,
      type: Boolean
    },
    currentEnemy: {
      default: null,
      type: Object
    },
    picPath: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      bossIcon: path + 'logo/boss_icon.png?x-oss-process=style/jpg-test',
      path,
    }
  },
  computed: {
    ...Root(['short']),
    ...mapGetters(['drawerSizeDouble', 'drawerSize'])
  }
}
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

  &-header {
    display: flex
    position: relative
  }
}

.enemy-boss-icon {
  filter: invert(100%) contrast(2) opacity(0.15)
  position: absolute
  right: 20px
  width: 100px
  height: 100px
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
    right: 20px
    width: vw(150)
    height: vw(150)
  }
}

@media screen and (max-width: 500px) {
  .enemy-img-container {
    len = vw(180)
    height: len
    width: len
  }
}

/*.enemy-drawer
//似乎bug到body去了这里无效
min-height: calc(100% + 1px)*/
</style>
