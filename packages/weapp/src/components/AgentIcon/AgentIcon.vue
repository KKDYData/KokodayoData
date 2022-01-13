<template>
  <view class="agent-icon" @tap="go">
    <CharStar class="text-right mb-1" :rarity="data.rarity" />
    <view class="relative">
      <Skeleton
        :src="profileUrl"
        :show="!data._skeleton"
        :skeleton-url="defaultProfile"
        :size="180"
      />
      <image
        class="profile-bg"
        :src="bgUrl"
        style="height: 180rpx; width: 180rpx"
        mode="heightFix"
      />
    </view>

    <view style="color: #6b6b6b" class="mt-1">
      <view
        class="rounded flex font-bold text-28px items-center justify-between"
      >
        <view
          class="flex border-4rpx rounded-4rpx h-32rpx w-32rpx drop-shadow-base filter inline-block justify-center items-center"
          style="border-color: #707070"
        >
          <KIcon :size="14" :name="professionIcon" class="p-icon" />
        </view>
        <view class="border-b border-gray-500 pb-1px">{{ data.name }}</view>
      </view>
      <view class="mt-1px text-right text-14px whitespace-nowrap">
        {{ data.enName ?? 'Skadi the Corrupting Heart' }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IChar } from '@kkdy/data'
// import Skeleton from './AgentBase.vue'
import Taro from '@tarojs/taro'
import { useProfessionIcon } from './utils'
import { CharStar } from '.'
import { Skeleton } from '../Skeleton'

const props = defineProps<{
  data: {
    profession: IChar.Profession
    rarity: number
    name: string
    enName: string
    charId: string
    _skeleton?: boolean
  }
}>()
//char_1012_skadi2

const professionIcon = ref(useProfessionIcon(props.data.profession))

const go = () => {
  if (!props.data._skeleton)
    Taro.navigateTo({ url: '/pages/char/char?id=' + props.data.charId })
}

const baseUrl = 'https://andata.somedata.top/dataX/char'
const bgUrl = computed(
  () =>
    `${baseUrl}/assets/bg/${
      props.data._skeleton ? 0 : props.data.rarity + 1
    }.png`
)
const profileUrl = computed(() => `${baseUrl}/profile/${props.data.charId}.png`)
const defaultProfile = `${baseUrl}/profile/char_124_kroos.png`
</script>

<style lang="styl">
.agent-icon{
  @apply w-180px inline-block
}

.profile-bg {
  @apply absolute top-0 left-0 z-0;
  background-color: transparent;

  &:before {
    content: ''
    width: 100%
    height: 100%
   box-shadow: 0 4px 4px 4px rgba(0,0,0,.31), inset 0 2px 2px 2px rgba(0,0,0,.1)
    @apply border-10px border-white absolute top-0 left-0
  }
}
</style>
