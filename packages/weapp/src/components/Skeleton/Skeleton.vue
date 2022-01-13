<template>
  <view class="relative" :style="{ width, height }">
    <slot v-if="src && show">
      <view
        :style="{ backgroundImage: `url(${src})` }"
        class="profile bg-contain show"
        key="data"
      />
    </slot>
    <slot v-if="!show" name="skeleton">
      <view key="skel" class="absolute top-0 left-0" :style="{ width, height }">
        <view
          class="profile skeleton"
          :style="{
            backgroundImage: skeletonUrl ? `url(${skeletonUrl})` : 'none',
            backgroundColor: skeletonUrl
              ? 'transparent'
              : 'rgba(212, 212, 216)',
          }"
        />
      </view>
    </slot>
  </view>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    skeletonUrl?: string
    size?: number
    src: string
    show?: boolean
    width?: number
  }>(),
  {
    _skeleton: false,
    size: 180,
    show: true,
  }
)

const height = computed(() => `${props.size}rpx`)
const width = computed(() => `${props.width ?? props.size}rpx`)
</script>

<style lang="styl">
.profile {
  @apply relative h-full w-full bg-contain overflow-hidden;


  &.show {
    background-color: transparent;
  }
}
</style>
