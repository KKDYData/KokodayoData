<template>
  <el-button class="close-button" type="danger" size="mini" @click="close()">
    <i class="el-icon-close" />
  </el-button>
</template>

<script>
import { Button } from 'element-ui'
import Vue from 'vue'
Vue.use(Button)

export default {
  methods: {
    close() {
      const modal = document.body.querySelector('.v-modal')
      if (modal) modal.click()
      else document.body.click()
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-button--danger.el-button--mini.close-button {
  position: absolute
  right: -5px
  top: -5px
  padding: 5px
  z-index: 10
}

.close-button i {
  font-size: 2em
}
</style>
