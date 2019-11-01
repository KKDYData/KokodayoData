<template>
  <div>
    <el-alert show-icon type="warning" description>
      <div slot="title">注意</div>
      <p>
        已更新地图路线，在所有敌人有个简要模式，点按切为路线模式。
        <del>即将更新</del>下次大型活动前更新实时摆箱子堵路的功能
      </p>
      <p>数据请以下面选择地图后的数据为准，因为每个地图都有可能覆盖敌人数据</p>
      <p>增加特殊地板的数据显示。前进后退正常生效了。</p>
      <p>出现章节的后续会加上，但是突袭已经地图关卡数据需要进关卡才能看</p>
      <p>更新寻路算法中。。。。。。</p>
    </el-alert>
    <enemy-data ref="layout"></enemy-data>
  </div>
</template>

<script>
// import EnemyData from '../components/EnemyData';
import loadingC from '../components/base/Loading';
import { Alert } from 'element-ui';
import Vue from 'vue';
Vue.use(Alert);

const EnemyData = () => ({
  component: import(
    /* webpackChunkName: "EnemyData" */ '../components/EnemyData'
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
  },
  beforeRouteUpdate(to, from, next) {
    this.$refs.layout.loadMap(to.params.map);
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (/enemydata(\/)?$/.test(to.path)) {
      this.$refs.layout.clearMap();
    } else if (/enemydata\/.+$/.test(to.path)) {
      this.$refs.layout.loadMap(to.params.map);
    }
    next();
  }
};
</script>
