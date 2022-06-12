<template>
  <page-container
    :show="popupState.state?.show"
    :close-on-slide-down="true"
    @afterleave="hidden"
  >
    <view id="item-popup" :style="{ height: store.height }">
      <Component :is="store.comp" v-bind="proxyRefs(store.props)" />
    </view>
  </page-container>
</template>
<script setup lang="ts">
import { watchEffect, proxyRefs } from 'vue'
import { usePopupState } from './index'
import { usePopupStore } from './popupStore'
import './itemPopup.styl'

const popupState = usePopupState()
const store = usePopupStore()

if (!popupState.state) throw new Error('must provide popup state')

const hidden = () => {
  popupState.state!.show = false
}

watchEffect(() => {
  console.log('pup state', popupState.state?.show)
})
</script>
