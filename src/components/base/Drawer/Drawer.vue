<template>
  <transition name="fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div v-show="visible" class="el-drawer__wrapper" tabindex="-1">
      <div
        class="el-drawer__container"
        :class="visible && 'el-drawer__open'"
        role="document"
        tabindex="-1"
        @click.self="handleWrapperClick"
      >
        <div
          ref="drawer"
          aria-modal="true"
          aria-labelledby="el-drawer__title"
          :aria-label="title"
          class="el-drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${size}` : `height: ${size}`"
          role="dialog"
          tabindex="-1"
        >
          <header v-if="title || 1" id="el-drawer__title" class="el-drawer__header">
            <slot name="title">
              <span role="heading" tabindex="0" :title="title">{{ title }}</span>
            </slot>
          </header>
          <button
            v-if="showClose"
            :aria-label="`close ${title || 'drawer'}`"
            class="el-drawer__close-btn"
            type="button"
            @click="closeDrawer"
          >
            <i class="el-dialog__close el-icon el-icon-close" />
          </button>
          <section v-if="rendered" class="el-drawer__body">
            <slot />
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { popper } from '../utils/popup'
import './drawer.styl'


export default {
  mixins: [popper],
  props: {
    appendToBody: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      default: null,
      type: Function
    },
    customClass: {
      type: String,
      default: ''
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      }
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: '30%'
    },
    title: {
      type: String,
      default: ''
    },
    showDrawer: {
      type: Boolean
    },
    wrapperClosable: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      closed: false,
      prevActiveElement: null
    }
  },
  computed: {
    isHorizontal() {
      return this.direction === 'rtl' || this.direction === 'ltr'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
        this.prevActiveElement = document.activeElement

      } else {
        if (!this.closed) this.$emit('close')
        this.$emit('update:showDrawer', false)
        this.$nextTick(() => {
          if (this.prevActiveElement) {
            this.prevActiveElement.focus()
          }
        })
      }
    },
    showDrawer(val) {
      this.visible = val
    }
  },
  created() {
    this.closeOnClickModal = this.wrapperClosable
  },
  mounted() {
    if (this.visible) {
      this.rendered = true
      this.open()
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    },
    hide(cancel) {
      if (cancel !== false) {
        this.visible = false
        this.$emit('close')
        if (this.destroyOnClose === true) {
          this.rendered = false
        }
        this.closed = true
      }
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer()
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }

      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200)
      }
    },
    handleClose() {
      // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
      // pressing `ESC` will call this method, and also close the drawer.
      // This method also calls `beforeClose` if there was one.
      this.closeDrawer()
    },
  }
}
</script>

<style lang="stylus" scoped></style>
