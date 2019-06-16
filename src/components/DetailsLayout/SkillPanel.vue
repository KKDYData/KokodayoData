<template>
  <div v-if="skills.length > 0" class="skill-container-wrapper">
    <div class="group-container-title">技能</div>
    <div class="skill-container" v-for="(skill, index) in skills" :key="skill.name">
      <div class="skill-title">
        <skill-container :skill="skills[index]"></skill-container>
        <div class="skill-tiltle-part" v-if="skill.levels[sLevel[index]-1]">
          <div class="skill-status" v-if="skill.levels[sLevel[index]-1]">
            <span>
              <span>
                <i class="el-icon-caret-right"></i>
                {{skill.levels[sLevel[index]-1].spData.initSp}}
              </span>
              <span>
                <i class="el-icon-star-on"></i>
                {{skill.levels[sLevel[index]-1].spData.spCost}}
              </span>
            </span>

            <span v-if="skill.levels[sLevel[index]-1].duration > 0">
              <i class="el-icon-timer"></i>
              {{skill.levels[sLevel[index]-1].duration}}
            </span>
            <span
              v-if="skill.levels[0].spData.spType !== 8"
              class="skill-type"
              :style="changeSpType(skill.levels[0].spData.spType).style"
            >{{changeSpType(skill.levels[0].spData.spType).value}}</span>
            <span
              class="skill-type"
              :style="changeSkillType(skill.levels[0].skillType).style"
            >{{changeSkillType(skill.levels[0].skillType).value}}</span>
          </div>
          <div class="skill-status-desc">
            <span v-html="changeSkillDesc(skill.levels[sLevel[index]-1])"></span>
            <div class="skill-range-button" v-if="skill.levels[sLevel[index]-1].rangeId">
              <el-popover placement="right" width="200px" trigger="click">
                <range :rangeId="skill.levels[sLevel[index]-1].rangeId"></range>
                <el-button size="mini" slot="reference">查看范围</el-button>
              </el-popover>
            </div>
          </div>
        </div>
      </div>

      <div class="skill-name-level">
        <span class="skill-title-level">
          LV
          <span>{{sLevel[index]}}</span>
        </span>
        <el-button icon="el-icon-minus" size="mini" circle @click="sLevelAdd(index, -1)"></el-button>
        <el-button circle icon="el-icon-plus" size="mini" @click="sLevelAdd(index, 1)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { path, changeDesc } from '../utils';
import Range from './Range';
import SkillContainer from './SkillContainer';

export default {
  components: {
    range: Range,
    'skill-container': SkillContainer
  },
  props: {
    skills: {
      required: true
    }
  },
  mounted() {
    console.log(this.skills);
  },
  data() {
    return {
      sLevel: [1, 1, 1]
    };
  },
  methods: {
    sLevelAdd(index, i) {
      let num = this.sLevel[index] + i;
      if (num > this.skills[0].levels.length)
        num = this.skills[0].levels.length;
      if (num < 1) num = 1;
      if (num < 8) {
        this.sLevel = [num, num, num];
      } else this.$set(this.sLevel, index, num);
    },
    getSkillPath(skill) {
      const name = skill.iconId ? skill.iconId : skill.skillId;
      return path + 'skills/pics/skill_icon_' + name + '.png';
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
      };
      return typeList[type];
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
      };
      return typeList[type];
    },
    changeSkillDesc(skill) {
      const str = changeDesc(skill.description);
      let res = str.replace(/(\{)(.*?)(\})/g, (match, p1, p2, p3, p4, p5) => {
        let percent = '',
          minus = false,
          res = '',
          factor = 100;
        if (p2.match(/:0%/)) {
          p2 = p2.slice(0, -3);
          percent = '%';
        }
        if (p2.match(/:0.0%/)) {
          p2 = p2.slice(0, -5);
          percent = '%';
          // factor = 1;
        }
        if (p2.match(/:0.0/)) {
          p2 = p2.slice(0, -4);
          percent = '';
          // factor = 1;
        }
        if (p2.match(/-/)) {
          p2 = p2.slice(1);
          minus = true;
        }
        let temp = skill.blackboard.find(el => el.key === p2.toLowerCase());
        if (temp) {
          res = temp.value;
          if (minus) res *= -1;
          if (percent) res = Math.floor(res * factor);
        }
        return res + percent;
      });
      const skill_time_text = res.match(/攻击间隔/);
      if (skill_time_text) {
        const skill_base_time = skill.blackboard.find(
          el => el.key === 'base_attack_time'
        );
        const text = res
          .slice(skill_time_text.index + 4)
          .match(/(<.*?>)(.*?)(<\/.*?>)/);

        console.log(text[2]);
        // console.log(skill_time_text);
        // console.log(skill_time_text.index + 4 + text[0].length);
        const unit = text[2] !== '极大幅度缩短' ? 's' : '%';
        let value = skill_base_time.value;
        if (unit === '%') value *= 100;
        const temp = res.split('');
        temp.splice(
          skill_time_text.index + 4 + text[0].length,
          0,
          `(${value}${unit})`
        );

        res = temp.join('');
      }
      return res;
    }
  }
};
</script>

