<template>
  <div class="talent-wrapper">
    <div v-for="(item) in talents" :key="item.name" class="talent">
      <div class="talent-title">
        <span
          :style="!short && item.name && item.name.length > 5 ? 'font-size: 13px': ''"
        >{{ item.name }}</span>
        <div class="talent-title-change-button">
          <el-button
            v-if="item.condidate[0].potentailUP"
            size="mini"
            :type="item.condidate[0].potentailUP.requiredPotentialRank > curPotentailLv + 1? 'info' : 'warning'"
            @click="changeCurPotentailLv(item.condidate[0].potentailUP.requiredPotentialRank)"
          >
            潜能{{ item.condidate[0].potentailUP.requiredPotentialRank + 1 }}级提升
            <i
              :class="item.condidate[0].potentailUP.requiredPotentialRank > curPotentailLv + 1 ? 'el-icon-star-off' : 'el-icon-star-on'"
            />
          </el-button>
        </div>
      </div>
      <div v-for="talent in item.condidate" :key="talent.description" class="talent-desc">
        <div class="talent-desc-title">
          <div class="talent-desc-condition">
            <span>精英{{ talent.unlockCondition.phase }}/{{ talent.unlockCondition.level }}级</span>
          </div>
        </div>

        <div class="talent-desc-content">
          <div
            v-if="talent.potentailUP && curPotentailLv + 2 > talent.potentailUP.requiredPotentialRank "
            class="talent-desc-content-item"
          >
            <span v-html="talent.potentailUP.description" />
          </div>
          <div v-else class="talent-desc-content-item">
            <span v-html="talent.description" />
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
    curPotentailLv: {
      type: Number,
      required: true
    }
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
    changeCurPotentailLv(v) {
      this.$emit('update:curPotentailLv', v)
    }
  }
}
</script>

<style lang="stylus"  scoped></style>
