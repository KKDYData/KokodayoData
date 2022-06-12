<template>
  <view>
    <Title slim-bar title-cn="属性" slim :size="30" />
    <view class="mt-20rpx ml-10rpx grid gap-y-10rpx grid-cols-2">
      <template v-for="v in statusList" :key="v.key">
        <LabelText :label="t(`status.${v.key}`)" width="200rpx">
          <template #value>
            <text class="font-bold text-dark-50">
              {{ format(v.value) }}
              <text v-if="extraStatus[v.key]" class="text-hex-cc5900">
                [{{ Math.round(+extraStatus[v.key]) }}]
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
            label: String(v + rankRange.min + 2),
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
    <view class="flex justify-center">
      <RangeItem :range-id="rangeId" />
    </view>
  </view>
  <view>
    <Title slim-bar title-cn="天赋" slim :size="30" />
    <Talent
      v-for="(t, i) in data.talents"
      :key="i"
      v-model:rank="rank"
      :data="t"
      :level="lv"
      :phase="phase"
    />
  </view>
  <Equip v-if="equips.length" :data="equips" />
  <view>
    <Title slim-bar title-cn="技能" slim :size="30" />
    <view class="flex justify-between items-center">
      <view>
        <RadioButtonGroup
          v-model="showType"
          :options="[
            { label: '技能数据', value: 'data' },
            { value: 'cost', label: '升级消耗' },
          ]"
        />
      </view>
      <NumberSelector
        v-model="skillLv"
        class="w-230rpx ml-auto"
        :range="skillRange"
        label="等级"
        :label-width="90"
        controls
        :range-fn="
          (v) => ({
            value: v + skillRange.min,
            label: String(v + skillRange.min + 1),
            index: v,
          })
        "
      />
    </view>
    <Skill
      v-for="(s, i) in skillList"
      :key="i"
      :data="s"
      :level="skillLv"
      :phase="phase"
      :rank="rank"
      :skill-cost="skillCost[i]"
      :show-type="showType"
    />
  </view>
  <view v-if="data">
    <Title slim-bar title-cn="精英化材料" slim :size="30" />
    <view>
      <view
        v-for="(p, i) in data.phases.slice(1)"
        :key="p.maxLevel"
        class="my-30rpx pl-20rpx"
      >
        <Title slim-bar :title-cn="'精英化材料 ' + i" slim :size="24" />
        <view class="flex">
          <Item
            id="4001"
            :count="evolveGoldCost[data.rarity][i]"
            class="mr-50rpx"
          />
          <Item
            v-for="item in p.evolveCost"
            :id="item.id"
            :key="item.id"
            :count="item.count"
          />
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { IBattleEquip, IChar, ISkill, IUniEquip } from '@kkdy/data'
import { Title } from '/@/components/Title'

import { LabelText } from '/@/components/LabelText'
import { useSkill, useStatus, buildStatusArray, statusToCnChar } from 'core'
import { NumberSelector } from '/@/components/NumberSelector'
import { computed, ref } from 'vue'
import { RangeItem } from '/@/components/RangeItem'
import Talent from './talent.vue'
import Skill from './skill.vue'
import Equip from './Equip.vue'
import { Item } from '/@/components/Item'
import { reactify } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { RadioButtonGroup } from '/@/components/RadioButtonGroup'

const props = defineProps<{
  data: IChar.IData
  skills: { data: ISkill.ISkill; comments: string[] }[]
  equips: {
    info: IUniEquip.IInfo
    equipId: string
    data: IBattleEquip.IData
  }[]
}>()
const { t } = useI18n()
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
  skillCost,
  skillLv,
  skillRange,
} = useStatus(props.data)
const skillList = useSkill(skillLv, props.skills)

const rangeId = computed(() => props.data.phases[phase.value].rangeId)
favorLv.value = 200

const buildStatus = buildStatusArray(statusToCnChar)

const statusList = reactify(buildStatus)(status)

const showType = ref<'data' | 'cost'>('data')

console.log('list', skillCost.value)

const evolveGoldCost = [
  [-1, -1],
  [-1, -1],
  [10000, -1],
  [15000, 60000],
  [20000, 120000],
  [30000, 180000],
]

const format = (v: any) => {
  if (typeof v === 'number') return Math.round(v)
  else return v
}
</script>
