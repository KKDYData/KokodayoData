<template>
  <view class="flex items-center h-60px" :label="label" :width="width">
    <view class="overflow-hidden">
      <Title :size="24" :style="{ width }" :title-cn="label" />
    </view>
    <view class="flex-1 ml-15px flex items-center">
      <view class="self-stretch" @touchend="add(-1)">
        <KIcon v-if="controls" name="iconyemianqiehuan-zuojiantou" />
      </view>
      <view
        class="text-22px flex-1 mx-10rpx border-2 border-gray-700 rounded bg-white"
      >
        <picker
          class="w-full"
          :value="__value"
          :range="__range"
          range-key="label"
          @change="handleChagne"
        >
          <view class="text-xs text-center">
            <slot v-bind="{ value: __value, getLabel }">
              {{ getLabel(__value) }}
            </slot>
          </view>
        </picker>
      </view>
      <view v-if="controls" @touchend="add(1)">
        <KIcon name="iconyemianqiehuan-youjiantou" />
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
