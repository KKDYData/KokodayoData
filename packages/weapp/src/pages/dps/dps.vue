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
        <AgentBase :data="{ charId: id, rarity: data.rarity }" />
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
      <Title slim-bar title-cn="属性" />
    </view>
    <view>{{ new_op }}</view>
  </view>
</template>
<script setup lang="ts">
import { Scan } from '/@/components/QRCode'
import { getCurrentInstance } from '@tarojs/taro'
import { Data } from '@kkdy/api-taro'
import { IChar } from '@kkdy/data'
import { AgentBase, CharStar } from '/@/components/AgentIcon'
import { Title } from '/@/components/Title'
import {
  getProfessionIcon,
  getProffessionCn,
} from '/@/components/AgentIcon/utils'

import { new_op } from '@kkdy/akdata'
import { ref } from 'vue'

// 从路由拿query
const id = getCurrentInstance().router?.params.id

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
const data = ref<null | IChar.IData>(null)

Data.GetCharacter({ id }).then((res) => {
  // 接口需要判断 res.data.ok 是否为true，然后访问res.data.result 就是结果值
  if (res.data.ok) {
    data.value = res.data.result.data
  }
})
</script>
