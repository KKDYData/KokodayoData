<template>
  <view v-if="state" class="mb-40rpx my-20rpx min-h-240rpx">
    <view class="flex">
      <view class="flex-shrink-0">
        <Skeleton class="mx-25rpx" :src="skillIconUrl" :size="120" show />
        <view class="text-center"> {{ state.name }} </view>
      </view>
      <view class="text-20rpx">
        <view>
          <Tag :style="spType.style">
            {{ spType.value }}
          </Tag>
          <Tag class="ml-15rpx">
            {{ skillType.value }}
          </Tag>
        </view>
        <view class="flex mb-8rpx mt-15rpx">
          <view class="w-90rpx">
            <KIcon name="iconbofang" /> {{ state.spData.initSp }}
          </view>
          <view class="w-90rpx">
            <KIcon name="iconshandian" /> {{ state.spData.spCost }}
          </view>
          <view class="w-90rpx">
            <KIcon name="iconshijianlishijilujishizhongbiaoxianxing" />
            {{ state.duration }}
          </view>
        </view>
        <rich-text
          v-if="!showCost"
          class="text-xs"
          :nodes="changeAttackSpeed(state)"
        />
        <view v-else>
          <view v-if="skillCost">
            <view
              v-for="item in skillCost.levelUpCost"
              :key="item.id"
              class="inline-block mx-20rpx"
            >
              <Item :id="item.id" :count="item.count" />
            </view>
          </view>
          <view v-else> 满级了 </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { IChar, ISkill } from '@kkdy/data'
import { computed, toRef } from 'vue'
import { changeAttackSpeed } from './utils'
import { Skeleton } from '/@/components/Skeleton'
const baseUrl = 'https://andata.somedata.top/dataX/skills/pics'
import { useSpType, useSkillType } from 'core'
import { Tag } from '/@/components/Tag'
import { Item } from '/@/components/Item'

const props = defineProps<{
  data: { lvData: ISkill.Level; skillId: string }
  rank: number
  phase: number
  level: number
  skillCost: Omit<IChar.LevelUpCostCond, 'lvlUpTime'> & { lvUpTime?: number }
  showCost: boolean
}>()

const state = computed(() => {
  return props.data.lvData
})

const skillIconUrl = computed(() => {
  if (!props.data) return ''
  else return `${baseUrl}/skill_icon_${props.data.skillId}.png`
})

const spType = useSpType(toRef(props.data.lvData.spData, 'spType'))
const skillType = useSkillType(toRef(props.data.lvData, 'skillType'))
</script>
