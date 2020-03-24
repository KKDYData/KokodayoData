<template>
  <div class="popper-wrapper">
    <div ref="target" targe aria-describedby="popover" class="popper-target">
      <slot name="reference" />
    </div>
    <transition name="fade">
      <div
        v-show="visible"
        ref="popper"
        role="popper"
        class="popper el-popover"
        :style="{width: width + 'px'}"
      >
        <h3 v-if="title" class="title">{{ title }}</h3>
        <slot />
        <div class="popper-arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
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
    const { target, popper } = this.$refs
    this.createPopper = create(this.$refs.target, popper, {
      placement,
      modifiers,
      showEvents,
      hideEvents
    })
    showEvents.forEach(e => on(target, e, () => {
      this.visible = true
    }))
    hideEvents.forEach(e => on(target, e, () => {
      this.visible = false

    }))
    if (appendToBody) {
      document.body.appendChild(popper)
    }
    target.setAttribute('tabindex', this.tabindex)
  }
}
</script>

<style lang="stylus" scoped>
.popper {
  max-width: 100vw
}
</style>


