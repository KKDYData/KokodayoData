<template>
  <view class="relative inline-block" @touchend="open">
    <Skeleton :src="itemImg" show :size="120" />
    <Tag v-if="count" class="item-count-tag">{{ count }}</Tag>
    <Teleport
      v-if="itemState.state?.id === innerId && !son"
      :to="'#item-popup'"
    >
      <view v-if="chlidrenList.length" @touchend="back"> back </view>
      <ItemDetailVue v-if="curData" :key="curData.itemId" :data="curData" />
    </Teleport>
  </view>
</template>

<script setup lang="ts">
import { IItem } from '@kkdy/data'
import { computed, ref } from 'vue'
import { Skeleton } from '../Skeleton'
import { Tag } from '../Tag'
import { usePopupState } from '/@/components/Popup/inject'
import { useItemsStore } from '/@/store/items'
import { useItemImg } from './itemImg'
import ItemDetailVue from './ItemDetail.vue'
import { provideRootItemState, useRootItemState } from './rootItem'
import { genPopupId } from '/@/components/Popup/genPopupId'

const props = defineProps<{
  id: string
  count?: number
  son?: boolean
}>()

const innerId = genPopupId()

const pushChild = (data: IItem.IData) => {
  chlidrenList.value.push(data)
}
if (!props.son) provideRootItemState(pushChild)
const rootItemState = useRootItemState()

const chlidrenList = ref<IItem.IData[]>([])

const data = ref<IItem.IData | null>(null)
const curData = computed(() => {
  if (chlidrenList.value.length)
    return chlidrenList.value[chlidrenList.value.length - 1]
  else return data.value
})

const itemsStore = useItemsStore()
const itemState = usePopupState()

itemsStore.initItemsStore()
itemsStore.getItem(props.id).then((res) => {
  data.value = res
})

const itemImg = useItemImg(data)

const open = () => {
  if (!data.value) return
  if (!props.son) {
    itemState.setPopupId(innerId)
    chlidrenList.value = []
  } else if (rootItemState) {
    rootItemState.emit(data.value)
  }
}

const back = () => {
  chlidrenList.value.pop()
}
</script>

<style lang="styl">
.item-count-tag {
  @apply absolute bottom-0 right-0 z-11;
}
</style>
