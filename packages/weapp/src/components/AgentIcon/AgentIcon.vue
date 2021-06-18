<template>
  <view class="agent-icon" @tap="go">
    <CharStar class="text-right mb-1" :rarity="data.rarity" />
    <AgentIconBase :data="data" />
    <view style="color: #6b6b6b" class="mt-1">
      <view
        class="rounded flex font-bold text-28px items-center justify-between"
      >
        <view
          class="
            flex
            border-2px
            rounded-2px
            h-32px
            w-32px
            drop-shadow-base
            filter
            inline-block
            justify-center
            items-center
          "
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
import { defineProps } from 'vue'
import { IChar } from '@kkdy/data'
import AgentIconBase from './AgentIconBase.vue'
import Taro from '@tarojs/taro'
import { useProfessionIcon } from './utils'
import { CharStar } from '.'

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

ref: professionIcon = useProfessionIcon(props.data.profession)

const go = () => {
  if (!props.data._skeleton)
    Taro.navigateTo({ url: '/pages/char/char?id=' + props.data.charId })
}
</script>

<style lang="styl">
.agent-icon{
  @apply w-180px inline-block
}
</style>
