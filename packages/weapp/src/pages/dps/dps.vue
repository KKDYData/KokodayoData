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
        <!-- 头像组件 -->
        <AgentIconBase :data="{ charId: id, rarity: data.rarity }" />
        <view class="ml-15px">
          <view class="flex items-center">
            <!-- 标题组件 -->
            <Title
              :title-cn="data.name"
              :title-en="data.appellation"
              italic
              slim
              slim-bar
            />
            <!-- 职业icon -->
            <KIcon :size="20" :name="getProfessionIcon(data.profession)" />
            <!-- 转换中文职业 -->
            <text class="font-bold text-lg text-trueGray-500">
              {{ getProffessionCn(data.profession) }}
            </text>
            <!-- 星星组件 -->
            <CharStar :size="15" :rarity="data.rarity" />
          </view>
          <!-- <view class="mt-10px ml-10px">
            <view class="text-xl mb-1 text-20px">
              {{ data.description }}
            </view>
            <view class="text-xl text-16px">
              {{ data.itemDesc }}
            </view>
            <view class="text-xl text-16px">
              {{ data.itemUsage }}
            </view>
          </view> -->
          <text>这里要计算DPS</text>
        </view>
      </view>
    </view>
    <view>
      <Title slim-bar title-cn="选择干员" />
    </view>
    <view
      class="flex font-bold h-80px text-dark-50 text-32px w-140px card items-center justify-center"
      style="
        background-color: rgba(179, 179, 179, 1);
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.16);
      "
      @tap="goTo({url: '/pages/dps/char_select'})"
    >
      选择干员
    </view>

    <view>
      <Title slim-bar title-cn="DPS计算结果" />
        <LabelText label="技能" width="120rpx">
          <template #value>
            <text class="font-bold text-dark-50">
              {{ dps.skillName }}
            </text>
          </template>
        </LabelText>
        <LabelText label="技能DPS" width="120rpx">
          <template #value>
            <text class="font-bold text-dark-50">
              {{ dps.skill.dps.toFixed(2) }}
            </text>
          </template>
        </LabelText>
        <LabelText label="普攻DPS" width="120rpx">
          <template #value>
            <text class="font-bold text-dark-50">
              {{ dps.normal.dps.toFixed(2) }}
            </text>
          </template>
        </LabelText>
        <LabelText label="平均DPS" width="120rpx">
          <template #value>
            <text class="font-bold text-dark-50">
              {{ dps.globalDps.toFixed(2) }}
            </text>
          </template>
        </LabelText>
    </view>
    <view>
      <Title slim-bar title-cn="调试信息" />
    </view>
    <view>{{ dps.log }}</view>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import { Scan } from '/@/components/QRCode'
import { getCurrentInstance } from '@tarojs/taro'
import { Data } from '@kkdy/api-taro'
import { IChar } from '@kkdy/data'
import { AgentIconBase, CharStar } from '/@/components/AgentIcon'
import { Title } from '/@/components/Title'
import { LabelText } from '/@/components/LabelText'
import {
  getProfessionIcon,
  getProffessionCn,
} from '/@/components/AgentIcon/utils'

import * as AKDATA from '@kkdy/akdata'

// 从路由拿query
const id = getCurrentInstance().router?.params.id

const goTo = (item: { name: string; url?: string }) => {
  console.log('goto', item)

  if (item.url) {
    // 先用固定个charId 开发着，先接好api，后面角色选择切换选择可以我来做
    Taro.navigateTo({ url: item.url })
  }
}

// 这里需要做兜底操作，暂时这个样子
if (!id) {
  throw new Error('no id')
}

/**
 * ref label 标记的变量，会变成响应式的值
 * 等价于 const data = ref(null)
 * 一般来说，如果需要响应式，例如需要更新在模板(html)，就用ref 标记
 * ref 只能在top level 使用，不能再函数内部用
 */
ref: data = null as null | IChar.IData
ref: dps = {skillName: '', skill: { dps: 0 }, normal: {dps: 0}, globalDps: 0 } as AKDATA.AKObject
ref: skillName = '' as string

Data.GetCharacter({ id }).then((res) => {
  // 接口需要判断 res.data.ok 是否为true，然后访问res.data.result 就是结果值
  if (res.data.ok) {
    data = res.data.result.data

    // AKDATA 使用的是完整的res.data.result
    AKDATA.Data.loadKkdyChar(res.data.result)
    console.log(res.data.result)
    var sk = res.data.result.skills
    var skdata = sk[sk.length-1].data

    var char: AKCharacter = {
      charId: id,
      skillId: skdata.skillId,
      skillLevel: skdata.levels.length-1,
      options: { cond: true, crit: true }
    }

    dps = AKDATA.Attributes.calculateDps(char)
    console.log(dps)
    
  }
})
</script>
