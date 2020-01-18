<template>
  <div class="spine-panel" :style="'--border-width:' + borderWidth + 'px'">
    <div class="control-button-wrapper">
      <div style="margin-bottom: 8px">
        <el-button type="primary" size="mini" @click="swtichId">
          {{ modeText[mode[0]] }}
          <i class="el-icon-sort icon-switch" />
        </el-button>
      </div>
      <div class="control-button">
        <el-button type="primary" size="mini" class="el-icon-back" @click="changeAnimate(false)" />
        <span
          style="display: inline-block;text-align: center; font-size: 13px"
        >{{ animates[curAnimate] }}</span>
        <el-button type="primary" size="mini" class="el-icon-right" @click="changeAnimate(true)" />
      </div>
    </div>
    <canvas ref="container" class="spine-canvas" :style="{width, height}" />
  </div>
</template>

<script>
import { Button, Message } from 'element-ui'
import Spine from '../../../utils/Spine/initSpine'

import Vue from 'vue'
import { path } from '../../../utils/listVer'
Vue.use(Button)

export default {
  props: {
    canvasWidth: {
      default: 300,
      type: Number
    },
    id: {
      required: true,
      type: String
    }
  },
  data() {
    const width = this.canvasWidth

    return {
      animates: [],
      curAnimate: 0,
      skeletons: {},
      skins: [],
      height: width * 1.2 + 'px',
      width: this.canvasWidth + 'px',
      curSkeleton: null,
      spinePath: path + 'char/spine/',
      mode: ['build', 'fight_f', 'fight_b'],
      modeText: {
        build: '基建',
        fight_f: '战斗正',
        fight_b: '战斗反'
      }
    }
  },
  computed: {
    borderWidth() {
      return (this.canvasWidth / 300) * 25
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    swtichId() {
      this.mode.push(this.mode.shift())
      this.init().catch(err => {
        console.error('初始化失败', err)
        Message.info('切换失败，可能这个干员没有个模型，如果她/他真的有，请联系我们修复')
      })
        .then(() => {
          const { state, skeleton } = this.spine.skeletons[this.id]
          this.curAnimate = 0
          const animate = this.spine.animates[0]
          state.setAnimation(0, animate, false)
          skeleton.setToSetupPose()
        })
    },
    changeAnimate(t) {
      this.curAnimate = t ? this.curAnimate + 1 : this.curAnimate - 1
      if (this.curAnimate >= this.animates.length) this.curAnimate = 0
      else if (this.curAnimate < 0)
        this.curAnimate =
          this.animates.length !== 0 ? this.animates.length - 1 : 0

      const { state, skeleton } = this.spine.skeletons[this.id]
      const animate = this.spine.animates[this.curAnimate]
      const loop = /Start|Begin|End/.test(animate) ? false : true
      state.setAnimation(0, animate, loop)
      skeleton.setToSetupPose()
    },
    async init() {
      this.spine = new Spine(this.$refs.container)
      const id = this.id,
        pathd = this.spinePath + this.mode[0] + '/'

      this.skeleton = await this.spine.init({ id, path: pathd })
      this.animates = this.spine.animates
    }
  }
}
</script>

<style lang="stylus">
.spine-panel {
  position: absolute
  bottom: 0
  left: 0
  --border-width: 25px
  --border-size: calc(var(--border-width) * 3.2)

  &:hover {
    z-index: 10

    .spin-id {
      display: block
    }

    &:after, &:before {
      display: none
    }
  }

  /*&:before, &:after {
      content: ''
      box-sizing: border-box
      position: absolute
      z-index: -1
    }
  
    &:before {
      border-color: hsl(0, 0%, 19%)
      border-top: var(--border-width) solid
      border-left: var(--border-width) solid
      top: 14%
      left: 14%
      width: var(--border-size)
      height: var(--border-size)
    }
  
    &:after {
      border-bottom: var(--border-width) solid #c02a34
      border-right: var(--border-width) solid #c02a34
      bottom: 24%
      right: 15%
      width: var(--border-size)
      height: var(--border-size)
    }*/
  .control-button-wrapper {
    position: absolute
    bottom: 45px
    justify-content: space-between
    align-items: center
    z-index: 10
    width: 225px
    //padding-left: 50px
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

  .spine-canvas {
    background: url('./spine_back_2_0.5.png') no-repeat center
    background-size: contain
  }
}
</style>
