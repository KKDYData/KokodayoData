<template>
  <div class="spine-panel">
    <div class="spine-id">{{mode[0]}}</div>
    <div class="control-button-wrapper">
      <div class="control-button">
        <el-button type="primary" size="mini" @click="changeAnimate(false)" class="el-icon-back"></el-button>
        <span
          style="display: inline-block;text-align: center; font-size: 13px"
        >{{animates[curAnimate]}}</span>
        <el-button type="primary" size="mini" @click="changeAnimate(true)" class="el-icon-right"></el-button>
      </div>
      <div>
        <el-button
          @click="swtichId"
          circle
          type="primary"
          size="mini"
          class="el-icon-sort icon-switch"
        ></el-button>
      </div>
    </div>
    <canvas class="spine-canvas" :style="{width: width, height}" ref="container"></canvas>
  </div>
</template>

<script>

import { Button } from 'element-ui';
import Spine from '../utils/Spine/initSpine';

import Vue from 'vue';
import { path } from '../utils/listVer';
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
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      animates: [],
      curAnimate: 0,
      skeletons: {},
      skins: [],
      height: (this.canvasWidth * 1.2) + 'px',
      width: this.canvasWidth + 'px',
      curSkeleton: null,
      spinePath: path + 'char/spine/',
      mode: ['build', 'fight_f', 'fight_b']
    };
  },
  methods: {
    swtichId() {
      this.mode.push(this.mode.shift());
      console.log(this.mode);
      this.init();
    },
    changeAnimate(t) {
      this.curAnimate = t ? this.curAnimate + 1 : this.curAnimate - 1;
      if (this.curAnimate >= this.animates.length) this.curAnimate = 0;
      else if (this.curAnimate < 0)
        this.curAnimate = this.animates.length !== 0 ? this.animates.length - 1 : 0;

      const { state, skeleton } = this.spine.skeletons[this.id];
      console.log(this.curAnimate);
      const animate = this.spine.animates[this.curAnimate];
      const loop = (/Start|Begin|End/.test(animate) ? false : true);
      state.setAnimation(0, animate, loop);
      skeleton.setToSetupPose();
    },
    async init() {
      this.spine = new Spine(this.$refs.container);
      const id = this.id,
        pathd = this.spinePath + this.mode[0] + '/';

      this.skeleton = await this.spine.init({ id, path: pathd });
      this.animates = this.spine.animates;
    }
  }

};
</script>

<style lang="stylus">
.spine-panel {
  position: absolute
  bottom: 0
  left: 0

  &:hover {
    z-index: 10

    .spin-id {
      display: block
    }

    &:after, &:before {
      display: none
    }
  }

  &:before, &:after {
    content: ''
    box-sizing: border-box
    position: absolute
    z-index: -1
  }

  &:before {
    border-top: 25px solid hsl(0, 0%, 19%)
    border-left: 25px solid hsl(0, 0%, 19%)
    top: 52px
    left: 45px
    width: 80px
    height: 80px
  }

  &:after {
    border-bottom: 25px solid #c02a34
    border-right: 25px solid #c02a34
    bottom: 77px
    right: 45px
    width: 80px
    height: 80px
  }

  .control-button-wrapper {
    position: absolute
    bottom: 0
    display: flex
    justify-content: space-between
    align-items: center
    z-index: 10
    width: 225px
    padding-left: 50px
    height: 36px
  }

  .control-button {
    display: flex
    justify-content: space-between
    align-items: center
    width: 180px
  }

  .icon-switch {
    transform: rotate(90deg)
  }

  .spine-id {
    position: absolute
    top: 0
    left: 0
    text-decoration: underline
    display: none
  }

  .spine-canvas {
    background: url('./bg2.png') no-repeat center
  }
}
</style>
