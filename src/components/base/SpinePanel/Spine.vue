<template>
  <div class="spine-panel" :style="'--border-width:' + borderWidth + 'px'">
    <div class="control-button-wrapper">
      <div style="margin-bottom: 8px">
        <el-button type="primary" size="mini" @click="swtichId">
          {{ modeText[mode[0]] }}
          <i class="el-icon-sort icon-switch" />
        </el-button>
        <el-button :type="spineState.loop ? 'primary' : ''" size="mini" @click="setLoop">loop</el-button>
      </div>
      <div class="control-button">
        <el-button type="primary" size="mini" class="el-icon-back" @click="changeAnimate(false)" />
        <span
          style="display: inline-block;text-align: center; font-size: 13px"
        >{{ spineState.animates[spineState.curAnimateIndex] }}</span>
        <el-button type="primary" size="mini" class="el-icon-right" @click="changeAnimate(true)" />
      </div>
    </div>
    <canvas ref="container" class="spine-canvas" :style="{width, height}" />
  </div>
</template>

<script>
import { Button, Message } from 'element-ui'
import { Spine } from '@/utils/Spine/initSpine'

import Vue from 'vue'
import { path } from '@/utils/listVer'
import { fetchPic, fetchBuffer, fetchText } from './utils'
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
      modeText: {
        build: '基建',
        fight_f: '战斗正面',
        fight_b: '战斗反面'
      },
      spineState: {
        curAnimateIndex: 0,
        animates: [],
        loop: false
      }
    }
  },
  computed: {
    borderWidth() {
      return (this.canvasWidth / 300) * 25
    },
    mode() {
      if(this.id === 'char_1001_amiya2') return [ 'fight_f', 'fight_b']
      return ['build', 'fight_f', 'fight_b']
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
      if (!this.spineState.animates) return
      const { spine, id, spineState } = this
      let { curAnimateIndex, animates } = spineState

      curAnimateIndex = t ? curAnimateIndex + 1 : curAnimateIndex - 1


      if (curAnimateIndex >= animates.length) curAnimateIndex = 0
      else if (curAnimateIndex < 0)
        curAnimateIndex = animates.length !== 0 ? animates.length - 1 : 0


      if (!spine.skeletons) return
      const skeletons = spine.skeletons

      if (!skeletons[id]) {
        console.log(skeletons)
        console.log(`no this id : ${id}`)
        return
      }
      const { state, skeleton } = skeletons[id]
      const animate = spine.animates[curAnimateIndex]
      const loop = (/Start|Begin|End/.test(animate) ? false : true)
      spineState.loop = loop

      spineState.curAnimateIndex = curAnimateIndex
      console.log(animate, curAnimateIndex, spine.animates)

      state.setAnimation(0, animate, loop)
      skeleton.setToSetupPose()
    },

    setLoop() {
      const { spineState, spine, id } = this
      const { animates, curAnimateIndex } = spineState
      const { state, skeleton } = spine.skeletons[id]
      state.setAnimation(0, animates[curAnimateIndex], !spineState.loop)
      skeleton.setToSetupPose()
      spineState.loop = !spineState.loop
    },

    async init() {
      this.spine = new Spine(this.$refs.container)
      const { id, spinePath, mode } = this

      const texture = await fetchPic(`${spinePath}${mode[0]}/${id}.png`)
      const skelBinary = await fetchBuffer(`${spinePath}${mode[0]}/${id}.skel`)
      const text = await fetchText(`${spinePath}${mode[0]}/${id}.atlas`)

      this.spine.init({ id, texture, skelBinary, text })
        .then(() => {
          this.spineState.animates = this.spine.animates
          this.spineState.load = true
        })
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
