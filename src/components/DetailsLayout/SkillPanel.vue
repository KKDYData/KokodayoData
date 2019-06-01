<template>
  <div v-if="skills.length > 0" class="skill-container-wrapper">
    <div class="group-container-title">技能</div>
    <div class="skill-container" v-for="(skill, index) in skills" :key="skill.name">
      <div class="skill-title">
        <div class="skill-pic-contianer">
          <el-image style="height:100%;width:100%" :src="getSkillPath(skill)" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="skill-name-wrapper">
            <span>{{skill.levels[0].name}}</span>
          </div>
        </div>
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
              class="skill-type"
              :style="changeSkillType(skill.levels[0].skillType).color"
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

export default {
  components: {
    range: Range
  },
  props: {
    skills: {
      required: true
    }
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
      this.$set(this.sLevel, index, num);
    },
    getSkillPath(skill) {
      const name = skill.iconId ? skill.iconId : skill.skillId;
      return path + 'skills/pics/skill_icon_' + name + '.png';
    },
    changeSkillType(type) {
      const typeList = {
        0: { value: '被动', color: 'color: grey' },
        1: { value: '自动回复', color: 'color: green' },
        2: { value: '攻击回复', color: 'color: red' }
      };
      return typeList[type];
    },
    changeSkillDesc(skill) {
      const str = changeDesc(skill.description);
      const res = str.replace(/(\{)(.*?)(\})/g, (match, p1, p2, p3, p4, p5) => {
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
.skill-pic-contianer {
  /* display: inline-block; */
  flex-shrink: 0.5;
  width: 100px;
  height: 100px;
  /* background: green; */
  /* font-size: 12px; */
  position: relative;
  vertical-align: middle;
}
.skill-name-wrapper {
  text-align: center;
  font-size: 15px;
}
.skill-type {
  word-break: keep-all;
  padding: 0 !important;
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
    width: calc(100% - 100px);
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
