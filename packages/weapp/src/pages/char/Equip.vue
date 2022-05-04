<template>
  <view>
    <view class="flex">
      <Title title-cn="模组" slim-bar :size="30" class="mr-auto" />

      <view v-for="eq in data" :key="eq.equipId" class="relative">
        <Skeleton
          :src="`${baseUrl}/${
            eq.info.type === IUniEquip.IInfoType.Initial
              ? 'default'
              : eq.equipId
          }.png`"
          show
          :size="100"
        />
        <checkbox
          class="absolute bottom-0 right-0 z-12 origin-center"
          style="transform: translate(20%, 20%)"
          :value="eq.equipId"
          :checked="cur === eq.equipId"
          @tap="cur = eq.equipId"
        />
      </view>
    </view>
    <view v-if="selectedEquip">
      <Title
        :title-cn="selectedEquip.info.typeName"
        slim
        :size="24"
        class="mr-auto"
      />
      <view>{{ selectedEquip.info.uniEquipDesc }}</view>
    </view>
    <Waiting />
  </view>
</template>

<script setup lang="ts">
import { IBattleEquip, IUniEquip } from '@kkdy/data'
import { Skeleton } from '/@/components/Skeleton'
import { Title } from '/@/components/Title'
import { computed, ref } from 'vue'
import Waiting from '/@/components/Waiting/Waiting.vue'
const baseUrl = 'https://andata.somedata.top/dataX/char/equip'

const props = defineProps<{
  data: {
    info: IUniEquip.IInfo
    equipId: string
    data: IBattleEquip.IData
  }[]
}>()

const cur = ref('')
const selectedEquip = computed(() => {
  return props.data.find((e) => e.equipId === cur.value)
})
</script>
