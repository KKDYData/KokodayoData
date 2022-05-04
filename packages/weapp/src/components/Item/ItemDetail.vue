<template>
  <view>
    <view
      class="flex items-center sticky bg-white mb-10rpx top-0 z-99 pt-20rpx"
    >
      <Skeleton :src="itemImg" :size="100" class="mr-30rpx" />
      <Title slim-bar :title-cn="data.name" slim :size="30" />
    </view>
    <Waiting />
    <view class="text-24rpx">
      <view class="px-24rpx">
        <view class="mb-16rpx">
          {{ data.usage }}
        </view>
        <view>
          {{ data.description }}
        </view>
      </view>

      <view v-if="formula.length">
        <Title title-cn="合成配方" slider slim :size="24" />
        <view class="flex items-center">
          <view
            v-for="{ costs, formulaId, goldCost } in formula"
            :key="formulaId"
          >
            <Item v-if="goldCost" id="4001" :count="goldCost" son />
            <Item
              v-for="item in costs"
              :id="item.id"
              :key="item.id"
              :count="item.count"
              son
            />
          </view>
        </view>
        <Title title-cn="合成配方" slider slim :size="24" class="mt-20rpx" />

        <view>
          <view
            v-for="drop in dropList"
            :key="drop.stageId"
            class="flex my-10rpx items-center"
          >
            <Title :title-cn="drop.stageId" slim :size="28" />
            <text class="drop-item-label">统计次数{{ drop.times }}</text>
            <text class="drop-item-label">掉率{{ percent(drop) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { IItem } from '@kkdy/data'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent } from 'vue'
import { Skeleton } from '../Skeleton'
import { Title } from '../Title'
import Waiting from '/@/components/Waiting/Waiting.vue'
import { useFormula } from './formula'
import { useItemImg } from './itemImg'
import { MatrixElement, useItemsStore } from '/@/store/items'

const Item = defineAsyncComponent(() => import('./Item.vue')) as any

const props = defineProps<{
  data: IItem.IData
}>()

const itemImg = useItemImg(props.data)
const formula = useFormula(props.data)

const itemsStore = useItemsStore()
const { dropMap } = storeToRefs(itemsStore)

const dropList = computed(() => dropMap.value.get(props.data.itemId))

const percent = (dropInfo: MatrixElement) =>
  Math.round((dropInfo.quantity / dropInfo.times) * 100) + '%'
</script>
<style lang="styl">
.drop-item-label {
  @apply bg-hex-707070  ml-10rpx text-white px-27rpx py-10rpx overflow-hidden rounded
}
</style>
