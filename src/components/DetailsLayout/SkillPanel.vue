<template>
  <div v-if="skills && skills.length > 0" class="skill-containers-wrapper">
    <div v-for="(skill, index) in skills" :key="index" class="skill-container">
      <div class="pic">
        <skill-container v-if="showPic" :skill="skills[index]" />
        <p v-else>{{ skill.levels[index].name }}</p>
      </div>
      <div
        v-if="skill.levels[sLevel[index]-1]"
        class="body"
        :style="!showPic ? 'width: 100%; padding-left: 0' : ''"
      >
        <div v-if="skill.levels[sLevel[index]-1]" class="skill-status">
          <span>
            <i class="el-icon-caret-right" />
            {{ skill.levels[sLevel[index]-1].spData.initSp }}
          </span>
          <span>
            <i class="el-icon-star-on" />
            {{ skill.levels[sLevel[index]-1].spData.spCost }}
          </span>
          <span v-if="skill.levels[sLevel[index]-1].duration > 0">
            <i class="el-icon-timer" />
            {{ skill.levels[sLevel[index]-1].duration }}
          </span>
          <span
            v-if="skill.levels[0].spData.spType !== 8"
            class="skill-type"
            :style="changeSpType(skill.levels[0].spData.spType).style"
          >{{ changeSpType(skill.levels[0].spData.spType).value }}</span>
          <span
            class="skill-type"
            :style="changeSkillType(skill.levels[0].skillType).style"
          >{{ changeSkillType(skill.levels[0].skillType).value }}</span>
        </div>
        <div class="skill-status-desc swiper-no-swiping">
          <span v-html="changeSkillDesc(skill.levels[sLevel[index]-1])" />
          <div v-if="showRange && skill.levels[sLevel[index]-1].rangeId" class="skill-range-button">
            <h-popover placement="right-start" :width="200" trigger="click" append-to-body>
              <range :range-id="skill.levels[sLevel[index]-1].rangeId" />
              <el-button slot="reference" size="mini">查看范围</el-button>
            </h-popover>
          </div>
        </div>
      </div>

      <div v-if="!initLv && skill.levels.length > 1" class="control">
        <!-- <skill-chart
            v-if="!production && !initLv && skill.levels[0]"
            class="control-body"
            :status="status"
            :skill="skill.levels[sLevel[index]-1]"
            :talents="talents"
            :profession="profession"
            :talent-potentail-up="talentPotentailUp"
            :description="description"
        ></skill-chart>-->
        <div class="control-body">
          <div class="control-body-lv">
            <span>LV</span>
            <span>{{ sLevel[index] }}</span>
          </div>
          <div>
            <el-button icon="el-icon-minus" size="mini" circle @click="sLevelAdd(index, -1)" />
            <el-button circle icon="el-icon-plus" size="mini" @click="sLevelAdd(index, 1)" />
          </div>
          <skill-list :short="short" :skills="skill" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeAttackSpeed, } from '../../utils'
import './styl/skill.styl'
import Range from './Range'
import SkillContainer from './SkillContainer'
import SkillList from './SkillList'
import HPopover from '@/components/base/Popover'

import { mapState } from 'vuex'

export default {
  components: {
    Range,
    SkillContainer,
    SkillList,
    HPopover
  },
  props: {
    skills: {
      type: [Object, Array],
      required: true
    },
    showPic: {
      type: Boolean,
      default: true
    },
    showRange: {
      type: Boolean,
      default: true
    },
    initLv: {
      default: undefined,
      type: Number
    },
    status: {
      type: Object,
      default: null,
    },
    talents: {
      type: [Object, Array],
      default: null,
    },
    profession: {
      default: '',
      type: String
    },
    talentPotentailUp: {
      type: [Object, Array],
      default: null,
    },
    description: {
      type: String,
      default: ''
    }
  },
  data() {
    const initLv = this.initLv !== undefined ? this.initLv : 7
    return {
      sLevel: [initLv, initLv, initLv],
      // eslint-disable-next-line no-undef
      production: process.env.PRODUCTION
    }
  },
  computed: {
    ...mapState(['short']),
  },
  methods: {
    sLevelAdd(index, i) {
      let num = this.sLevel[index] + i
      if (num > this.skills[0].levels.length)
        num = this.skills[0].levels.length
      if (num < 1) num = 1
      if (num < 8) {
        this.sLevel = [num, num, num]
      } else this.$set(this.sLevel, index, num)
    },
    changeSpType(type) {
      const typeList = {
        8: {
          value: '被动',
          style: {
            'background-color': 'rgb(153, 153, 153)'
          }
        },
        1: {
          value: '自动回复',
          style: {
            'background-color': 'rgb(138, 187, 33)'
          }
        },
        2: {
          value: '攻击回复',
          style: {
            'background-color': 'rgb(252, 121, 61)'
          }
        },
        4: {
          value: '受击回复',
          style: {
            'background-color': 'rgb(243, 172, 4)'
          }
        }
      }
      return typeList[type]
    },
    changeSkillType(type) {
      const typeList = {
        0: {
          value: '被动'
        },
        1: {
          value: '手动触发'
        },
        2: {
          value: '自动触发'
        }
      }
      return typeList[type]
    },
    changeSkillDesc(skill) {
      return changeAttackSpeed(skill)
    }
  }
}
</script>


<style lang="stylus" scoped>
.control-body-lv {
  padding-right: 20px
}

.skill-type {
  word-break: keep-all
  color: white
  padding: 0px !important
  width: calc(64px + 1vw)
  text-align: center
  display: inline-block
  border-radius: 3px
  background-color: rgb(153, 153, 153)
  box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.15)
}

.skill-status {
  font-size: 14px

  span + span {
    margin-right: 5px
  }

  &-desc {
    font-size: 16px
    color: #606266
    padding: 20px 10px
    display: flex
    align-items: center
    position: relative
  }
}

.skill-range-button {
  position: absolute
  bottom: -5px
  z-index: 1

  .el-button--mini {
    padding: 2px 3px
    margin-top: 5px
  }
}

.control-body {
  display: flex
  align-items: center
  width: 100%
  justify-content: flex-end
}

@media screen and (max-width: 700px) {
  .skill-status {
    font-size: calc(12px + 0.5vw)

    &s-desc {
      font-size: calc(13px + 0.5vw)
    }
  }

  .control-body-lv {
    display: inline-block
    left: 0
    padding-right: 2vw
  }
}

@media screen and (max-width: 500px) {
  .skill-status {
    font-size: vw(26)

    span + span {
      margin: vw(0)
    }

    &-desc {
      font-size: vw(32)
      padding: vw(20) vw(10) vw(30)
    }
  }

  .skill-type {
    width: vw(135)
    text-align: center
    display: inline-block
    border-radius: 3px
    background-color: rgb(153, 153, 153)
    box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.15)
  }

  .control-body-lv {
    display: inline-block
    left: 0
    padding-right: 2vw
  }
}
</style>
