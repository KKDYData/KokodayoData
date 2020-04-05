<template>
  <span class="popper-wrapper">
    <slot class="ref" name="reference" />
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
        <div v-if="arrow" class="popper-arrow" data-popper-arrow></div>
      </div>
    </transition>
  </span>
</template>
<script>
import { create } from './createPopper'
import './popover.styl'
import { on, setStyle } from '../utils/dom'
import { sleep } from '../../../utils'



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
    showEvents: {
      type: Array,
      default: () => (['click', 'focus'])
    },
    hideEvents: {
      type: Array,
      default: () => (['blur'])
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
      default: false
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
    },
    arrow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      popperInstance: null,
      modalAppendToBody: this.appendToBody,
      visible: false
    }
  },
  mounted() {
    const { placement, modifiers, showEvents, hideEvents, appendToBody } = this
    const { popper } = this.$refs
    let reference = this.$refs.reference
    reference = this.referenceElm = this.$slots.reference[0].elm
    if (this.arrow) {
      const arrow = this.arrow ? popper.querySelector('.popper-arrow') : null
      modifiers.push(
        {
          name: 'arrow',
          options: {
            element: arrow,
          },
        }
      )
    }

    const close = () => {
      this.visible = false
      this.$emit('hide')
      document.body.removeEventListener('click', clickOutSide)
    }

    const clickOutSide = (e) => {
      const isContain = popper.contains(e.target)
      if (!isContain) {
        close()
      }
    }

    const createPopper = () => {
      this.popperInstance = create(reference, popper, {
        placement,
        modifiers,
        showEvents,
        hideEvents,
      })()
    }
    showEvents.forEach(e => on(reference, e, async () => {
      this.$emit('show')
      this.visible = true
      createPopper()
      await sleep(500)
      document.body.addEventListener('click', clickOutSide)
    }))
    hideEvents.forEach(e => on(reference, e, () => {
      close()
    }))

    if (appendToBody) {
      document.body.appendChild(popper)
    }
    // setStyle(reference, 'outline', 'none')
    // reference.setAttribute('tabindex', this.tabindex)
  }
}
</script>

<style lang="stylus" scoped>
.popper {
  max-width: 100vw

  &-wrapper {
    width: 100%
    display: inline-block
  }

  &-title {
    margin-top: -10px
  }
}
</style>


