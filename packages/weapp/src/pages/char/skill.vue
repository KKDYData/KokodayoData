<template>
  <view v-if="state" class="my-20px">
    <view class="flex">
      <view class="text-blue"> {{ state.name }} </view>
      <NumberSelector
        class="w-200px ml-auto"
        v-model="lv"
        :range="{ min: 0, max: 9 }"
        label="lv"
        :label-width="60"
      />
    </view>
    <rich-text class="text-xs" :nodes="changeAttackSpeed(state)" />
  </view>
</template>
<script setup lang="ts">
import { BaseEntityType, Data } from '@kkdy/api-taro'
import { IChar, ISkill } from '@kkdy/data'
import { computed } from 'vue'
import { changeAttackSpeed } from './utils'
import { NumberSelector } from '/@/components/NumberSelector'
import { ref } from 'vue'

const props = defineProps<{
  data: BaseEntityType<ISkill.ISkill>
  rank: number
  phase: number
  level: number
}>()
const lv = ref(0)

const state = computed(() => {
  const { data, level, phase, rank } = props
  console.log('satate', data)
  return data.data?.levels[lv.value]
})
</script>
