<template>
  <div class="home-wrapper">
    <div class="home-info">
      <el-alert
        show-icon
        :type="isBeta ?  'warning': 'success'"
        description
        :closable="false"
      >已经迁移到新域名。看立绘的地方，多了小人可以看</el-alert>
    </div>
    <transition name="fade" mode="out-in">
      <home-layout v-if="load" :profileList="data" :tokenList="token"></home-layout>
    </transition>
  </div>
</template>
<script>
import { getProfileList } from '../utils/fetch';
import { Alert, link } from 'element-ui';
import Vue from 'vue';
Vue.use(link);
Vue.use(Alert);

import loadingC from '../components/base/Loading';
import { devMode } from '../stats';

const HomeLayout = () => ({
  component: import(/* webpackChunkName: "HomeLayout" */ '../components/homeLayout'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  components: {
    'home-layout': HomeLayout
  },
  data() {
    return {
      data: [],
      token: [],
      load: false,
      isBeta: devMode === '/ArknightsBeta'
    };
  },
  mounted() {
    this.linkStart();
  },
  methods: {
    linkStart() {
      this.getData().then(data => {
        const agent = [], token = [];
        data.forEach(el => {
          if (el.class !== 'TOKEN') agent.push(el);
          else token.push(el);
        });
        this.data = agent;
        this.token = token;
        this.load = true;
      });
    },
    getData() {
      return getProfileList().then(source => {
        source.forEach((el, index, arr) => {
          el.index = index;
          el.tagHit = 0;
          el.showTags = false;
        });
        return source.reverse();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.home-info {
  max-width: 1000px
  margin: 0 auto
}
</style>


