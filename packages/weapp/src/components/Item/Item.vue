<template>
  <view class="relative inline-block">
    <Skeleton :src="itemImg" show :size="120" />
    <Tag v-if="count" class="item-count-tag">{{ count }}</Tag>
  </view>
</template>

<script setup lang="ts">
import axios from 'taro-axios'
import { IItem } from '@kkdy/data'
import { computed, ref } from 'vue'
import { Skeleton } from '../Skeleton'
import { Tag } from '../Tag'

const AssetsOrigin = 'https://andata.somedata.top'
const target = 'data-2020'
const props = defineProps<{
  id: string
  count?: number
}>()

const data = ref<IItem.IData | null>(null)

axios.get(`${AssetsOrigin}/${target}/item/${props.id}.json`).then((res) => {
  data.value = res.data
})

const itemImg = computed(() => {
  if (!data.value) return ''
  return `${AssetsOrigin}/dataX/item/pic/${data.value.iconId}.png`
})
</script>

<style lang="styl">
.item-count-tag {
  @apply absolute bottom-0 right-0 z-11;
}
</style>
