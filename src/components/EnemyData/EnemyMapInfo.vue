<template>
  <div class="map-option-container-wrapper">
    <my-title v-if="showTitle" title="地图信息" />
    <div style="margin-bottom: 10px; color: #828282; font-size: 0.8em">3星通关时，经验和龙门币的获取会要有1.2倍加成</div>
    <div class="map-option-container">
      <content-slot
        v-for="([k,v]) in options"
        :key="k"
        class="map-option-content"
        :long="!short"
        :no-wrap="!short"
        :width="slotWidth"
      >
        <template slot="title">{{ k }}</template>
        <template slot="content">
          <span :style="v > 100 ? 'font-size: 14px': ''">{{ v > 999 ? '0' : v }}</span>
        </template>
      </content-slot>
    </div>
    <div class="map-option-container">
      <content-slot
        v-for="([k,v]) in globalBuffs"
        :key="k"
        :long="!short"
        :no-wrap="!short"
        :width="150"
        style="margin-bottom: 10px"
      >
        <div slot="title">{{ k }}</div>
        <div v-if="k !== '属性增益'" slot="content">
          <span
            v-for="{key, value} in v"
            :key="key"
            :style="value > 100 ? 'font-size: 14px;': ''"
          >{{ value == '999999' ? '0' : value }} {{ Keys[key] }}</span>
        </div>
        <div v-else slot="content">属性已进行合并计算，在下面显示</div>
      </content-slot>
      <div style="width: 100%">
        <content-slot :long="true" :no-wrap="true" :width="150">
          <div slot="title">最后一个敌人出现</div>
          <div slot="content">{{ waveTime | time }}</div>
        </content-slot>
      </div>
    </div>
  </div>
</template>

<script>
import MyTitle from '../base/MyTitle'
import ContentSlot from '../base/ContentSlot'

import Vue from 'vue'
import { mapState } from 'vuex'

import { Alert } from 'element-ui'
Vue.use(Alert)


export default {
  components: {
    MyTitle,
    ContentSlot,
  },
  filters: {
    time(v) {
      const sec = Math.floor((v % 60) * 10) / 10,
        min = Math.floor(v / 60)
      return min > 0 ? min + ' 分 ' + sec + ' 秒' : sec + ' 秒'
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    globalBuffs: {
      type: Array,
      required: true
    },
    showTitle: {
      default: true,
      type: Boolean
    },
    waveTime: {
      default: 0,
      type: Number
    }
  },
  data() {
    const cW = document.body.clientWidth
    const slotWidth = cW < 375 ? 121 : 126
    return {
      slotWidth,
      Keys: {
        damage: '/',
        interval: 's',
        atk: '攻击',
        def: '防御',
        max_hp: '生命',
      }
    }
  },
  computed: {
    ...mapState(['short']),
  }
}
</script>

<style lang="stylus" scoped>
.map-option-container-wrapper {
  max-width: 450px
  min-width: 385px
}

.map-option-container {
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  align-content: start
  margin-left: 10px
  //overflow: hidden
}

.map-option-content {
  margin: 0 0 20px
}

@media screen and (max-width: 1000px) {
  .map-option {
    &-container {
      min-width: auto

      &-wrapper {
        min-width: auto
        max-width: inherit
      }
    }

    &-content {
      margin: 0 10px 10px 0
    }
  }
}

@media screen and (max-width: 800px) {
  .map-option {
    &-container {
      min-width: auto

      &-wrapper {
        margin: 0
      }
    }

    &-content {
      margin: 0 10px 10px 0
    }
  }
}
</style>
