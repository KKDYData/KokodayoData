<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#525252"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item index="/">Arknights Data</el-menu-item>
    <el-menu-item index="/computer">经验计算</el-menu-item>
    <!-- <el-menu-item index="/EditHome">编辑面板</el-menu-item> -->
  </el-menu>
</template>

<script>
import { Menu, MenuItem } from 'element-ui';
import Vue from 'vue';
Vue.use(Menu);
Vue.use(MenuItem);

export default {
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {}
  }
};
</script>

<style scoped>
</style>


