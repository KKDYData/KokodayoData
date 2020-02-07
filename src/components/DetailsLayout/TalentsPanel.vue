<template>
  <div class="talent-wrapper">
    <div v-for="(item, index) in talents" :key="item.name" class="talent">
      <div class="talent-title">
        <span
          :style="!short && item.name && item.name.length > 5 ? 'font-size: 13px': ''"
        >{{ item.name }}</span>
        <div class="talent-title-change-button">
          <el-button
            v-if="item.condidate[0].potentailUP"
            size="mini"
            :type="!showTalentPotentailUP[index] ? 'info' : 'warning'"
            @click="openTalentPotentailUP(index)"
          >
            潜能提升
            <i :class="!showTalentPotentailUP[index] ? 'el-icon-star-off' : 'el-icon-star-on'" />
          </el-button>
        </div>
      </div>
      <div v-for="talent in item.condidate" :key="talent.description" class="talent-desc">
        <div>
          <div class="talent-desc-condition">
            <span>精英{{ talent.unlockCondition.phase }}/{{ talent.unlockCondition.level }}级</span>
          </div>
        </div>

        <div class="talent-desc-content">
          <div v-if="!showTalentPotentailUP[index]" class="talent-desc-content-item">
            <span v-html="talent.description" />
          </div>
          <div v-else class="talent-desc-content-item">
            <span v-html="talent.potentailUP.description" />
            <span>(需要潜能{{ talent.potentailUP.requiredPotentialRank + 1 }}级)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    talents: {
      type: [Object, Array],
      required: true
    },
  },
  data() {
    return {
      showTalentPotentailUP: [false, false, false]
    }
  },
  computed: {
    ...mapState(['short']),
  },
  methods: {
    openTalentPotentailUP(t) {
      this.$set(this.showTalentPotentailUP, t, !this.showTalentPotentailUP[t])
      this.$emit('talentPotentailUp', this.showTalentPotentailUP)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './styl/talent.styl'
</style>
