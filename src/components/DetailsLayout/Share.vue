<template>
  <transition name="el-fade-in">
    <div v-if="visible">
      <button @click="share" :data-clipboard-text="shareLink" class="el-circle-icon share">
        <i class="el-icon-share"></i>
      </button>
      <div
        @click.stop="handleClick"
        :style="{
        'right': styleRight,
        'bottom': styleBottom
      }"
        class="el-circle-icon"
      >
        <i class="el-icon-caret-top"></i>
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
    target: [String],
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
      visible: false
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
      return 'https://somedata.top' + this.$route.fullPath;
    }
  },

  mounted() {
    this.init();
    this.throttledScrollHandler = throttle(300, this.onScroll);
    this.container.addEventListener('scroll', this.onScroll);

    new Clipboard('.share');
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

  beforeDestroy() {
    this.container.removeEventListener('scroll', this.throttledScrollHandler);
  }
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
