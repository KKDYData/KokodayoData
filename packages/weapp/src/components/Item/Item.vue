<template>
  <view class="relative inline-block" @touchend="open">
    <Skeleton :src="itemImg" show :size="120" />
    <Tag v-if="count" class="item-count-tag">{{ count }}</Tag>
  </view>
</template>

<script setup lang="ts">
import { IItem } from '@kkdy/data'
import { markRaw, ref } from 'vue'
import { Skeleton } from '../Skeleton'
import { Tag } from '../Tag'
import { usePopupState } from '/@/components/Popup/inject'
import { useItemsStore } from '/@/store/items'
import { useItemImg } from './itemImg'
import ItemDetailVue from './ItemDetail.vue'
import { usePopupStore } from '../Popup/popupStore'

const props = defineProps<{
  id: string
  count?: number
  son?: boolean
}>()

const pushChild = (data: IItem.IData) => {
  itemsStore.itemList.push(data.itemId)
  store.props = {
    data: { ...data },
  }
}

const data = ref<IItem.IData | null>(null)

const itemsStore = useItemsStore()
const popupState = usePopupState()

itemsStore.initItemsStore()
itemsStore.getItem(props.id).then((res) => {
  data.value = res
})

const itemImg = useItemImg(data)

const store = usePopupStore()
const open = () => {
  if (!data.value) return
  if (!props.son) {
    store.comp = markRaw(ItemDetailVue)
    store.props = {
      data,
    }
    popupState.state!.show = true
    itemsStore.itemList = [props.id]
  } else {
    console.log('emit', props.son, data.value)
    pushChild(data.value)
  }
}
</script>

<style lang="styl">
.item-count-tag {
  @apply absolute bottom-0 right-0 z-11;
}
</style>
