<template>
  <transition name="el-fade-in">
    <div v-if="visible">
      <button @click="share" :data-clipboard-text="shareLink" class="el-backtop share">
        <el-icon name="share"></el-icon>
      </button>
      <div
        @click.stop="handleClick"
        :style="{
        'right': styleRight,
        'bottom': styleBottom
      }"
        class="el-backtop"
      >
        <el-icon name="caret-top"></el-icon>
      </div>
    </div>
  </transition>
</template>

<script>
import { throttle } from '../../utils';
import { Icon, Message } from 'element-ui';
import Vue from 'vue';
Vue.use(Icon);

import Clipboard from 'clipboard';
import devMode from '../../stats';


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
      default: 40
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
      return 'https://somedata.top' + devMode + this.$route.fullPath;
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
.el-backtop {
  position: fixed
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
}

.share {
  right: 40px
  bottom: 100px
  border: none
  padding: 0
}
</style>
