<template>
  <view class="my-20px">
    <view class="text-blue"> {{ state.name }}</view>
    <rich-text class="text-xs" :nodes="changeAttackSpeed(state)" />
  </view>
</template>
<script setup lang="ts">
import { IChar } from '@kkdy/data'
import { computed } from 'vue'
import { changeAttackSpeed } from './utils'

const props = defineProps<{
  data: IChar.Talent
  rank: number
  phase: number
  level: number
}>()

const state = computed(() => {
  const { data, level, phase, rank } = props
  return data.candidates.reduce((prev, cur) => {
    if (
      rank >= cur.requiredPotentialRank &&
      level >= cur.unlockCondition.level &&
      phase >= cur.unlockCondition.phase
    ) {
      return cur
    } else return prev
  })
})
</script>
