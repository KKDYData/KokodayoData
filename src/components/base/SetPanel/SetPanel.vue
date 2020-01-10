<template>
  <el-carousel
    id="wrapper"
    class="char-set-panel"
    :height="height"
    :autoplay="false"
    indicator-position="outside"
    :loop="false"
    @change="$event => curIndex = $event"
  >
    <!-- 默认立绘小人 pc -->
    <spine-panel v-if="!short && !ex" :id="id" :canvas-width="spineWidth" />

    <div v-for="(data, index) in setData" :key="index" :data="data" :short="short">
      <!-- pc 皮肤小人 -->
      <spine-panel
        v-if="!short && curIndex === index && setData && ex"
        :id="data.avatarId"
        class="spin-panel"
        :canvas-width="spineWidth"
      />

      <!-- 立绘 -->
      <el-carousel-item :id="`char-set-container-${index}`" :key="index" style="font-size:13px">
        <div class="char-set-container-wrapper">
          <div class="char-set-info-cotainer">
            <div v-if="data.displaySkin">
              <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                <template slot="title">系列</template>
                <template slot="content">{{ data.displaySkin.skinGroupName }}</template>
              </content-slot>
              <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                <template slot="title">获得方式</template>
                <template slot="content">{{ data.displaySkin.obtainApproach }}</template>
              </content-slot>
              <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                <template slot="title">描述</template>
                <template slot="content">{{ data.displaySkin.usage }}</template>
              </content-slot>
              <content-slot style="margin-top: 10px;" :long="true" :no-wrap="true">
                <template slot="title">记录</template>
                <template slot="content">{{ data.displaySkin.content | filterColor }}</template>
              </content-slot>
            </div>
          </div>

          <div
            v-loading="setLoad"
            element-loading-background="rgba(168, 168, 168, 0.1)"
            :style="!short ? {width: height}: {height: '320px'}"
            class="char-set-container"
          >
            <r-image
              :preview-src-list="[data.charSet]"
              :src="data.charSet"
              @load="setLoad = false"
            />
          </div>
          <div v-if="!short" class="set-right-panel">
            <div class="char-profile-container">
              <c-image :src="data.profile" />
            </div>
            <div class="char-half-container">
              <c-image :src="data.halfPic" />
              <!-- <div class="image-inner cbg" :style="{backgroundImage: `url('${data.halfPic}'`}" /> -->
            </div>
          </div>

          <!-- 默认立绘小人 移动 -->
          <!-- <el-carousel-item> -->
          <spine-panel
            v-if="short && setData && !ex"
            :id="id"
            class="spin-panel mobile"
            :canvas-width="spineWidth"
          />
          <!-- </el-carousel-item> -->
          <!-- 皮肤立绘小人 移动 -->
          <spine-panel
            v-if="short && setData && ex"
            :id="data.avatarId"
            class="spin-panel mobile"
            :canvas-width="spineWidth"
          />
        </div>
      </el-carousel-item>
    </div>
  </el-carousel>
</template>

<script>
import phyTouch from 'phy-touch'
import Transfrom from 'phy-touch/transformjs'

import { Carousel, CarouselItem, Loading } from 'element-ui'
import Vue from 'vue'
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Loading)


import CImage from '@/components/base/CImage'
import ContentSlot from '@/components/base/ContentSlot'
import RImage from '@/components/base/RImage'

import { mapState } from 'vuex'
import { getScreenWidth } from '../../../utils'
const SpinePanel = () =>
  import(/* webpackChunkName: "SpinePanel" */ '../SpinePanel')


export default {
  components: {
    SpinePanel,
    ContentSlot,
    CImage,
    RImage
  },
  filters: {
    filterColor(v) {
      const reg = /<color (name=(.{7}))?>/g
      const regL = /<\/color>/g
      return v.replace(reg, '').replace(regL, '')
    }
  },
  props: {
    id: {
      type: String,
      default: null
    },
    setData: {
      required: true,
      type: Array
    }
  },

  data() {
    return {
      curIndex: 0,
      width: 1159,
      height: '1000px',
      spineWidth: 300,
      setLoad: true
    }
  },

  computed: {
    ...mapState(['short']),
    ex() {
      return this.setData[0].displaySkin
    },
  },
  async mounted() {
    const radio = this.ex ? 2.6 : 2.3
    for (let i = 0;i < this.setData.length;i++) {
      const target = document.body.querySelector(`#char-set-container-${i}`).querySelector('.char-set-container-wrapper')
      // const { height } = target.getBoundingClientRect();
      const opt = {
        touch: '#wrapper',//反馈触摸的dom
        vertical: true,//不必需，默认是true代表监听竖直方向touch
        target: target, //运动的对象
        property: 'translateY',  //被运动的属性
        min: -window.innerWidth * radio + window.innerHeight,
        max: 0,
        sensitivity: 0.5,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
        factor: 1,//不必需,表示触摸位移运动位移与被运动属性映射关系，默认值是1
        moveFactor: 1,//不必需,表示touchmove位移与被运动属性映射关系，默认值是1
        step: 45,//用于校正到step的整数倍
        bindSelf: false,
        maxSpeed: 2, //不必需，触摸反馈的最大速度限制 
        value: 0,
        change: function (value) { },
        touchStart: function (evt, value) { },
        touchMove: function (evt, value) { },
        touchEnd: function (evt, value) { },
        tap: function (evt, value) { },
        pressMove: function (evt, value) { },
        animationEnd: function (value) { } //运动结束
      }
      Transfrom(target)
      new phyTouch(opt)
    }

  },
  beforeMount() {
    const { width, height } = getScreenWidth()
    this.height = (height - 100) + 'px'
    if (!this.short) {
      this.spineWidth = (width / 1159) * 300
    }
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/char.styl'

.char-set-panel {
  &>>> .el-carousel__item {
    display: flex
    justify-content: center
    align-items: center
  }
}

.char-set-container-wrapper {
  display: flex
  justify-content: space-between
  height: 100%
  width: 100%
}

.char-set-container {
  width: 100%
}

.char-set-info-cotainer {
  width: 250px
}

//.char-half-container {
//width: 110px
//position: relative
//margin-top: 20px
//font-size: 0
//}
.char-profile-container {
  height: 110px
  position: relative
}

.char-profile-container + .char-half-container, .char-profile-container {
  &::before {
    content: ''
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    border: 10px solid #fff
    box-sizing: border-box
    box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.31), 0px 2px 6px 0px rgba(0, 0, 0, 0.47) inset
  }
}

.set-right-panel {
  margin-right: 10px
  width: 110px
  display: flex
  flex-flow: column
}

.spine-panel {
  position: absolute
  bottom: 0
  left: 0
}

.spin-panel.mobile {
  position: relative
  display: flex
  justify-content: center
}

@media screen and (max-width: 700px) {
  .char-set-container-wrapper {
    display: block
    height: auto
  }

  .char-set-container {
    width: 100%
  }

  .char-set-panel {
    &>>> .el-carousel__item {
      display: block
      //overflow: scroll
    }
  }

  .set-right-panel {
    margin-right: 10px
    width: auto
    display: flex
    flex-flow: column
  }

  .char-set-info-cotainer {
    width: 100%
  }
}
</style>
