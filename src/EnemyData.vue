<template>
  <div class="home-wrapper">
    <el-alert show-icon type="warning" description>
      <div slot="title">注意</div>
      <p>敌人的突袭数据由这里的数据和地图加成计算得出</p>
    </el-alert>
    <enemy-data-layout ref="layout" :short="short" v-if="load" :data="data" :appear-map="appearMap"></enemy-data-layout>
  </div>
</template>
<script>
import loadingC from './components/Loading';
import { Alert } from 'element-ui';
import Vue from 'vue';
Vue.use(Alert);
import { getEnemyList, getEneAppearMap } from './components/utils';

const EnemyDataLayout = () => ({
  component: import(
    /* webpackChunkName: "EnemyDataLayout" */ './components/EnemyDataLayout'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  components: {
    EnemyDataLayout
  },
  data() {
    return {
      short: false,
      data: [],
      load: false,
      appearMap: null
    };
  },
  created() {
    this.linkStart();
    this.short = window.innerWidth < 500 ? true : false;
    if (this.short) this.showExplain = [];
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
      this.$refs.layout && this.$refs.layout.calFillAmount();
      // console.log(this.$refs);
    });
  },
  methods: {
    linkStart() {
      this.getData().then(data => {
        this.data = data[0];
        this.appearMap = data[1];
        this.load = true;
      });
    },
    getData() {
      return Promise.all([getEnemyList(), getEneAppearMap()]);
    }
  }
};
</script>