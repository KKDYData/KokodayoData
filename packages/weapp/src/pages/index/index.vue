<template>
  <view
    class="index-wrapper main-bg"
    :style="{
      paddingTop:
        status.statusBarHeight > 43 ? status.statusBarHeight + 'px' : 0,
    }"
  >
    <Scan />

    <view>
      <Title title-cn="公告板" title-en="BULLETIN BOARD" italic />
      <swiper
        class="h-200px mt-3 w-full"
        indicator-color="#999"
        indicator-active-color="#333"
        vertical
        circular
        indicator-dots
        autoplay
      >
        <swiper-item v-for="item in banners" :key="item.url">
          <image mode="aspectFit" :src="item.url" class="card" />
        </swiper-item>
      </swiper>
    </view>

    <view>
      <Title title-cn="新增干员" title-en="BULLETIN BOARD" italic />
      <view class="flex mt-3 justify-around">
        <!-- 用 索引 当key，惊醒 skeleton 的替换动画  -->
        <AgentIcon v-for="(char, i) in latestChars" :key="i" :data="char" />
      </view>
    </view>

    <view>
      <Title title-cn="新增地图" title-en="BULLETIN BOARD" italic />
      <view class="h-200px m-3 card">
        <image mode="aspectFit" :src="banners[0].url" />
      </view>
      <Title title-cn="覆潮之下" title-en="Sidesotry" :size="30" class="m-3" />
    </view>

    <view>
      <Title title-cn="更新专栏" title-en="BULLETIN BOARD" italic />
      <view
        class="bg-white border rounded-15px m-2 mt-6 text-xs py-3 px-2"
        style="border-color: #707070"
      >
        <view class="truncate-overflow" style="--max-lines: 4">
          6月2日，华为“鸿蒙操作系统”正式发布，这是一款面向全场景的分布式操作系统，和苹果安卓等手机电脑系统不同，鸿蒙系统可用于物联网各种设备。它既能控制手机，同时也能适配PC、平板、手表等智能终端，突破以往不同属性智能终端设备间普遍存在的“兼容性”难题。
        </view>
      </view>
    </view>

    <view>
      <Title title-cn="全部功能" title-en="BULLETIN BOARD" italic />

      <view class="mx-3 mt-3 grid gap-4 grid-cols-4">
        <view
          v-for="(item, i) in navigationItems"
          :key="i"
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
        >
          {{ item.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro'

import { computed } from 'vue'
import { Scan } from '/@/components/QRCode'
import { Title } from '/@/components/Title'

const banners = [
  { name: '', url: 'https://andata.somedata.top/dataX/assetes/banner2.jpg' },
  { name: '', url: 'https://andata.somedata.top/dataX/assetes/banner1.jpg' },
]

import { AgentIcon } from '/@/components/AgentIcon'
import { useListStore } from '/@/store'

const listStore = useListStore()
listStore.initList()
ref: latestChars = computed(() => listStore.latestChars)

const status = Taro.getSystemInfoSync()

const navigationItems = [
  {
    name: '干员档案',
  },
  {
    name: '材料详情',
  },
  {
    name: '后勤技能',
  },
  {
    name: '关卡数据',
  },
  {
    name: '公招计算',
  },
  {
    name: '时装一览',
  },
  {
    name: '经验计算',
  },
  {
    name: '家具一览',
  },
  {
    name: 'DPS计算',
  },
  {
    name: '卡池一览',
  },
  {
    name: '打钱',
  },
]
</script>

<style lang="styl"></style>
