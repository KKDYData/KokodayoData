<template>
  <div class="home-wrapper">
    <enemy-data-layout :short="short" v-if="load" :data="data"></enemy-data-layout>
  </div>
</template>
<script>
import loadingC from './components/Loading';

import { getEnemyList } from './components/utils';

const EnemyDataLayout = () => ({
  component: import(
    /* webpackChunkName: "DetailsLayout" */ './components/EnemyDataLayout'
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
      load: false
    };
  },
  created() {
    this.linkStart();
    this.short = window.innerWidth < 500 ? true : false;
    if (this.short) this.showExplain = [];
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  methods: {
    linkStart() {
      this.getData().then(data => {
        console.log('??????');
        this.data = data;
        this.load = true;
      });
    },
    getData() {
      return getEnemyList();
    }
  }
};
</script>