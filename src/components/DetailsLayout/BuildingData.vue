<template>
  <div class="talent-wrapper">
    <div v-for="(item, index) in building" :key="index" class="talent">
      <div class="talent-title">
        <span>{{ item[0].data.buffName }}</span>
      </div>
      <div v-for="build in item" :key="build.id" class="talent-desc">
        <div class="talent-desc-condition">
          <span>精英{{ build.cond.phase }}/{{ build.cond.level }}级</span>
        </div>
        <div class="talent-desc-content-wrapper">
          <div class="talent-desc-content">
            <span v-html="changeDesc(build.data.description)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeDesc } from '../../utils'

export default {
  props: {
    building: {
      type: [Object, Array],
      required: true
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './styl/talent.styl'
</style>
