<template>
  <view class="agent-icon">
    <view class="text-right mb-1 text-0px">
      <KIcon
        v-for="(v, i) in Array.from({ length: data.rarity })"
        :key="i"
        :size="12"
        name="iconxingshu1-01"
        color="rgba(128, 128, 128, 1)"
      />
    </view>
    <AgentIconBase :data="data" />
    <view style="color: #6b6b6b" class="mt-1">
      <view
        class="
          flex
          font-bold
          rounded-5px
          text-28px
          items-center
          justify-between
        "
      >
        <view
          class="border-2px rounded-2px h-32px w-32px inline-block"
          style="
            border-color: #707070;
            filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3));
          "
        >
          <KIcon :size="14" :name="professionIcon" class="p-icon" />
        </view>
        <view class="border-b border-gray-500 pb-1px">
          {{ data.name }}
        </view>
      </view>
      <view class="mt-1px text-right text-14px whitespace-nowrap">{{
        data.nameEn ?? 'Skadi the Corrupting Heart'
      }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, defineProps } from '@vue/runtime-core'
import { IChar } from '@kkdy/data'
import AgentIconBase from './AgentIconBase.vue'

const props =
  defineProps<{
    data: {
      profession: string
      rarity: number
      name: string
      nameEn: string
      charId: string
    }
  }>()
//char_1012_skadi2

ref: professionIcon = computed(() => {
  return professionMap[props.data.profession]
})

const professionMap = {
  [IChar.Profession.Caster]: 'icon1ss-01',
  [IChar.Profession.Tank]: 'icon1zz-01',
  [IChar.Profession.Medic]: 'icon1yl-01',
  [IChar.Profession.Pioneer]: 'icon1xf-01',
  [IChar.Profession.Special]: 'icon1tz-01',
  [IChar.Profession.Warrior]: 'icon1jw-01',
  [IChar.Profession.Sniper]: 'icon1jj-01',
  [IChar.Profession.Support]: 'icon1fz-01',
}
</script>

<style lang="styl">
.agent-icon{
  @apply w-180px inline-block
}
</style>
