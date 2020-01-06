<template>
  <div class="agent-card-pic" :style="{width, height: width}">
    <el-image style="height:100%;width:100%" :src="src">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline" />
      </div>
    </el-image>
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
    width: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="stylus" scoped>
.agent-card-pic {
  display: inline-block
  position: relative
  vertical-align: middle
  width: 150px
  height: 150px
}

@media screen and (max-width: 700px) {
  .agent-card-pic {
    --imgW: calc(80px + 5vw)
    height: var(--imgW)
    width: var(--imgW)
    min-width: var(--imgW)
  }
}
</style>
