<template>
  <div :style="itemBackground" class="base-item cbg" :class="typeClass">
    <c-image class="item-contianer-wrapper--inner" :src="itemPic" />
  </div>
</template>
<script>
import CImage from '@/components/Base/CImage'


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
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    typeClass() {
      const type = this.type === 'FURN' ? 'furn-item' : 'evolvcost-item-contianer'
      const small = this.small ? 'small' : ''
      return type + ' ' + small
    }
  }
}
</script>

<style lang="stylus" scoped>
.base-item {
  width: 70px
  height: 70px

  &.small {
    width: 45px
    height: 45px
  }
}

.item-contianer-wrapper--inner {
  position: absolute
  width: 128%
  height: 128%
  top: -14%
  left: -14%
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
  position: relative
}

.furn-item {
  position: relative
  min-height: 70px
  display: block
  box-sizing: border-box
  border-radius: 3px
  box-shadow: inset 0px 6px 13px 0px #4a4a4a
  background: url('../../assets/bbbj_optimized.png')
  background-size: cover
  padding: 9px 0

  .item-contianer-wrapper--inner {
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    z-index: 10
    background-position: center center
  }
}

@media screen and (max-width: 500px) {
  .base-item {
    width: vw(117)
    height: vw(117)

    &.small {
      width: vw(97)
      height: vw(97)
    }
  }
}
</style>
