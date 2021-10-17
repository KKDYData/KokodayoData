<template>
  <view class="h-180px w-180px relative">
    <!-- <button class="z-30 relative" @tap="on = !on">tap</button> -->
    <Transition name="no-mode-fade">
      <image
        v-if="show"
        :style="{ transitionDuration: '1s' }"
        class="profile"
        :src="profileUrl"
      />
      <image
        v-else
        class="profile skeleton"
        :style="{ transitionDuration: '0.2s' }"
        :src="defaultProfile"
      />
    </Transition>
    <image class="profile-bg" :src="bgUrl" />
  </view>
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  data: {
    rarity: number
    charId: string
    _skeleton?: boolean
  }
}>()

const baseUrl = 'https://andata.somedata.top/dataX/char'
const profileUrl = computed(() => `${baseUrl}/profile/${props.data.charId}.png`)
const defaultProfile = `${baseUrl}/profile/char_124_kroos.png`
const bgUrl = computed(
  () =>
    `${baseUrl}/assets/bg/${
      props.data._skeleton ? 0 : props.data.rarity + 1
    }.png`
)

const show = computed(() => !props.data._skeleton)
</script>

<style lang="styl">
.profile {
  background-color: transparent;
  @apply z-10 relative;


  .skeleton {

  }
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

button {
  @apply animate-duration-3s
}
</style>
