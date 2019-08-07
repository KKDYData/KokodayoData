<template>
  <div>
    <el-alert type="info" title="说明" description>第一行是当前角色的状态，第二行是目标状态，后面是已经有的资源。框里的数字可以自己输入具体的数字</el-alert>
    <computer-layout></computer-layout>
  </div>
</template>

<script>
import Vue from 'vue';
import { Alert } from 'element-ui';
Vue.use(Alert);

import loadingC from './components/Loading';

const ComputerLayout = () => ({
  component: import(
    /* webpackChunkName: "ComputerLayout" */ './components/ComputerLayout'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  metaInfo: {
    title: '升级消耗计算器 | 明日方舟'
  },
  components: {
    'computer-layout': ComputerLayout
  }
};
</script>

<style scoped>
</style>

