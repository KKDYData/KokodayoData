<template>
  <div
    ref="swiper-container"
    class="char-set-panel swiper-container"
    :autoplay="false"
    indicator-position="outside"
    :loop="false"
    :style="{height: wrapperHeight}"
    @change="$event => curIndex = $event"
  >
    <!-- 默认立绘小人 pc -->
    <div class="swiper-wrapper">
      <div v-for="(data, index) in setData" :key="index" class="swiper-slide">
        <div style="width: 100vw">
          <spine-panel v-if="!short && !ex" :id="id" :canvas-width="spineWidth" />
          <!-- pc 皮肤小人 -->
          <spine-panel
            v-if="!short && curIndex === index && setData && ex"
            :id="data.avatarId"
            class="spin-panel"
            :canvas-width="spineWidth"
          />

          <!-- 立绘 -->
          <div :id="`char-set-container-${index}`" :key="index" style="font-size:13px">
            <div class="char-set-container-wrapper">
              <div class="char-set-info">
                <div v-if="data.displaySkin">
                  <content-slot class="char-set-info-item" :width="80" long>
                    <template slot="title">名称</template>
                    <template slot="content">{{ data.displaySkin.skinName }}</template>
                  </content-slot>
                  <content-slot class="char-set-info-item" :width="80" long>
                    <template slot="title">系列</template>
                    <template slot="content">{{ data.displaySkin.skinGroupName }}</template>
                  </content-slot>
                  <content-slot class="char-set-info-item" :width="80" long>
                    <template slot="title">获得方式</template>
                    <template slot="content">{{ data.displaySkin.obtainApproach }}</template>
                  </content-slot>
                  <content-slot class="char-set-info-item" :width="80" long long-conten>
                    <template slot="title">描述</template>
                    <template slot="content">{{ data.displaySkin.usage }}</template>
                  </content-slot>
                  <content-slot class="char-set-info-item" :width="80" long long-content>
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
                  :preview-src-list="short ? [data.charSet] : []"
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
                </div>
              </div>

              <!-- 默认立绘小人 移动 -->
              <!-- <div> -->
              <spine-panel
                v-if="short && setData && !ex"
                :id="id"
                class="spin-panel mobile"
                :canvas-width="spineWidth"
              />
              <!-- </div> -->
              <!-- 皮肤立绘小人 移动 -->
              <spine-panel
                v-if="short && setData && ex"
                :id="data.avatarId"
                class="spin-panel mobile"
                :canvas-width="spineWidth"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="setData.length > 1" class="swiper-button-prev"></div>
    <div v-if="setData.length > 1" class="swiper-button-next"></div>
    <div v-if="!short && setData.length > 1" class="swiper-pagination"></div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import Vue from 'vue'
Vue.use(Loading)


import CImage from '@/components/base/CImage'
import ContentSlot from '@/components/base/ContentSlot'
import RImage from '@/components/base/RImage'

import { mapState } from 'vuex'
import { getScreenWidth } from '../../../utils'
import { Swiper, Pagination, Navigation } from 'swiper/js/swiper.esm'
Swiper.use(Pagination)
Swiper.use(Navigation)

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
    const container = this.$refs['swiper-container']
    // 会被扔进body，所以等一下
    await this.$nextTick()
    new Swiper(container, {
      resistanceRatio: 0.3,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
    })
  },
  beforeMount() {
    const { width, height } = getScreenWidth()
    this.height = this.short ? height + 'px' : (height * 0.8 - 42) + 'px'
    this.wrapperHeight = this.short ? height + 'px' : (height * 0.81) + 'px'
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
  --swiper-theme-color: #000
  background: #fff
  overflow-y: auto
  width: 100%

  & >>> .swiper-pagination-bullet {
    width: 60px
    height: 5px
    border-radius: 4px
  }

  .swiper-slide {
    //width: 100vw !important
  }
}

.char-set-container-wrapper {
  display: flex
  justify-content: space-between
  height: 100%
  width: 100%
  padding: 20px
  box-sizing: border-box
}

.char-set-container {
  width: 100%
}

.char-set-info {
  width: 250px
}

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
  bottom: 30px
  left: 2%
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
    width: 100vw
    padding: 0

    &>>> .div__item {
      display: block
      overflow: scroll
    }
  }

  .set-right-panel {
    margin-right: 10px
    width: auto
    display: flex
    flex-flow: column
  }

  .char-set-info {
    width: 100%
  }

  .spine-panel {
    left: auto
    bottom: auto
  }
}
</style>
