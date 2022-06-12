<template>
  <view class="my-20px">
    <view class="flex">
      <view class="underline" style="text-underline-position: under">
        {{ state.name }}
      </view>
      <Tag class="ml-3">
        需求 精英{{ state.unlockCondition.phase }}/
        {{ state.unlockCondition.level }}级
      </Tag>
      <Tag
        v-if="nextState"
        class="ml-auto whitespace-nowrap"
        :type="isNext ? 'light' : ''"
        @touchend="toggle"
      >
        潜能 {{ nextState.requiredPotentialRank + 1 }} 级提升
        <view
          class="w-17rpx h-17rpx bg-white transform mx-5rpx inline-block transition ease"
          :class="{ 'rotate-15': isNext }"
        />
      </Tag>
    </view>
    <rich-text class="text-xs mt-3" :nodes="changeAttackSpeed(state)" />
  </view>
</template>
<script setup lang="ts">
import { IChar } from '@kkdy/data'
import { computed } from 'vue'
import { changeAttackSpeed } from './utils'
import { Tag } from '/@/components/Tag'

const props = defineProps<{
  data: IChar.Talent
  rank: number
  phase: number
  level: number
}>()

const emit = defineEmits<{
  (name: 'update:rank', v: number)
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
  }, data.candidates[0])
})

const isUnlock = computed(() => {
  const { level, phase } = props
  return (
    level >= state.value.unlockCondition.level &&
    phase >= state.value.unlockCondition.phase
  )
})

const nextState = computed(() => {
  return props.data.candidates[1]
})

const isNext = computed(() => {
  if (!nextState.value) return false
  const { rank } = props
  return nextState.value.requiredPotentialRank <= rank
})

const toggle = () => {
  emit('update:rank', nextState.value.requiredPotentialRank)
}
</script>
