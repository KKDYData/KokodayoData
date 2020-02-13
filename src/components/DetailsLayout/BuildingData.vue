<template>
  <div class="talent-wrapper" :class="{'simple':simple}">
    <div v-for="(item, index) in building" :key="index" class="talent">
      <div v-if="!simple" class="talent-title building-title">
        <span>{{ item[0].data.buffName }}</span>
        <span
          v-if="!simple"
          class="room-type"
          :style="{backgroundColor: getRoomColor(item[0].data.roomType), color: getRoomFrontColor(item[0].data.roomType)}"
        >{{ getRoomName(item[0].data.roomType) }}</span>
      </div>
      <div v-for="(build, i) in item" :key="build.id" class="talent-desc">
        <div class="talent-desc-title">
          <span
            v-if="simple"
            class="room-type"
            :style="{backgroundColor: getRoomColor(item[0].data.roomType), color: getRoomFrontColor(item[0].data.roomType)}"
          >{{ getRoomName(item[0].data.roomType) }}</span>
          <span v-if="simple">{{ build.data.buffName }}</span>
          <span
            v-if="build.data.buffName !== item[0].data.buffName"
            class="building-info-need"
          >←{{ item[i - 1].data.buffName }}</span>
          <span class="talent-desc-condition">精英{{ build.cond.phase }}/{{ build.cond.level }}级</span>
        </div>
        <div class="talent-desc-content">
          <div class="talent-desc-content-item">
            <span v-html="changeDesc(build.data.description)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeDesc, getProfilePath } from '../../utils'
import room from '@/utils/data/room.json'

export default {
  props: {
    building: {
      type: [Object, Array],
      required: true
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTalentPotencailUP: [false, false, false]
    }
  },
  methods: {
    changeDesc(desc) {
      return changeDesc(desc)
    },
    getRoomName(key) {
      return room[key].name
    },
    getRoomColor(key) {
      return room[key].color
    },
    getRoomFrontColor(key) {
      return room[key].fontColor || 'white'
    },
    getProfilePath(key) {
      return getProfilePath(key)
    }
  }
}
</script>

<style lang="stylus" >
@import './styl/talent.styl'

.room-type {
  display: inline-block
  padding: 3px 10px
  font-size: 14px
  border-radius: 4px
  color: white
}

.building-title {
  display: flex
  //justify-content: space-between
}

.building-info-need {
  font-size: 12px
}

.simple {
  .talent {
    &-desc {
      &-title {
        margin: 0
        display: flex
        align-items: center
        padding-bottom: 4px
        border-bottom: 1px solid rgba(168, 168, 168, 0.3)
        width: 80%
        word-break: keep-all
        white-space: nowrap

        .room-type {
          margin-right: 10px
        }
      }

      &-condition {
        margin-left: 10px
        border: none
        margin: 0
        margin-left: auto
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .room-type {
    display: inline-block
    padding: vw(6) vw(30)
    font-size: vw(24)
    text-align: center
    border-radius: vw(8)
    color: white
  }
}
</style>
