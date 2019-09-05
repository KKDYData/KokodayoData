<template>
  <el-popover :visible-arrow="false">
    <div slot="reference" class="el-circle-icon" style="position: unset; margin-left: 10px">
      <i class="el-icon-more"></i>
    </div>
    <div style="max-height: 80vh; overflow-y: scroll">
      <div v-for="(skill, index) in skill.levels" :key="index" style="margin: 10px">
        <div style="display: flex; align-items: baseline;">
          <div>
            <span>
              <span>
                <i class="el-icon-caret-right"></i>
                {{skill.spData.initSp}}
              </span>
              <span>
                <i class="el-icon-star-on"></i>
                {{skill.spData.spCost}}
              </span>
            </span>
            <span v-if="skill.duration > 0">
              <i class="el-icon-timer"></i>
              {{skill.duration}}
            </span>
          </div>
          <div style="margin-left: auto; font-size: 1.5em">
            Level
            <span>{{index + 1}}</span>
          </div>
        </div>
        <div class="skill-status-desc">
          <span v-html="changeSkillDesc(skill)"></span>
        </div>
      </div>
    </div>
  </el-popover>
</template>


<script>
import { changeAttackSpeed } from "../../utils";
import Range from "./Range";

export default {
  components: {
    Range
  },
  props: {
    skill: {
      required: true
    },
    showRange: {
      default: true
    }
  },
  methods: {
    changeSkillDesc(skill) {
      return changeAttackSpeed(skill);
    }
  }
};
</script>
