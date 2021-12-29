<template>
  <view>
    <Title slim-bar title-cn="属性" slim :size="30" />
    <view class="mt-20px ml-10px grid gap-y-10px grid-cols-2">
      <template v-for="(v, i) in status" :key="i">
        <LabelText v-if="i !== 'attackSpeed'" :label="i" width="200rpx">
          <template #value>
            <text class="font-bold text-dark-50">
              {{ v }}
              <text v-if="extraStatus[i]" class="text-hex-cc5900">
                [{{ Math.round(+extraStatus[i]) }}]
              </text>
            </text>
          </template>
        </LabelText>
      </template>
    </view>
    <view class="grid grid-cols-2 mt-2 gap-x-5">
      <NumberSelector v-model="phase" label="精英阶段" :range="phaseRange" />
      <NumberSelector
        v-model="rank"
        label="潜能等级"
        :range="rankRange"
        :range-fn="
          (v) => ({
            value: v + rankRange.min,
            label: String(v + rankRange.min + 1),
            index: v,
          })
        "
      />
      <NumberSelector v-model="lv" label="等级" :range="lvRange" />
      <NumberSelector v-model="favorLv" label="信赖" :range="favorRange" />
    </view>
  </view>
  <view>
    <Title slim-bar title-cn="攻击范围" slim :size="30" />
    <view class="flex justify-center"> <RangeItem :range-id="rangeId" /> </view>
  </view>
  <view>
    <Title slim-bar title-cn="天赋" slim :size="30" />
    <Talent
      v-for="(t, i) in data.talents"
      :key="i"
      :data="t"
      :level="lv"
      :phase="phase"
      :rank="rank"
    />
  </view>
  <view>
    <Suspense>
      <Skill
        v-for="(s, i) in skills"
        :key="i"
        :data="s"
        :level="lv"
        :phase="phase"
        :rank="rank"
      />
    </Suspense>
  </view>
</template>
<script setup lang="ts">
import { IChar, ISkill } from '@kkdy/data'
import { Title } from '/@/components/Title'

import { LabelText } from '/@/components/LabelText'
import { useStatus } from 'core'
import { NumberSelector } from '/@/components/NumberSelector'
import { computed } from 'vue'
import { RangeItem } from '/@/components/RangeItem'
import Talent from './talent.vue'
import Skill from './skill.vue'
import { BaseEntityType } from '@kkdy/api-taro'

const props = defineProps<{
  data: IChar.IData
  skills: BaseEntityType<ISkill.ISkill>[]
}>()

const {
  favorLv,
  favorRange,
  lv,
  lvRange,
  phase,
  phaseRange,
  rank,
  rankRange,
  status,
  extraStatus,
} = useStatus(props.data)

const rangeId = computed(() => props.data.phases[phase.value].rangeId)

favorLv.value = 200
</script>
