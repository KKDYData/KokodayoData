<template>
  <view class="text-0px filter drop-shadow-medium">
    <KIcon
      v-for="(v, i) in Array.from({ length: rarity + 1 })"
      :key="i"
      :size="size ?? 12"
      name="iconxingshu1-01"
      color="rgba(128, 128, 128, 1)"
    />
  </view>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ rarity: number; size?: number }>()
</script>
