<template>
  <div slot="reference" class="enemy-container">
    <div class="enemy-img-container">
      <div v-if="index" class="enemy-index-container">
        <span>{{index}}</span>
      </div>
      <el-image :src="src"></el-image>
      <div>
        <span :style="name.length > 6 ? 'font-size: 14px' : ''">{{name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Image } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);

export default {
  props: {
    src: {
      required: true
    },
    index: {
      type: true
    },
    name: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.enemy-container {
  display: flex
  margin: 30px 0
  margin-right: 20px
  cursor: pointer

  .enemy-img-container {
    height: 100px
    width: 100px
    min-width: 100px
    position: relative

    &:before {
      content: ''
      border: var(--border)
      width: 100%
      height: 100%
      position: absolute
      box-sizing: border-box
      z-index: 1
    }
  }

  .enemy-index-container {
    position: absolute
    z-index: 1
    background-color: rgba(0, 0, 0, 0.5)
    color: white
    top: -2px
    left: -2px
    padding: 2px 5px
  }
}

@media screen and (max-width: 400px) {
  .enemy-container {
    margin-right: 2vw
  }

  .enemy-img-container {
    --imgW: calc(80px + 5vw)
    height: var(--imgW)
    width: var(--imgW)
    min-width: var(--imgW)
  }
}
</style>
