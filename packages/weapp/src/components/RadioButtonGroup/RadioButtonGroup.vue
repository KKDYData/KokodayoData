<template>
  <view class="shadow-md flex rounded-2rpx">
    <view
      v-for="op in options"
      :key="op.value"
      class="radio-button"
      :class="{ selected: op.value === modelValue }"
      @touchend="emit('update:modelValue', op.value)"
    >
      {{ op.label }}
    </view>
  </view>
</template>
<script setup lang="ts">
type ValueType = string | number | symbol

defineProps<{
  options: { label: string | number; value: ValueType }[]
  modelValue: ValueType
}>()

const emit = defineEmits<{
  (name: 'update:modelValue', v: ValueType): void
}>()
</script>
<style lang="styl">
.radio-button {
  @apply text-20rpx text-dark-50 px-20rpx py-5rpx rounded-2rpx

  &.selected {
    @apply shadow-md text-white bg-dark-50
  }
}
</style>
