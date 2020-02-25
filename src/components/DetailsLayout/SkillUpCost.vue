<template>
  <div v-if="skills.length > 0" class="skill-containers-wrapper">
    <div v-for="(skill, index) in unlockCond" :key="skill.name" class="skill-container">
      <div class="pic">
        <skill-container :skill="skills[index]" />
      </div>
      <div class="body">
        <div class="skill-body-text">
          需要：精英
          <span
            :style="skill.data[sLevel[index]].unlockCond.phase > 0 ? 'color: #f49800' : ''"
          >{{ skill.data[sLevel[index]].unlockCond.phase }}</span>
          /
          <span>{{ skill.data[sLevel[index]].unlockCond.level }}</span>
          <span>，材料：</span>
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

      <div class="control">
        <div class="skill-control">
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
  </div>
</template>

<script>
import { getItem } from '../../utils/fetch'
import { itemBackground } from '../../utils/string'
import ItemViewer from '../ItemViewer'
import SkillContainer from './SkillContainer'
import './styl/skill.styl'
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
      for (let i = 0; i < this.skills.length; i++) {
        res.push({
          Id: this.skills[i],
          data: [...this.allLevelCost, ...this.seven[i].levelUpCostCond]
        })
      }
      return res
    }
  },
  beforeMount() {
    for (let i = 0; i < this.unlockCond.length; i++) {
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
.skill-body-item {
  width: 100px
  margin: 0
}

.skill-body {
  &-part {
    padding-left: 20px
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
  display: flex
  align-items: center
  word-break: keep-all
  white-space: nowrap
  height: 100%

  &-lv {
    display: inline-block
    vertical-align: middle
    left: 0
    padding-right: 2vw
  }
}

@media screen and (max-width: 700px) {
  .skill-control {
    &-lv {
      padding-right: vw(30)
    }
  }
}

@media screen and (max-width: 500px) {
  .skill-containers-wrapper {
    margin-bottom: vw(60)
  }

  .skill-body-item {
    width: vw(170)
  }

  .skill-body {
    margin-top: vw(30)
    border: none
    width: 100%
    padding: 0

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
}
</style>
