<template>
  <div class="info-subtitle subtitle-decoration">{{ title }}</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<style lang="css" scoped>
.info-subtitle {
  @apply w-1/4 h-10 pl-4 my-2 bg-gray-600 border-transparent
  @apply text-left text-white font-bold leading-10 tracking-widest;
}

.subtitle-decoration {
  border-bottom: 42px solid rgba(75, 85, 99, 1);
  border-right: 40px solid;
}
</style>
