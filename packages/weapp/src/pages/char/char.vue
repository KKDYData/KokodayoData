<template>
  <view class="index-wrapper main-bg">
    <Scan />
    <view v-if="data">
      <Title
        class="mb-6"
        slim
        :size="30"
        title-cn="干员详情"
        title-en="Operator Details"
      />
      <view class="flex">
        <AgentIconBase :data="{ charId: id, rarity: data.rarity }" />
        <view class="ml-15px">
          <view class="flex items-center">
            <Title
              :title-cn="data.name"
              :title-en="data.appellation"
              italic
              slim
              slim-bar
            />
            <KIcon :size="20" :name="getProfessionIcon(data.profession)" />
            <text class="font-bold text-lg text-trueGray-500">
              {{ getProffessionCn(data.profession) }}
            </text>
            <CharStar :size="15" :rarity="data.rarity" />
          </view>
          <view class="mt-10px ml-10px">
            <view class="text-xl mb-1 text-20px">
              {{ data.description }}
            </view>
            <view class="text-xl text-16px">
              {{ data.itemDesc }}
            </view>
            <view class="text-xl text-16px">
              {{ data.itemUsage }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view>
      <Title slim-bar title-cn="属性" />
    </view>
  </view>
</template>
<script setup lang="ts">
import { Scan } from '/@/components/QRCode'
import { getCurrentInstance } from '@tarojs/taro'
import { Data } from '@kkdy/api-taro'
import { IChar } from '@kkdy/data'
import { AgentIconBase, CharStar } from '/@/components/AgentIcon'
import { Title } from '/@/components/Title'
import {
  getProfessionIcon,
  getProffessionCn,
} from '/@/components/AgentIcon/utils'
const id = getCurrentInstance().router?.params.id
if (!id) {
  throw new Error('no id')
}

ref: data = null as null | IChar.IData
// ref: pIconId = useProfessionIcon(data?.profession)

Data.GetCharacter({ id }).then((res) => {
  if (res.data.ok) {
    data = res.data.result.data
  }
})
</script>
