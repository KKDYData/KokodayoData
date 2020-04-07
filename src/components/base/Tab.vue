<template>
  <div ref="swiper-container" class="swiper-container">
    <div class="swiper-active-title">
      <div v-for="({label}, index) in tabData" :key="index" @click="slideTo(index)">{{ label }}</div>
    </div>
    <div class="swiper-scrollbar"></div>
    <div class="swiper-wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
import { Swiper, Scrollbar } from 'swiper/js/swiper.esm'
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
  mounted() {
    const sInstance = this.swiperInstance = new Swiper(this.$refs['swiper-container'], {
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        dragSize: 80
      }
    })
    sInstance.on(
      'slideChange', () => {
        this.activeName = this.tabData[sInstance.realIndex].label
        this.$emit('slideChange', this.tabData[sInstance.realIndex])
      })
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
<style lang="stylus" scoped>
.swiper-container {
  padding-top: 70px
  position: relative

  .swiper-scrollbar {
    top: 30px
  }

  .swiper-slide {
    padding: 0 20px
    box-sizing: border-box
  }
}

.swiper-active-title {
  display: flex
  justify-content: space-between
  position: absolute
  top: 5px
  left: 1%
  width: 98%

  div {
    cursor: pointer
  }
}

@media screen and (max-width: 700px) {
  .swiper-container {
    .swiper-slide {
      padding: 0 vw(20)
    }
  }
}
</style>
