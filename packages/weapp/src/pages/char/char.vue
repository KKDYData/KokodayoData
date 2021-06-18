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
        <view class="flex-1 ml-15px">
          <view class="flex font-0px items-start">
            <view class="flex items-stretch">
              <view
                class="bg-white rounded-2px shadow-base w-10px overflow-hidden"
              />
              <view class="bg-white rounded flex font-0px shadow-base ml-5px">
                <view class="flex flex-col mr-8px py-4px pl-3px text-dark-40">
                  <view class="text-0px">
                    <view
                      class="bg-dark-40 rounded-1px h-10px w-10px inline-block"
                    />
                    <text class="font-bold text-10px">
                      R{{ id.split('_')[1] }}
                    </text>
                  </view>
                  <view class="font-bold mt-auto mb-2px text-20px text-dark-40">
                    {{ getProffessionCn(data.profession) }}
                  </view>
                </view>
                <KIcon :size="20" :name="getProfessionIcon(data.profession)" />
              </view>
            </view>
            <view class="ml-15px">
              <view class="text-dark-50 text-40px">{{ data.name }}</view>
              <view class="text-right text-14px italic underline">{{
                data.appellation
              }}</view>
            </view>
          </view>
          <CharStar :size="10" :rarity="data.rarity" />
          <view class="mt-10px ml-10px text-dark-50">
            <view class="text-xl mb-1 text-20px">
              {{ data.description }}
            </view>
            <view class="text-xl text-18px">
              {{ data.itemDesc }}
            </view>
            <view class="text-xl text-18px">
              {{ data.itemUsage }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="data">
      <Title slim-bar title-cn="属性" slim :size="30" />
      <view class="mt-20px ml-10px grid gap-y-10px grid-cols-2">
        <LabelText
          v-for="(v, i) in Array.from({ length: 8 })"
          :key="i"
          :label="['攻击', '生命上限', '阻挡数'][i % 3]"
          width="120rpx"
        >
          <template #value>
            <text class="font-bold text-dark-50">
              2000 <text class="text-hex-cc5900">[+200]</text>
            </text>
          </template>
        </LabelText>
      </view>
    </view>
    <view>
      <Title slim-bar title-cn="精英阶段" slim :size="24" />
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
import { LabelText } from '/@/components/LabelText'
import { Tag } from '/@/components/Tag'

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
