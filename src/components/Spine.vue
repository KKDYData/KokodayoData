<template>
  <div class="spin-panel">
    <div class="control-button-wrapper" :style="{width}">
      <div class="control-button">
        <el-button type="primary" size="mini" @click="changeAnimate(false)" class="el-icon-back"></el-button>
        <span
          style="display: inline-block;text-align: center; font-size: 13px"
        >{{animates[curAnimate]}}</span>
        <el-button type="primary" size="mini" @click="changeAnimate(true)" class="el-icon-right"></el-button>
      </div>
      <el-button @click="swtichId" circle type="primary" size="mini" class="el-icon-refresh"></el-button>
    </div>
    <canvas style="z-index:1" :style="{width: width, height}" ref="container"></canvas>
  </div>
</template>

<script>

import { Button } from 'element-ui';
import Spine from '../utils/Spine/initSpine';

import Vue from 'vue';
Vue.use(Button);

// char_282_catap1
// char_282_catap'
// build_char_282_catap
// char_291_aglina
// build_char_291_aglina

export default {
  mounted() {
    this.init();
  },
  props: {
    canvasWidth: {
      default: 400,
      type: Number,
    },
  },
  data() {
    return {
      animates: [],
      curAnimate: 0,
      skeletons: {},
      skins: [],
      id: 'char_291_aglina',
      height: this.canvasWidth + 'px',
      width: this.canvasWidth * 0.75 + 'px',
      curSkeleton: null
    };
  },
  methods: {
    swtichId() {
      if (this.id === 'char_291_aglina') this.id = 'build_char_291_aglina';
      else this.id = 'char_291_aglina';

      this.init();
    },
    changeAnimate(t) {
      this.curAnimate = t ? this.curAnimate + 1 : this.curAnimate - 1;
      if (this.curAnimate >= this.animates.length) this.curAnimate = 0;
      else if (this.curAnimate < 0)
        this.curAnimate = this.animates.length !== 0 ? this.animates.length - 1 : 0;

      const { state, skeleton } = this.spine.skeletons[this.id];
      console.log(this.curAnimate);
      state.setAnimation(0, this.spine.animates[this.curAnimate], true);
      skeleton.setToSetupPose();
    },
    async init() {
      this.spine = new Spine(this.$refs.container);
      this.skeleton = await this.spine.init(this.id);
      this.animates = this.spine.animates;
    }
  }

};
</script>

<style lang="stylus" scoped>
.control-button-wrapper {
  position: absolute
  bottom: 0 //28是el-button mini 的高度
  display: flex
  justify-content: space-between
  z-index: 10
}

.control-button {
  display: flex
  justify-content: space-between
  align-items: center
  width: 180px
}

.spine-panel {
  position: absolute
  bottom: 0
  left: 0

  &:hover {
    z-index: 10

    &:after, &:before {
      display: none
    }
  }

  &:before, &:after {
    content: ''
    box-sizing: border-box
    position: absolute
  }

  &:before {
    border-top: 25px solid hsl(0, 0%, 19%)
    border-left: 25px solid hsl(0, 0%, 19%)
    top: 0
    left: 0
    width: 35%
    height: 26.31%
  }

  &:after {
    border-bottom: 25px solid #c02a34
    border-right: 25px solid #c02a34
    bottom: calc(35% - 28px)
    right: 0%
    width: 35%
    height: 26.31%
  }
}
</style>
