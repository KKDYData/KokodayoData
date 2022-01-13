<template>
  <view class="relative" :style="{ width, height }">
    <slot v-if="show && src">
      <image
        :style="{ transitionDuration: '1s', width, height }"
        class="profile show"
        :src="src"
        mode="heightFix"
      />
    </slot>
    <slot v-else name="skeleton">
      <image
        v-if="skeletonUrl"
        class="profile skeleton"
        :style="{ transitionDuration: '0.2s' }"
        :src="skeletonUrl"
      />
      <view v-else class="profile skeleton bg-gray-300" />
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
  }
)

const height = computed(() => `${props.size}rpx`)
const width = computed(() => `${props.width ?? props.size}rpx`)
</script>

<style lang="styl">
.profile {
  @apply z-1 relative h-full w-full;

  &.show {
    background-color: transparent;
  }

  &:image {
    height: auto
  }
}
</style>
