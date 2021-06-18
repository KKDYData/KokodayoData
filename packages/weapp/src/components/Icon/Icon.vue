<template>
  <iconfont
    v-if="name"
    :size="size ? size * 2 : 24"
    :color="color"
    :style="style"
    :name="name.replace('icon', '')"
    style="vertical-align: -0.3em"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  /**
   * 会自动去掉icon，放心复制iconfont 上面的id
   */
  name: string
  /**
   * 会自动 * 2，根据当前的字体大小的px来设置
   */
  size?: number
  color?: string
  style?: string
}>()
</script>

<style>
.icon {
  @apply inline-block;
}
</style>
