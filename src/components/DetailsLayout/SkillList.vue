<template>
  <h-popping :visible-arrow="false" size="90%" :width="800" placement="left">
    <div slot="title">{{ skills.levels[0].name }}-技能详情</div>
    <div slot="reference" class="el-circle-icon" style="position: unset; margin-left: 10px">
      <i class="el-icon-more" />
    </div>
    <div style="max-height: 80vh; overflow-y: auto">
      <div v-for="(skill, index) in skills.levels" :key="index" style="margin: 20px 10px">
        <div class="skill-list-title">
          <div>
            <span>
              <span>
                <i class="el-icon-caret-right" />
                {{ skill.spData.initSp }}
              </span>
              <span>
                <i class="el-icon-star-on" />
                {{ skill.spData.spCost }}
              </span>
            </span>
            <span v-if="skill.duration > 0">
              <i class="el-icon-timer" />
              {{ skill.duration }}
            </span>
          </div>
          <div class="skill-list-title-lv">
            <span v-if="index < 7">Level{{ index + 1 }}</span>
            <span v-else>专精{{ index - 6 }}</span>
          </div>
        </div>
        <div class="skill-status-desc">
          <span v-html="changeSkillDesc(skill)" />
        </div>
      </div>
    </div>
  </h-popping>
</template>


<script>
import { changeAttackSpeed } from '../../utils'
import HPopping from '@/components/base/Popping'

export default {
  components: {
    HPopping
  },
  props: {
    skills: {
      type: Object,
      required: true
    },
    short: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    changeSkillDesc(skill) {
      return changeAttackSpeed(skill)
    }
  }
}
</script>

<style lang="stylus" scoped>
.skill-list-title {
  display: flex
  align-items: baseline
  border-bottom: 1px solid rgba(125, 125, 125, 0.2)

  &-lv {
    margin-left: auto
    font-size: 1.3em
  }
}
</style>
