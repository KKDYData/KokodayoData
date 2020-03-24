import { merge } from 'ramda'
import getScrollBarWidth from '../scrollbar-width'
import { PopupManager } from './popup-manager'
import { getStyle, addClass, removeClass, hasClass } from '../dom'
import './popup.styl'

let idSeed = 1

let scrollBarWidth

const popper = {
  props: {
    openDelay: {},
    closeDelay: {},
    zIndex: {},
    modal: {
      type: Boolean,
      default: true
    },
    modalFade: {
      type: Boolean,
      default: true
    },
    modalClass: {},
    lockScroll: {
      type: Boolean,
      default: false
    }
  },

  beforeMount() {
    this._popupId = 'popup-' + idSeed++
    PopupManager.register(this._popupId, this)
  },

  beforeDestroy() {
    PopupManager.deregister(this._popupId)
    PopupManager.closeModal(this._popupId)
    this.doDestroy()

    this.restoreBodyStyle()
  },

  data() {
    return {
      opened: false,
      bodyPaddingRight: null,
      computedBodyPaddingRight: 0,
      withoutHiddenClass: true,
      visible: false,
      rendered: false
    }
  },

  watch: {
    visible(val) {
      if (val) {

        if (this._opening) return
        if (!this.rendered) {
          this.rendered = true
          this.$nextTick(() => {
            this.open()
          })
        } else {
          this.open()
        }
      } else {
        this.close()
      }
    }
  },

  methods: {
    open(options) {
      this.$emit('show')

      if (!this.rendered) {
        this.rendered = true
      }
      const props = merge(this.$props || this, options)

      if (this._closeTimer) {
        clearTimeout(this._closeTimer)
        this._closeTimer = null
      }
      clearTimeout(this._openTimer)

      const openDelay = Number(props.openDelay)
      if (openDelay > 0) {
        this._openTimer = setTimeout(() => {
          this._openTimer = null
          this.doOpen(props)
        }, openDelay)
      } else {
        this.doOpen(props)
      }
    },

    doOpen(props) {
      // if (this.willOpen && !this.willOpen()) return
      if (this.opened) return

      this._opening = true

      const dom = this.$el

      const modal = props.modal

      const zIndex = props.zIndex
      if (zIndex) {
        PopupManager.zIndex = zIndex
      }

      if (modal) {
        if (this._closing) {
          PopupManager.closeModal(this._popupId)
          this._closing = false
        }
        PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), this.modalAppendToBody ? undefined : dom, props.modalClass, props.modalFade)
        if (props.lockScroll) {
          this.withoutHiddenClass = !hasClass(document.body, 'el-popup-parent--hidden')
          if (this.withoutHiddenClass) {
            this.bodyPaddingRight = document.body.style.paddingRight
            this.computedBodyPaddingRight = parseInt(getStyle(document.body, 'paddingRight'), 10)
          }
          scrollBarWidth = getScrollBarWidth()
          let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
          let bodyOverflowY = getStyle(document.body, 'overflowY')
          if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && this.withoutHiddenClass) {
            document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
          }
          addClass(document.body, 'el-popup-parent--hidden')
        }
      }

      if (getComputedStyle(dom).position === 'static') {
        dom.style.position = 'absolute'
      }

      dom.style.zIndex = PopupManager.nextZIndex()
      if (this.createPopper) this.createPopper()

      this.opened = true

      this.onOpen && this.onOpen()

      this.doAfterOpen()
    },

    doAfterOpen() {
      this._opening = false
    },

    close() {
      this.$emit('hide')

      if (this.visible)
        this.visible = false
      if (!this.opened) return
      if (this._openTimer !== null) {
        clearTimeout(this._openTimer)
        this._openTimer = null
      }
      clearTimeout(this._closeTimer)

      const closeDelay = Number(this.closeDelay)

      if (closeDelay > 0) {
        this._closeTimer = setTimeout(() => {
          this._closeTimer = null
          this.doClose()
        }, closeDelay)
      } else {
        this.doClose()
      }
    },

    doClose() {
      this._closing = true

      this.onClose && this.onClose()

      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200)
      }

      this.opened = false
      this.visible = false

      this.doAfterClose()
    },

    doAfterClose() {
      PopupManager.closeModal(this._popupId)
      this._closing = false
    },

    restoreBodyStyle() {
      if (this.modal && this.withoutHiddenClass) {
        document.body.style.paddingRight = this.bodyPaddingRight
        removeClass(document.body, 'el-popup-parent--hidden')
      }
      this.withoutHiddenClass = true
    },
    doDestroy() {
      if (this.popperInstance) {
        this.popperInstance.destroy()
        this.popperInstance = null
      }
    }
  }
}

export {
  popper
}
