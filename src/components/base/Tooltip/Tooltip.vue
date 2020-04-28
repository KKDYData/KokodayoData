<template>
  <span class="popper-wrapper">
    <slot />
    <transition name="fade">
      <div
        v-show="visible && !disabled"
        ref="popper"
        role="tooltip"
        :class="tooltipClass"
        class="popper tooltip"
        :style="width ? {width: width + 'px'} : ''"
      >
        <slot name="content" />
        {{ content }}
        <div v-if="showArrow && !disabled" class="popper-arrow" data-popper-arrow></div>
      </div>
    </transition>
  </span>
</template>
<script>
import { create } from '../Popover/createPopper'
import './tooltip.styl'
import { on } from '../utils/dom'
import { sleep } from '../../../utils'
import { clickOutSideRow } from '../../../utils/dom'

export default {
  props: {
    placement: {
      type: String,
      default: 'top'
    },
    modifiers: {
      type: Array,
      default: () => ([])
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    showEvents: {
      type: Array,
      default: () => (['click', 'focus', 'mouseenter'])
    },
    hideEvents: {
      type: Array,
      default: () => (['mouseleave', 'blur'])
    },
    tabindex: {
      type: Number,
      default: 0
    },
    modal: {
      type: Boolean,
      default: false
    },
    effect: {
      type: String,
      default: 'dark',
      validator: e => ['dark', 'white'].indexOf(e) > -1
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: ''
    },
    showImmediately: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      instance: null,
      modalAppendToBody: this.appendToBody,
      visible: false
    }
  },
  computed: {
    tooltipClass() {
      const res = []
      if (this.effect) res.push(this.effect)
      return res
    }
  },
  mounted() {
    const { placement, modifiers, showEvents, hideEvents, appendToBody } = this
    const { popper } = this.$refs
    let target = this.$slots.default[0].elm

    const createPopper = async () => {
      const instance = create(target, popper, {
        placement,
        modifiers,
      })()
      await this.$nextTick()
      await instance.update()
      await sleep(500)
      document.body.addEventListener('click', ccc)
      return instance
    }

    const close = () => {
      this.visible = false
      this.$emit('hide')
      document.body.removeEventListener('click', ccc)
    }

    const ccc = clickOutSideRow(popper, close)

    showEvents.forEach(e => on(target, e, async () => {
      this.$emit('show')
      this.visible = true
      createPopper()
    }))

    hideEvents.forEach(e => on(target, e, () => {
      this.$emit('hide')
      close()
    }))
    if (appendToBody) {
      document.body.appendChild(popper)
    }

    if (this.showImmediately) {
      this.$emit('show')
      this.visible = true
      createPopper()
    }
  }
}
</script>

<style lang="stylus" scoped>
.popper-wrapper {
  display: inline-block
  cursor: pointer
}
</style>


