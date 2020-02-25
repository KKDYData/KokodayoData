<template>
  <transition name="fade">
    <div v-if="visible" class="share-wrapper">
      <div :data-clipboard-text="shareLink" class="el-circle-icon share" @click="share">
        <i class="el-icon-share" />
      </div>
      <div
        :style="{ 'right': styleRight,'bottom': styleBottom}"
        class="el-circle-icon"
        @click.stop="handleClick"
      >
        <i class="el-icon-caret-top" />
      </div>
    </div>
  </transition>
</template>

<script>
import { debounce } from '@/utils'
import { Message } from 'element-ui'

import Clipboard from 'clipboard'


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
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 140
    }
  },

  data() {
    const hide = debounce(() => {
      this.visible = false
    }, 10000)

    return {
      el: null,
      container: null,
      visible: false,
      throttledScrollHandler: null, // throttle(300, this.onScroll)
      orgin: window.location.origin,
      onScroll: debounce(() => {
        const scrollTop = this.el.scrollTop || window.scrollY
        this.visible = scrollTop >= this.visibilityHeight
        if (this.visible) hide()
      }, 500),
    }
  },

  computed: {
    styleBottom() {
      return `${this.bottom}px`
    },
    styleRight() {
      return `${this.right}px`
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
      Message.success('已经复制链接到粘贴板')
    },

    handleClick(e) {
      this.scrollToTop()
      this.$emit('click', e)
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  },

}
</script>

<style lang="stylus" scoped>
.share {
  right: 40px
  bottom: 200px
  border: none
  padding: 0

  &-wrapper {
    z-index: 999
  }
}
</style>
