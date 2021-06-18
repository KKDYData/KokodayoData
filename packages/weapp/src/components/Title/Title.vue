<template>
  <view class="flex font-souce text-left text-dark-50 relative items-center">
    <view
      class="rounded bg-dark-50"
      :class="{ 'shadow-medium': !size }"
      :style="{
        width: size || slimBar ? '10rpx' : '20rpx',
        height: barSize,
      }"
    />
    <view class="text-shadow-md ml-6px">
      <view
        v-if="titleEn"
        class="font-sans text-30px underline"
        :class="{ italic }"
        :style="{ fontSize: fontEnSize, lineHeight: fontEnSize }"
        >{{ titleEn }}</view
      >
      <view
        class="align-baseline"
        :style="{ fontSize, lineHeight: fontSize }"
        :class="{ 'font-bold': !slim }"
        >{{ titleCn }}</view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, defineProps } from '@vue/runtime-core'

const props = defineProps<{
  titleEn?: string
  titleCn: string
  size?: number
  italic?: boolean
  slim?: boolean
  slimBar?: boolean
}>()

ref: fontSize = computed(() => (props.size ?? 40) / 2 + 'px')
ref: fontEnSize = computed(() => ((props.size ?? 30) / 2) * 0.75 + 'px')
ref: barSize = computed(
  () => ((props.size ?? 40) / 2) * (isSingleLine ? 1 : 1.75) + 'px'
)

ref: isSingleLine = computed(() => !props.titleEn)
</script>
