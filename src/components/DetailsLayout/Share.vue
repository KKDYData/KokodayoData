<template>
  <transition name="el-fade-in">
    <div v-show="visible">
      <button :data-clipboard-text="shareLink" class="el-circle-icon share" @click="share">
        <i class="el-icon-share" />
      </button>
      <div
        :style="{
        'right': styleRight,
        'bottom': styleBottom
      }"
        class="el-circle-icon"
        @click.stop="handleClick"
      >
        <i class="el-icon-caret-top" />
      </div>
    </div>
  </transition>
</template>

<script>
import { throttle } from '../../utils';
import { Message } from 'element-ui';

import Clipboard from 'clipboard';


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
    return {
      el: null,
      container: null,
      visible: false,
      throttledScrollHandler: null, // throttle(300, this.onScroll)
      orgin: window.location.origin
    };
  },

  computed: {
    styleBottom() {
      return `${this.bottom}px`;
    },
    styleRight() {
      return `${this.right}px`;
    },
    shareLink() {
      return this.orgin + this.$route.fullPath;
    }
  },

  mounted() {
    this.init();
    this.throttledScrollHandler = throttle(this.onScroll, 100);
    this.container.addEventListener('scroll', this.throttledScrollHandler);

    new Clipboard('.share');
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.throttledScrollHandler);
  },
  methods: {
    init() {
      this.container = document;
      this.el = document.documentElement;
      if (this.target) {
        this.el = document.querySelector(this.target);
        if (!this.el) {
          throw new Error(`target is not existed: ${this.target}`);
        }
        this.container = this.el;
      }

    },
    share() {
      Message.success('已经复制链接到粘贴板');
    },
    onScroll() {
      const scrollTop = this.el.scrollTop;
      this.visible = scrollTop >= this.visibilityHeight;
      this.visible && setTimeout(() => {
        this.visible = false;
      }, 3000);
    },
    handleClick(e) {
      this.scrollToTop();
      this.$emit('click', e);
    },
    scrollToTop() {
      let el = this.el;
      let step = 0;
      let interval = setInterval(() => {
        if (el.scrollTop <= 0) {
          clearInterval(interval);
          return;
        }
        step += 10;
        el.scrollTop -= step;
      }, 20);
    }
  },

};
</script>

<style lang="stylus" scoped>
.share {
  right: 40px
  bottom: 200px
  border: none
  padding: 0
  z-index: 100
}
</style>
