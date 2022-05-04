<template>
  <view class="flex font-souce text-left text-dark-50 relative items-center">
    <view
      v-if="!slider"
      class="rounded bg-dark-50"
      :class="{ 'shadow-medium': !size }"
      :style="{
        width: size || slimBar ? '10rpx' : '20rpx',
        height: barSize,
      }"
    />
    <view class="text-shadow-md ml-6px" :class="{ 'flex-1': slider }">
      <view
        v-if="titleEn && !slider"
        class="title-content__extra"
        :class="{ italic }"
        :style="{ fontSize: fontEnSize, lineHeight: fontEnSize }"
      >
        {{ titleEn }}
      </view>
      <view
        class="title-content"
        :style="{ fontSize, lineHeight: fontSize }"
        :class="{ 'font-bold': !slim, slider, slim, without_en: !titleEn }"
      >
        {{ titleCn }}
      </view>
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
  slider?: boolean
}>()

const fontSize = computed(() => (props.size ?? 40) / 2 + 'px')
const fontEnSize = computed(() => ((props.size ?? 30) / 2) * 0.75 + 'px')
const barSize = computed(
  () => ((props.size ?? 40) / 2) * (isSingleLine.value ? 1 : 1.75) + 'px'
)

const isSingleLine = computed(() => !props.titleEn)
</script>
