<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="share-wrapper"
      :style="shareStyle"
      @touchstart="handlerTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div :data-clipboard-text="shareLink" class="el-circle-icon" @click="share">
        <i class="el-icon-share" />
      </div>
      <div class="el-circle-icon" @click.stop="handleClick">
        <i class="el-icon-caret-top" />
      </div>
    </div>
  </transition>
</template>

<script>
import { debounce } from '@/utils'
import { Message } from 'element-ui'

import Clipboard from 'clipboard'

const { innerWidth, innerHeight } = window
const lastPosition = {
  left: innerWidth * 0.85,
  top: innerHeight * 0.8
}

const lastTouche = {
  x: undefined,
  y: undefined
}

export default {
  props: {
    visibilityHeight: {
      type: Number,
      default: 200
    },
    target: {
      type: [String],
      default: null
    },
    // right: {
    //   type: Number,
    //   default: 40
    // },
    // bottom: {
    //   type: Number,
    //   default: 140
    // }
  },

  data() {
    const hide = debounce(() => {
      this.visible = false
    }, 10000)

    const { left, top } = lastPosition

    return {
      el: null,
      container: null,
      visible: true,
      throttledScrollHandler: null, // throttle(300, this.onScroll)
      orgin: window.location.origin,
      onScroll: debounce(() => {
        const scrollTop = this.el.scrollTop || window.scrollY
        this.visible = scrollTop >= this.visibilityHeight
        if (this.visible) hide()
      }, 500),
      clickAble: true,
      left,
      top
    }
  },

  computed: {
    shareStyle() {
      return {
        top: `${this.top}px`,
        left: `${this.left}px`,
      }
    },
    shareLink() {
      return this.orgin + this.$route.fullPath
    }
  },

  mounted() {
    console.log('load share')
    this.init()
    this.throttledScrollHandler = debounce(this.onScroll, 100)
    this.container.addEventListener('scroll', this.throttledScrollHandler)

    new Clipboard('.share')
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.throttledScrollHandler)
  },
  methods: {
    init() {
      this.container = document
      this.el = document.documentElement
      if (this.target) {
        this.el = document.querySelector(this.target)
        if (!this.el) {
          throw new Error(`target is not existed: ${this.target}`)
        }
        this.container = this.el
      }

    },
    share() {
      if (this.clickAble) Message.success('已经复制链接到粘贴板')
    },

    handleClick(e) {
      this.scrollToTop()
      this.$emit('click', e)
    },
    scrollToTop() {
      console.log('click')
      if (this.clickAble)
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
    },
    handlerTouchStart(e) {
      const { clientX, clientY } = e.touches[0]
      lastTouche.x = clientX
      lastTouche.y = clientY
    },
    handleTouchMove(e) {
      this.clickAble = false
      e.preventDefault()
      const { clientX, clientY } = e.touches[0]
      this.left = lastPosition.left - (lastTouche.x - clientX)
      this.top = lastPosition.top - (lastTouche.y - clientY)

      lastTouche.x = clientX
      lastTouche.y = clientY
      lastPosition.left = this.left
      lastPosition.top = this.top
    },
    handleTouchEnd() {
      this.clickAble = true
    }
  },

}
</script>

<style lang="stylus" scoped>
.share-wrapper {
  right: 40px
  bottom: 200px
  border: none
  padding: 0
  z-index: 999
  position: fixed
}

.el-circle-icon {
  background-color: #fff
  width: 40px
  height: 40px
  border-radius: 50%
  color: #313131
  display: flex
  align-items: center
  justify-content: center
  font-size: 20px
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12)
  cursor: pointer
  z-index: 5

  & + & {
    margin-top: 10px
  }
}
</style>
