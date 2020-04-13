<template>
  <div class="container">
    <enemy-data-drawer
      :details-open.sync="detailsOpen"
      :runes-mode="runesMode"
      :current-enemy="currEnemy"
      :pic-path="enemyPicPath(showKey)"
    >
      <template v-slot:enemy-status>
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
            <p>{{ currEnemy.ability }}</p>
          </div>
        </enemy-status>
      </template>
    </enemy-data-drawer>
    <div
      v-if="!simpleShow && waveData && data"
      class="enemy-data-layout-body"
      :style="short? {'max-height': '400px'} : {}"
    >
      <div
        v-for="({fragments, name, postDelay, preDelay, maxTimeWaitingForNextWave}, wIndex) in waveData"
        :key="wIndex"
      >
        <my-title v-if="name" style="margin-top: 10px" :title="name || '一波'" />
        <p
          v-if="waveData.length > 1 && (postDelay || preDelay || maxTimeWaitingForNextWave)"
        >最大等待时间：{{ maxTimeWaitingForNextWave }}s | 延迟：{{ preDelay }}s</p>
        <div
          v-for="({actions, _name, preDelay:_preDelay, time, enemyNum}, fIndex) in fragments"
          :key="fIndex"
          class="wave-enemy-container"
        >
          <p class="wave-info">
            第{{ fIndex+1 }}波
            <span style="color: hsl(218, 58%, 14%)">{{ _name }}</span>
            <span>
              <i class="el-icon-position" />
              {{ time | time }}
              <span
                style="margin-left: 10px"
              >{{ enemyNum }}/{{ fragments[fragments.length - 1].enemyNum }}</span>
              <span v-if="_preDelay" style="margin-left: 10px">距离上一波{{ _preDelay }}s</span>
            </span>
          </p>

          <div class="enemy-data-layout wave">
            <div
              v-for="({key, actionType, count, interval, preDelay: __preDelay, routeIndex}, aIndex) in dealGroup(actions)"
              :key="aIndex"
              class="wave-enemy-single"
            >
              <enemy-cube
                v-if="data[key]"
                :style="selectedStlye[routeIndex]"
                :name="data[key].name"
                :src="enemyPicPath(key)"
                @click.native="showRoute(routeIndex)"
              />
              <enemy-cube v-else-if="/trap_007_ballis/.test(key)" name="弩炮" :src="ballis" />
              <div v-else class="wave-enemy-single" style="height: 100px; margin: 30px 0">
                <p>{{ key.replace('trap_007_ballis', '弩炮') }}</p>
              </div>
              <div style class="enemy-cube-wave-info">
                <div>数量:{{ count }} 间隔:{{ interval }}s</div>
                <div>出发: {{ __preDelay+time | time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="enemy-data-layout">
      <enemy-cube
        v-for="(enemy, key) in data"
        :key="enemy.enemyId"
        :name="enemy.name"
        :index="enemy.enemyIndex"
        :src="enemyPicPath(key)"
        @click.native="openDetails(key, enemy)"
      />
    </div>
  </div>
</template>

<script>
import { Button } from 'element-ui'
import Vue from 'vue'
Vue.use(Button)
import MyTitle from '../base/MyTitle'

import EnemyStatus from './EnemyStatus'
import EnemyDataDrawer from './EnemyDataDrawer'
import EnemyCube from './EnemyCube'

import { getEnemyData } from '@/utils/fetch'
import { path } from '@/utils/listVer'

import { createNamespacedHelpers, mapState as Root } from 'vuex'
import { sort } from '../../utils'
const { mapState } = createNamespacedHelpers('enemy')

export default {
  components: { EnemyStatus, EnemyDataDrawer, EnemyCube, MyTitle },
  filters: {
    time(v) {
      const sec = Math.floor((v % 60) * 10) / 10,
        min = Math.floor(v / 60)
      return min > 0 ? min + ' 分 ' + sec + ' 秒' : sec + ' 秒'
    }
  },
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    mapData: {
      type: Object,
      default: null
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
      detailsOpen: false,
      currEnemy: null,
      debounceOpen: null,
      selectedRoutes: new Set(),
      selectedStlye: {}
    }
  },

  computed: {
    ...Root(['screenWidth']),
    ...mapState(['short', 'map']),
    appearMap() {
      // 之后改成从vuex拿
      return {}
    },
    waveData() {
      if (!this.mapData) return
      return this.mapData.waves
    }
  },
  watch: {
    screenWidth(v) {
      console.log('screenWidth change', v)
    },
  },
  mounted() {
  },
  methods: {
    dealGroup(actions) {
      return sort(
        actions.filter(({ actionType }) => actionType === 0 || actionType === 6)
        , (a, b) => a.preDelay < b.preDelay
      )
    },
    clearRoutes(v) {
      this.selectedStlye = {}
      this.selectedRoutes.clear()
    },
    showRoute(index) {
      const color = Math.round(360 * Math.random())
      if (this.selectedRoutes.has(index)) {
        this.$emit('closeRoute', index)
        this.$set(this.selectedStlye, index, '')
        this.selectedRoutes.delete(index)
      } else {
        this.selectedRoutes.add(index)
        this.$set(
          this.selectedStlye,
          index,
          `--border: hsl(${color}, 100%, 50%)`
        )
        console.log(this.selectedRoutes, color)
        this.$emit('showRoute', index, color)
      }
      this.map.loopRoute(index, color)

    },
    enemyPicPath(key) {
      return this.path + key + '.png?x-oss-process=style/jpg-test'
    },
    async openDetails(key, v, index) {
      this.showKey = key
      this.detailsOpen = true
      this.currEnemy = v
      if (key !== 'enemy_1503_talula') {
        this.currentData = await getEnemyData(key)
        if (v.overwrittenData) {
          const index = this.currentData.findIndex(el => el.level === v.level)
          const target = this.currentData[index]
          this.currentData[index].enemyData = Object.keys(target.enemyData).reduce((res, key) => {
            if (v.overwrittenData[key]) {
              if (v.overwrittenData[key].m_defined) {
                res[key] = v.overwrittenData[key].m_value
              } else if (key === 'attributes') {
                res.attributes = Object.keys(res.attributes).reduce((res, key) => {
                  if (v.overwrittenData.attributes[key].m_defined) {
                    res[key].m_defined = true
                    res[key].m_value = v.overwrittenData.attributes[key].m_value
                  }
                  return res
                }, res.attributes)
              }
            }
            return res
          }, target.enemyData)
        }

      }
    },
    cancelOpen() {
      clearTimeout(this.debounceOpen)
    },

  }
}
</script>

<style lang="stylus" scoped>
.enemy-data-layout-body {
  // todo maybe have something better code
  max-height: 60vh
  overflow-y: scroll
  overflow-x: hidden
  position: relative
  grid-template-columns: 1fr 1fr
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

@media screen and (min-width: 600px) {
  .enemy-data-layout {
    display: grid
    grid-template-columns: repeat(auto-fill, 120px)
    grid-gap: 40px 0
    justify-content: center
    width: 100%
    max-width: 1200px

    &.wave {
      justify-content: start
    }
  }
}

@media screen and (max-width: 600px) {
  .enemy-data-layout {
    display: grid
    grid-template-columns: 1fr 1fr 1fr
    grid-gap: 40px 0
    justify-items: center
    width: 100%
  }
}
</style>
