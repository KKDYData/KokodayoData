<template>
  <span class="popper-wrapper">
    <slot name="reference" />
    <transition name="fade">
      <div
        v-show="!disabled && visible"
        ref="popper"
        role="popper"
        class="popper el-popover"
        :style="{width: width + 'px'}"
      >
        <h3 v-if="title" class="popper-title">{{ title }}</h3>
        <slot />
        <div class="popper-arrow" data-popper-arrow></div>
      </div>
    </transition>
  </span>
</template>
<script>
import { create } from './createPopper'
import './popover.styl'
import { popper } from '../utils/popup'
import { on } from '../utils/dom'



export default {
  mixins: [popper],
  props: {
    placement: {
      type: String,
      default: 'top'
    },
    modifiers: {
      type: Array,
      default: () => ([])
    },
    showEvents: {
      type: Array,
      default: () => (['click', 'focus'])
    },
    hideEvents: {
      type: Array,
      default: () => ([])
    },
    tabindex: {
      type: Number,
      default: 0
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 300
    },
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popperInstance: null,
      modalAppendToBody: this.appendToBody
    }
  },
  mounted() {
    const { placement, modifiers, showEvents, hideEvents, appendToBody } = this
    const { popper } = this.$refs
    let reference = this.$refs.reference
    reference = this.referenceElm = this.$slots.reference[0].elm
    this.createPopper = () => {
      this.popperInstance = create(reference, popper, {
        placement,
        modifiers,
        showEvents,
        hideEvents
      })()
    }
    showEvents.forEach(e => on(reference, e, () => {
      this.visible = true
    }))
    hideEvents.forEach(e => on(reference, e, () => {
      this.visible = false

    }))
    if (appendToBody) {
      document.body.appendChild(popper)
    }
    // reference.setAttribute('tabindex', this.tabindex)
  }
}
</script>

<style lang="stylus" scoped>
.popper {
  max-width: 100vw

  &-title {
    margin-top: -10px
  }
}
</style>


