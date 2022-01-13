<template>
  <view class="bg-dark-50 tag" :class="mode">
    <slot>
      {{ label }}
    </slot>
  </view>
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    size?: 'base' | 'mini' | 'large'
    type?: '' | 'light'
  }>(),
  {
    type: '',
    size: 'base',
  }
)

const mode = computed(() => {
  const classes: string[] = []
  classes.push(props.size)
  classes.push(props.type)
  return classes.filter((e) => e).join(' ')
})
</script>

<style lang="styl">
.tag {
  @apply bg-dark-50 rounded-10px text-white  px-2 inline-block overflow-hidden text-center;

  /* &.large {
    @apply text-32px leading-40px;
  } */

  &.base {
    font-size: 22px;
    line-height: 40px;
    height: 40px;
    @apply px-16px;
  }

  &.mini {
    font-size: 20px;
    line-height: 30px;
    height: 30px;
    @apply px-20px;
  }

  &.light {
    @apply bg-yellow-500
  }
}
</style>
