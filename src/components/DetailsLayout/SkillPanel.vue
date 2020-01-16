<template>
  <div v-if="skills && skills.length > 0" class="skill-container--inner-wrapper">
    <div v-for="(skill, index) in skills" :key="index" class="skill-container">
      <div class="skill-title">
        <skill-container v-if="showPic" :skill="skills[index]" />
        <p v-else>{{ skill.levels[index].name }}</p>
        <div
          v-if="skill.levels[sLevel[index]-1]"
          class="skill-tiltle-part"
          :style="!showPic ? 'width: 100%; padding-left: 0' : ''"
        >
          <div v-if="skill.levels[sLevel[index]-1]" class="skill-status">
            <span>
              <span>
                <i class="el-icon-caret-right" />
                {{ skill.levels[sLevel[index]-1].spData.initSp }}
              </span>
              <span>
                <i class="el-icon-star-on" />
                {{ skill.levels[sLevel[index]-1].spData.spCost }}
              </span>
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
          <div class="skill-status-desc">
            <span v-html="changeSkillDesc(skill.levels[sLevel[index]-1])" />
            <div
              v-if="showRange && skill.levels[sLevel[index]-1].rangeId"
              class="skill-range-button"
            >
              <el-popover placement="right" width="200px" trigger="click">
                <range :range-id="skill.levels[sLevel[index]-1].rangeId" />
                <el-button slot="reference" size="mini">查看范围</el-button>
              </el-popover>
            </div>
          </div>
        </div>

        <div v-if="!initLv && skill.levels.length > 1" class="skill-name-level">
          <!-- <skill-chart
            v-if="!production && !initLv && skill.levels[0]"
            class="skill-name-level-item"
            :status="status"
            :skill="skill.levels[sLevel[index]-1]"
            :talents="talents"
            :profession="profession"
            :talent-potentail-up="talentPotentailUp"
            :description="description"
          ></skill-chart>-->
          <div class="skill-name-level-item">
            <div class="skill-title-level">
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
  </div>
</template>

<script>
import { changeAttackSpeed, } from '../../utils'

import Range from './Range'
import SkillContainer from './SkillContainer'
import SkillList from './SkillList'

import { mapState } from 'vuex'

export default {
  components: {
    Range,
    SkillContainer,
    SkillList
  },
  props: {
    skills: {
      required: true
    },
    showPic: {
      default: true
    },
    showRange: {
      default: true
    },
    initLv: {
      type: Number
    },
    status: {
      required: false
    },
    talents: {
      required: false
    },
    profession: {
      tyep: String
    },
    talentPotentailUp: {
      required: false
    },
    description: {
      default: ''
    }
  },
  data() {
    const initLv = this.initLv ? this.initLv : 7
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
/*part 4*/
.group-container-title {
  font-weight: bold
  color: white
  margin-bottom: 20px
  background-color: #414141
  padding-left: 1vw
}

.skill-container--inner-wrapper {
  margin-top: 30px
}

.skill-container {
  padding-bottom: 38px
  position: relative
}

.skill-container + .skill-container {
  border-top: 1px solid rgb(235, 238, 245)
}

.skill-title {
  position: relative
  display: flex
  align-items: stretch
  flex-wrap: wrap
  margin-top: 20px
  justify-content: start
  padding: 0 5px
  width: calc(100% - 10px)
}

.skill-tiltle-part {
  padding-left: 20px
  width: calc(70% - 100px)
}

.skill-title-level {
  margin-right: 20px
}

.skill-name-level {
  border-left: 1px solid rgba(158, 158, 158, 0.4)
  display: flex
  align-items: flex-end
  flex-wrap: wrap
  padding-right: 20px
  flex-grow: 1
  width: min-content
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
}

.skill-status-desc {
  font-size: 16px
  color: #606266
  padding: 20px 10px
  display: flex
  align-items: center
  position: relative
}

.skill-status span + span {
  padding-right: 5px
}

.extra-card {
  margin-top: 5vw
  margin-bottom: 5vw
}

.skill-range-button {
  position: absolute
  bottom: -5px
}

.skill-range-button .el-button--mini {
  padding: 2px 3px
  margin-top: 5px
}

.skill-name-level-item {
  display: flex
  align-items: center
  width: 100%
  justify-content: flex-end
  margin-bottom: 10px
}

@media screen and (max-width: 700px) {
  .skill-container--inner-wrapper {
    margin-bottom: 20px
  }

  .skill-status {
    font-size: calc(12px + 0.5vw)
  }

  .skill-status span + span {
    padding: 0px
  }

  .skill-status-desc {
    font-size: calc(13px + 0.5vw)
  }

  .talents-effects-desc {
    font-size: calc(12px + 0.5vw)
  }

  .skill-title-level {
    display: inline-block
    left: 0
    padding-right: 2vw
  }

  .skill-tiltle-part {
    flex-wrap: wrap
    padding-left: 2vw
    width: calc(100% - 65px - 3vw)
    border: none
  }

  .skill-name-level {
    width: 100%
    border: none
  }

  .skill-name-level span {
    vertical-align: -5%
  }

  .skill-container {
    padding-bottom: 10px
  }

  .skill-range-button {
    position: absolute
    z-index: 1
  }
}
</style>
