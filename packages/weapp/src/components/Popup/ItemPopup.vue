<template>
  <page-container
    :show="popupState.state?.show"
    :close-on-slide-down="true"
    @afterleave="hidden"
  >
    <view id="item-popup" />
  </page-container>
</template>
<script setup lang="ts">
import { watchEffect } from 'vue'
import { usePopupState } from '.'
import './itemPopup.styl'

const popupState = usePopupState()

if (!popupState.state) throw new Error('must provide popup state')

const hidden = () => {
  popupState.state!.show = false
}

watchEffect(() => {
  console.log('pup state', popupState.state?.show)
})
</script>
