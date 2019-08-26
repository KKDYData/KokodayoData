<template>
  <div>
    <el-alert show-icon type="warning" description>
      <div slot="title">注意</div>
      <p>已更新地图路线、即将更新实时摆箱子堵路的功能</p>
    </el-alert>
    <enemy-data></enemy-data>
  </div>
</template>

<script>
// import EnemyData from './components/EnemyData';
import loadingC from './components/Loading';
import { Alert } from 'element-ui';
import Vue from 'vue';
Vue.use(Alert);

const EnemyData = () => ({
  component: import(
    /* webpackChunkName: "EnemyData" */ './components/EnemyData'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  components: {
    EnemyData
  },
  data() {
    return {};
  }
};
</script>
