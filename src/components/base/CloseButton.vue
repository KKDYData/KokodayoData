<template>
  <el-button class="close-button" @click="close()" type="danger" size="mini">
    <i class="el-icon-close"></i>
  </el-button>
</template>

<script>
import { Button } from 'element-ui';
import Vue from 'vue';
Vue.use(Button);

export default {
  methods: {
    close() {
      document.body.click();
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-button--danger.el-button--mini.close-button {
  position: absolute
  right: -5px
  top: -5px
  padding: 5px
}

.close-button i {
  font-size: 2em
}
</style>