<style scoped>
/* part 4 */

.skill-container {
  border-bottom: 1px solid rgb(235, 238, 245);
  padding-bottom: 38px;
  position: relative;
}
.group-container-title {
  border-bottom: 1px solid rgb(235, 238, 245);
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding-left: 10px;
}
.skill-title {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-top: 20px;
  justify-content: start;
  padding: 0 5px;
  width: calc(100% - 10px);
}

.skill-tiltle-part {
  padding-left: 20px;
  width: calc(70% - 100px);
  border-right: 1px solid rgba(158, 158, 158, 0.4);
}
.skill-title-level {
  display: inline-block;
  left: 0;
  padding-right: 2vw;
}
.skill-name-level {
  position: absolute;
  margin-top: 2vw;
  margin-bottom: 2vw;
  right: 0px;
  bottom: 10px;
}

.skill-type {
  word-break: keep-all;
  color: white;
  padding: 0px !important;
  width: 70px;
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  background-color: rgb(153, 153, 153);
}
.skill-status {
  font-size: 14px;
}
.skill-status-desc {
  font-size: 16px;
  color: #606266;
  font-size: 16px;
  color: #606266;
  height: calc(100% - 20px);
  display: flex;
  align-items: center;
}
.skill-status span + span {
  padding-right: 5px;
}

.extra-card {
  margin-top: 5vw;
  margin-bottom: 5vw;
}

.skill-range-button {
  position: absolute;
  bottom: -5px;
}

.skill-range-button .el-button--mini {
  padding: 2px 3px;
  margin-top: 5px;
}

@media screen and (max-width: 700px) {
  .skill-status {
    font-size: calc(12px + 0.5vw);
  }
  .skill-status-desc {
    font-size: calc(13px + 0.5vw);
  }
  .talents-effects-desc {
    font-size: calc(12px + 0.5vw);
  }
  .skill-title-level {
    /* padding-left: 2vw; */
    display: inline-block;
    /* position: absolute; */
    /* right: 2vw; */
    /* position: absolute; */
    left: 0;
    padding-left: 35vw;
    padding-right: 2vw;
    /* width: calc(100%-100px); */
  }
  .skill-tiltle-part {
    /* display: inline-block; */
    /* display: flex; */
    flex-wrap: wrap;
    padding-left: 2vw;
    width: calc(100% - 65px - 1vw);
    border: none;
  }
  .skill-name-level {
    position: relative;
    right: -90px;
    top: 0;
  }
  .skill-container {
    padding-bottom: 0px;
  }
  .skill-range-button {
    position: absolute;
    bottom: -25px;
    z-index: 1;
  }
}
</style>
