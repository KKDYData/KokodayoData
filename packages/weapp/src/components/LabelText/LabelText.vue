<template>
  <view class="flex items-center">
    <Tag :style="{ width }">{{ label }}</Tag>
    <view class="ml-15px text-22px">
      <slot name="value"> {{ format(value) }} </slot>
    </view>
  </view>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import { Tag } from '../Tag'

defineProps<{
  label: string
  value?: string | number
  width?: string
  w?: string
}>()

const format = (s?: string | number) => {
  if (typeof s === 'undefined') return ''
  else if (typeof s === 'string') return s
  else return s.toFixed(2)
}
</script>
