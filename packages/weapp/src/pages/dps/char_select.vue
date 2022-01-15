<template>
  <view class="index-wrapper main-bg">
    <Scan />
    <view>
      <Title
        class="mb-6"
        slim
        :size="30"
        title-cn="干员选择"
        title-en="Select Operator"
      />
    </view>
    <view v-for="k in profKeys">
      <Title slim-bar :title-cn="AKDATA.professionNames[k]" />
      <LabelText
        v-for="item in charGroup[k]"
        :label="item.name"
        @tap="goTo({ url: '/pages/dps/dps?id=' + item.charId })"
        width="160rpx"
      />
    </view>
    <view
      class="
        flex
        font-bold
        h-80px
        text-dark-50 text-32px
        w-140px
        card
        items-center
        justify-center
      "
      style="
        background-color: rgba(179, 179, 179, 1);
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.16);
      "
      @tap="goTo({ url: '/pages/dps/dps?id=char_290_vigna' })"
    >
      返回
    </view>
    {{ charGroup }}
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { Scan } from '/@/components/QRCode'
import { getCurrentInstance } from '@tarojs/taro'
import { Data } from '@kkdy/api-taro'
import { IChar } from '@kkdy/data'
import { AgentIcon, CharStar } from '/@/components/AgentIcon'
import { Title } from '/@/components/Title'
import { LabelText } from '/@/components/LabelText'
import {
  getProfessionIcon,
  getProffessionCn,
} from '/@/components/AgentIcon/utils'

import * as AKDATA from '@kkdy/akdata'

// 从路由拿query
//const id = getCurrentInstance().router?.params.id

const goTo = (item: { name: string; url?: string }) => {
  console.log('goto', item)

  if (item.url) {
    // 先用固定个charId 开发着，先接好api，后面角色选择切换选择可以我来做
    Taro.navigateTo({ url: item.url })
  }
}

const profKeys = Object.keys(AKDATA.professionNames)
var charList = null as any
/**
 * ref label 标记的变量，会变成响应式的值
 * 等价于 const data = ref(null)
 * 一般来说，如果需要响应式，例如需要更新在模板(html)，就用ref 标记
 * ref 只能在top level 使用，不能再函数内部用
 */
var charGroup = {} as any
var id = ref('')

// useful keys are: 'name', 'charId', 'rarity', 'profession', 'enName'
Data.GetCharacterList().then((x) => {
  charList = x.data.result
  charList.forEach((item) => {
    if (!charGroup[item.profession]) charGroup[item.profession] = []
    if (item.rarity > 1) charGroup[item.profession].push(item)
  })
})
</script>
