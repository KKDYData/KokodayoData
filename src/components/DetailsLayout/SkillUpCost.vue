<template>
  <div v-if="skills.length > 0" class="skill-containers-wrapper">
    <div v-for="(skill, index) in unlockCond" :key="skill.name" class="skill-container">
      <div class="skill-body">
        <skill-container :skill="skills[index]" />
        <div class="skill-body-part">
          <div class="skill-body-text">
            <span>所需材料：</span>
          </div>
          <div class="skill-body-lvUpCost-wrapper">
            <item-viewer
              v-for="(s, i) in picList[index]"
              :key="i"
              class="skill-body-item"
              :item="s.item"
              :num="s.count"
            />
          </div>
        </div>
      </div>

      <div class="skill-control">
        <div class="skill-control-status">
          需要：
          <span>
            精英
            <span
              :style="skill.data[sLevel[index]].unlockCond.phase > 0 ? 'color: #f49800' : ''"
            >{{ skill.data[sLevel[index]].unlockCond.phase }}</span>
            /
            <span>{{ skill.data[sLevel[index]].unlockCond.level }}</span>
          </span>
        </div>
        <div>
          <span class="skill-control-lv">
            LV
            <span>{{ sLevel[index] + 1 }}</span>
            <i class="el-icon-right" />
            <span>{{ sLevel[index] + 2 }}</span>
            <span />
          </span>
          <el-button icon="el-icon-minus" size="mini" circle @click="sLevelAdd(index, -1)" />
          <el-button circle icon="el-icon-plus" size="mini" @click="sLevelAdd(index, 1)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getItem } from '../../utils/fetch'
import { itemBackground } from '../../utils/string'
import ItemViewer from '../ItemViewer'
import SkillContainer from './SkillContainer'

import { mapState } from 'vuex'

export default {
  components: {
    ItemViewer,
    SkillContainer
  },
  props: {
    skills: {
      type: Array,
      required: true
    },
    allLevelCost: {
      type: Array,
      required: true
    },
    seven: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      sLevel: this.skills[0].levels.length > 7 ? [6, 6, 6] : [5, 5, 5],
      picList: { 0: [], 1: [], 2: [] }
    }
  },
  computed: {
    ...mapState(['short']),
    unlockCond() {
      const res = []
      for (let i = 0;i < this.skills.length;i++) {
        res.push({
          Id: this.skills[i],
          data: [...this.allLevelCost, ...this.seven[i].levelUpCostCond]
        })
      }
      return res
    }
  },
  beforeMount() {
    for (let i = 0;i < this.unlockCond.length;i++) {
      this.sLevelAdd(i, 0)
    }
  },
  methods: {
    itemBackground(rarity) {
      return itemBackground[rarity]
    },
    sLevelAdd(index, i) {
      let num = this.sLevel[index] + i
      if (num > this.unlockCond[index].data.length - 1)
        num = this.unlockCond[index].data.length - 1
      if (num < 0) num = 0
      // 拆包出来的奇怪词条
      let p = num < 6 ? 'lvlUpCost' : 'levelUpCost'

      Promise.all(
        this.unlockCond[index].data[num][p].map(async p => {
          const item = await getItem(p.id)
          const res = {
            item: item,
            count: p.count
          }
          return res
        })
      ).then(arr => {
        if (p === 'levelUpCost') {
          this.$set(this.picList, index, arr)
          this.$set(this.sLevel, index, num)
        } else {
          this.picList = [arr, arr, arr]
          this.sLevel = [num, num, num]
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.skill-containers-wrapper {
  margin-top: 30px
}

.skill-container {
  padding-bottom: 10px
  position: relative
  display: flex
  margin: 20px 0 0 0
  align-items: stretch
}

.skill-container + .skill-container {
  border-top: 1px solid rgb(235, 238, 245)
  padding-top: 30px
}

.skill-body {
  position: relative
  display: flex
  justify-content: start
  padding: 0 5px
  width: calc(70% - 10px)
  min-height: 123px
  border-right: 1px solid rgba(158, 158, 158, 0.4)

  &-part {
    padding-left: 20px
    width: calc(70% - 100px)
  }

  &-lvUpCost-wrapper {
    display: flex
    align-items: center
    flex-basis: 80px
  }

  &-text {
    padding-bottom: 20px
  }
}

.skill-control {
  text-align: right
  width: 30%
  padding-right: 20px

  &-status, &-status + div {
    height: 50%
  }

  &-status-desc {
    font-size: 16px
    color: #606266
  }

  &-status span + span {
    padding-right: 5px
  }

  &-lv {
    display: inline-block
    left: 0
    padding-right: 2vw
  }
}

/*@media screen and (max-width: 700px) {
  .skill-containers-wrapper {
    margin-bottom: 30px
  }

  .skill-lvUpCost-wrapper {
    flex-basis: 70px
  }

  .skill-container {
    display: block
  }

  .skill-status {
    font-size: calc(12px + 0.7vw)
    display: inline
  }

  .skill-status + div {
    font-size: calc(12px + 0.7vw)
    display: inline
  }

  .skill-status-desc {
    font-size: calc(13px + 0.5vw)
  }

  .skill-body {
    margin-top: 15px
    border: none
  }

  .skill-body-level {
    display: inline-block
    padding-left: 10vw
    padding-right: 2vw
  }

  .skill-body-part {
    flex-wrap: wrap
    padding-left: 5vw
    width: calc(100% - 100px)
    border: none
  }

  .skill-control {
    text-align: left
    padding-top: 10px
    width: auto
  }

  .skill-container {
    margin-top: 10px
    padding-bottom: 0px
    height: 160px
  }

  .skill-container + .skill-container {
    padding: 10px 0
  }

  .skill-pic-contianer {
    width: calc(65px + 1vw)
    height: calc(65px + 1vw)
  }

  .skill-container--inner-wrapper {
    margin-bottom: 5px
  }

  .skill-body-text {
    font-size: calc(13px + 0.5vw)
    padding-bottom: 5px
  }
}*/
@media screen and (max-width: 500px) {
  .skill-containers-wrapper {
    margin-bottom: vw(60)
  }

  .skill-container {
    display: block
    margin-top: 10px
    padding-bottom: 0px
    height: vw(320)
  }

  .skill-container + .skill-container {
    padding: 10px 0
  }

  .skill-body {
    margin-top: vw(30)
    border: none
    width: 100%

    &-item {
      flex-basis: vw(150)
    }

    &-lvUpCost-wrapper {
      flex-basis: 70px
    }

    &-level {
      display: inline-block
      padding-left: 10vw
      padding-right: 2vw
    }

    &-part {
      flex-wrap: wrap
      flex: 1
      padding-left: 5vw
      border: none
      width: auto
    }

    &-text {
      font-size: calc(13px + 0.5vw)
      padding-bottom: 5px
    }
  }

  .skill-control {
    text-align: left
    padding-top: 10px
    width: auto
    display: flex
    justify-content: space-between

    &-status {
      font-size: calc(12px + 0.7vw)
      display: inline
    }

    &-status + div {
      font-size: calc(12px + 0.7vw)
      display: inline
    }

    &-status-desc {
      font-size: calc(13px + 0.5vw)
    }

    &-lv {
      padding-right: vw(30)
    }
  }
}
</style>
