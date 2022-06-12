<template>
  <view
    class="index-wrapper main-bg"
    :style="{
      paddingTop:
        status.statusBarHeight! > 43 ? status.statusBarHeight + 'px' : 0,
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
      <view>
        <scroll-view
          class="h-300px scroll-view_H"
          scroll-x="true"
          bindscroll="scroll"
          style="width: 100%"
        >
          <AgentIcon
            v-for="(char, i) in latestChars"
            :id="'a' + i"
            :key="i"
            class="mr-40px"
            :data="char"
          />
        </scroll-view>
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
        <UpdateMessage />
      </view>
    </view>

    <view>
      <Title title-cn="全部功能" title-en="BULLETIN BOARD" italic />

      <view class="mx-3 mt-3 grid gap-4 grid-cols-4">
        <view
          v-for="(item, i) in NavigationItems"
          :key="i"
          class="nav-label"
          @tap="goTo(item)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>
    <ItemPopup />
  </view>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro'

import { computed } from 'vue'
import { Scan } from '/@/components/QRCode'
import { Title } from '/@/components/Title'
import { AgentIcon } from '/@/components/AgentIcon'
import { useListStore } from '/@/store'
import { NavigationItems } from './constants'
import UpdateMessage from './UpdateMessage.vue'
import { ItemPopup, providePopupState } from '/@/components/Popup'

providePopupState()

const banners = [
  { name: '', url: 'https://andata.somedata.top/dataX/assetes/banner2.jpg' },
  { name: '', url: 'https://andata.somedata.top/dataX/assetes/banner1.jpg' },
]

const listStore = useListStore()
listStore.initList()
const latestChars = computed(() => listStore.latestChars)

const status = Taro.getSystemInfoSync()

const goTo = (item: { name: string; url?: string }) => {
  console.log('goto', item)

  if (item.url) {
    // 先用固定个charId 开发着，先接好api，后面角色选择切换选择可以我来做
    Taro.navigateTo({ url: item.url + '?id=' + 'char_263_skadi' })
  }
}
</script>

<style lang="styl">

.scroll-view_H{
  white-space: nowrap;
}

.nav-label {
  @apply bg-gray-400 overflow-hidden flex font-bold h-80px text-dark-50 text-32px w-140px card items-center justify-center
  @apply rounded shadow-lg
}
</style>
