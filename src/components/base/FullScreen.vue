<template>
  <div style="position: relative;">
    <transition name="fade">
      <div v-if="visible" ref="wrapper" class="full-screen-wrapper" :style="{zIndex: wZIndex}">
        <slot />
        <span class="el-image-viewer__btn el-image-viewer__close" @click="ccc">
          <i class="el-icon-circle-close" />
        </span>
      </div>
    </transition>
    <slot name="reference" />
  </div>
</template>
<script>
import '@/components/base/RImage/image.css'
import { popper } from './utils/popup'
import { PopupManager } from './utils/popup/popup-manager'
import { setStyle } from './utils/dom'

export default {
  mixins: [popper],
  props: {
    lockScroll: {
      default: true,
      type: Boolean
    },
    modal: {
      default: false,
      type: Boolean
    },
    noDomZIndex: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      visible: false,
      wZIndex: 3000
    }
  },
  mounted() {
    const reference = this.referenceElm = this.$slots.reference[0].elm
    reference.addEventListener('click', async () => {
      if (this.visible) return
      this.$emit('show')
      this.visible = true
      this.wZIndex = PopupManager.nextZIndex()
      await this.$nextTick()
      document.body.appendChild(this.$refs.wrapper)
    })
    setStyle(reference, 'cursor', 'pointer')

  },
  beforeDestroy() {
    if (this.$refs.wrapper && this.$refs.wrapper.parentNode) {
      this.$refs.wrapper.parentNode.removeChild(this.$refs.wrapper)
    }
  },
  methods: {
    ccc() {
      this.visible = false
    }
  }
}
</script>
<style lang="stylus" scoped>
.full-screen-wrapper {
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  z-index: 3000
}

.el-image-viewer__btn {
  mix-blend-mode: difference
}

@media screen and (max-width: 700px) {
  .el-image-viewer__btn {
    z-index: 999
  }
}
</style>
