<template>
  <view
    class="flex items-center h-60px text-dark-40"
    :label="label"
    :width="width"
  >
    <view class="overflow-hidden">
      <Title :size="24" :style="{ width }" :title-cn="label" />
    </view>
    <view class="flex-1 ml-15px flex items-center">
      <view v-if="controls" class="num-btn" @touchend="add(-1)">
        <KIcon :size="24" name="iconjianhao" color="#707070" />
      </view>
      <view
        class="text-50rpx w-100rpx h-50rpx flex-1 mx-10rpx rounded-7rpx bg-white shadow"
      >
        <picker
          class="w-full h-full"
          :value="__value"
          :range="__range"
          range-key="label"
          @change="handleChagne"
        >
          <view class="text-35rpx leading-50rpx text-center">
            <slot v-bind="{ value: __value, getLabel }">
              {{ getLabel(__value) }}
            </slot>
          </view>
        </picker>
      </view>
      <view v-if="controls" class="num-btn" @touchend="add(1)">
        <KIcon color="#707070" :size="24" name="iconjiahao" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Title } from '/@/components/Title'
import { pausableWatch } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue: number
    label: string
    range: { min: number; max: number }
    labelWidth?: number
    rangeFn?: (v: number, base: number) => RangeItem
    controls?: boolean
  }>(),
  {
    labelWidth: 150,
    rangeFn: (v, min) => ({
      label: String(v + min),
      value: v + min,
      index: v,
    }),
  }
)

type RangeItem = { value: any; label: string; index: number }

const emit = defineEmits<{ (name: 'update:modelValue', e: number): void }>()

const width = computed(() => {
  if (typeof props.labelWidth === 'string') {
    return props.labelWidth
  } else {
    return props.labelWidth + 'rpx'
  }
})

const __range = computed(() => {
  const { min, max } = props.range
  return Array.from({ length: max - min + 1 }, (v, i) => props.rangeFn(i, min))
})

const __value = ref(0)
watch(
  () => props.modelValue,
  () => {
    const target = __range.value.find((e) => e.value === props.modelValue)
    if (target) {
      __value.value = target.index
    }
    console.log('set')
  },
  {
    immediate: true,
  }
)

const handleChagne = (e: CustomEvent<{ value: string }>) => {
  emit('update:modelValue', getValue(+e.detail.value))
}

const getLabel = (v: number) => {
  return __range.value[v]?.label
}

const getValue = (v: number) => {
  return __range.value[v]?.value
}

const add = (v: number) => {
  const target = __range.value.findIndex((e) => e.value === props.modelValue)
  if (!__range.value[target + v]) return
  emit('update:modelValue', __range.value[target + v].value)
}
</script>

<style lang="styl">
.num-btn {
  @apply border shadow rounded-7rpx bg-white h-50rpx w-50rpx
  font-size: 0
}
</style>
