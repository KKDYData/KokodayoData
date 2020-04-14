<template>
  <div ref="swiper-container" class="swiper-container">
    <div class="swiper-active-title">
      <div v-for="({label}, index) in tabData" :key="index" @click="slideTo(index)">{{ label }}</div>
    </div>
    <div class="swiper-wrapper">
      <slot />
    </div>
    <div class="swiper-scrollbar"></div>
    <div class="swiper-scrollbar--outer"></div>
  </div>
</template>

<script>
import { Swiper, Scrollbar } from 'swiper/js/swiper.esm'
import { sleep } from '../../utils'
Swiper.use(Scrollbar)

export default {
  props: {
    tabData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      swiperInstance: null
    }
  },
  async mounted() {
    await this.$nextTick()
    const sInstance = this.swiperInstance = new Swiper(this.$refs['swiper-container'], {
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        dragSize: 90
      },
      autoHeight: true
    })
    sInstance.on(
      'slideChange', () => {
        this.activeName = this.tabData[sInstance.realIndex].label
        this.$emit('slideChange', this.tabData[sInstance.realIndex])
      })

    // 防止渲染过慢导致高度不对
    for (let i = 0;i < 3;i++) {
      await sleep(200)
      sInstance.updateAutoHeight()
    }

  },
  methods: {
    slideTo(index) {
      if (this.swiperInstance) {
        this.swiperInstance.slideTo(index)
      }
    },
  }
}
</script>
<style lang="stylus">
.swiper-container {
  padding-top: 70px
  position: relative
  --swiper-theme-color: #F49800
  --scrollBarWidth: 90px * 2

  .swiper-scrollbar {
    top: 30px
    width: var(--scrollBarWidth)

    &-drag {
      background: var(--swiper-theme-color)
    }
  }

  .swiper-scrollbar--outer {
    position: absolute
    top: 29px
    left: 0
    width: 100%
    background-color: rgba(0, 0, 0, 0.1)
    border-radius: 2px
    height: 7px
    z-index: 0
  }

  .swiper-slide {
    padding: 0 20px
    box-sizing: border-box
  }
}

.swiper-active-title {
  display: flex
  position: absolute
  top: 5px
  left: 1%
  width: 98%

  div {
    cursor: pointer
    width: 80px
    margin-right: 20px
  }
}

@media screen and (max-width: 700px) {
  .swiper-container {
    .swiper-slide {
      padding: 0 vw(10)
    }
  }
}
</style>
