import PopperJS from 'popper.js'

/**
 * @param {HTMLElement} [reference=$els.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$els.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -right), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
export default {
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    boundariesPadding: {
      type: Number,
      default: 5
    },
    reference: Object,
    popper: Object,
    offset: {
      default: 0
    },
    visible: Boolean,
    visibleArrow: Boolean,
    transition: String,
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  watch: {
    showPopper(val) {
      console.log('__________val', val)
      if (this.disabled) return
      val ? this.updatePopper() : this.destroyPopper()
      this.$emit('input', val)
    }
  },

  methods: {
    createPopper() {
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
        return
      }

      this.popper = this.popper || this.$refs.popper
      this.reference = this.reference || this.$refs.reference
      console.log(this.popper, this.reference)

      if (!this.popper || !this.reference) {
        return
      }

      if (this.visibleArrow) {
        this.appendArrow(this.popper)
      }

      if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
        this.popperJS.destroy()
      }

      this.$set(this.options, 'placement', this.placement)
      this.$set(this.options, 'offset', this.offset)
      this.options.onCreate = popper => {
        this.resetTransformOrigin(popper)
        this.$emit('created', this)
      }
      console.log(this.options)
      this.popperJS = new PopperJS(
        this.reference,
        this.popper,
        this.options
      )
    },
    updatePopper() {
      if (this.popperJS) {
        this.popperJS.update()
      } else {
        this.createPopper()
      }
    },

    doDestroy() {
      if (!this.popperJS) {
        console.log('???? no had destory')
        return
      }
      this.popperJS.popper.removeEventListener('transitionend', this.doDestroy)
      this.popperJS.destroy()
      this.popperJS = null
    },

    destroyPopper() {
      if (this.popperJS) {
        console.log('destory toggle')
        this.resetTransformOrigin(this.popperJS)
        if (this.transition) {
          this.popperJS.popper.addEventListener('transitionend', this.doDestroy)
        } else {
          this.doDestroy()
        }
      }
    },

    resetTransformOrigin(popper) {
      let placementMap = { left: 'right', right: 'left' }
      console.log(popper)
      let placement = popper.attributes['x-placement']
      let origin = placementMap[placement]
      popper.styles.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? `center ${origin}` : `${origin} center`
    },

    appendArrow(element) {
      let hash
      if (this.appended) {
        return
      }

      this.appended = true

      for (let item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name
          break
        }
      }

      const arrow = document.createElement('div')

      if (hash) {
        arrow.setAttribute(hash, '')
      }
      arrow.setAttribute('x-arrow', '')
      arrow.className = 'popper__arrow'
      element.appendChild(arrow)
    }
  },

  // beforeDestroy() {
  //   if (this.popperJS) {
  //     this.popperJS.destroy()
  //   }
  // }
}
