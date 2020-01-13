<template>
  <div
    :style="itemBackground"
    :class="(type === 'FURN' ? 'furn-item' : 'evolvcost-item-contianer' ) + ' cbg'"
  >
    <c-image class="evolvcost-item-contianer-wrapper" :src="itemPic" />
  </div>
</template>
<script>
import CImage from '@/components/base/CImage'


export default {
  components: {
    CImage
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    itemBackground: {
      type: Object,
      default: null
    },
    itemPic: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.evolvcost-item-contianer-wrapper {
  position: absolute
  width: 128%
  height: 128%
  margin-top: -14%
  margin-left: -14%
}

.evolvcost-item-contianer {
  display: block
  box-sizing: border-box
  box-shadow: inset 0 0 0 2px black
  background-color: grey
  border: 2px solid rgb(249, 198, 19)
  border-radius: 50%
  overflow: visible
  margin: 0 auto
  width: 70px
  height: 70px
  position: relative
}

.furn-item {
  position: relative
  width: 70px
  min-height: 70px
  display: block
  box-sizing: border-box
  border-radius: 3px
  box-shadow: inset 0px 6px 13px 0px #4a4a4a
  background: url('../../assets/bbbj_optimized.png')
  background-size: cover
  padding: 9px 0

  & >>> img {
  }

  .evolvcost-item-contianer-wrapper {
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    z-index: 10
    background-position: center center
  }
}

@media screen and (max-width: 700px) {
  .evolvcost-item-contianer {
    width: calc(45px + 2vw)
    height: calc(45px + 2vw)
  }
}
</style>
