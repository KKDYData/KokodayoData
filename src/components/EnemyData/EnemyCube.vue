<template>
  <div class="enemy-cube">
    <div class="enemy-container">
      <div class="enemy-img-container">
        <div v-if="index" class="enemy-index-container">
          <span>{{ index }}</span>
        </div>
        <el-image :src="src" />
      </div>
    </div>
    <div :class="(name.length > 6 ? 'small' : '') + ' normal'">{{ name }}</div>
  </div>
</template>

<script>
import { Image } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    index: {
      type: [Number, String],
      default: 0
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
  cursor: pointer
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

.enemy-img-container {
  height: 100px
  width: 100px
  min-width: 100px
  position: relative

  &:before {
    content: ''
    border: 7px solid
    border-color: var(--border)
    width: 100%
    height: 100%
    position: absolute
    box-sizing: border-box
    z-index: 1
  }
}

.enemy-cube {
  position: relative
  padding-bottom: 20px

  .normal {
    position: absolute
    top: calc(100% - 20px)

    &.small {
      font-size: 12px
    }
  }
}

@media screen and (max-width: 600px) {
  .enemy-img-container {
    width: vw(200)
    height: vw(200)
    min-width: auto

    .small {
      font-size: vw(24)
    }

    .normal {
      font-size: vw(30)
    }

    &:before {
      content: ''
      border: vw(15) solid
      border-color: var(--border)
      width: 100%
      height: 100%
      position: absolute
      box-sizing: border-box
      z-index: 1
    }
  }
}
</style>
