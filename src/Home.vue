<template>
  <div class="home-wrapper">
    <el-alert v-if="!isBeta" show-icon type="success" title="你现在访问的是稳定版" description>
      <el-link
        href="https://somedata.top/ArknightsBeta"
        type="info"
      >Beta版链接somedata.top/ArknightsBeta</el-link>。顶部菜单的更多里放了
      <b>敌人图鉴</b>和原来的计算器。预计下次更新家具图鉴之后，就会带来一个新首页了。
    </el-alert>
    <el-alert v-else show-icon type="warning" description>
      <div slot="title">
        这是Beta版,可能会有Bug
        <el-link href="https://somedata.top/Arknights" type="success">这是稳定版somedata.top/Arknights</el-link>，建议使用。Beta版更新频率在一天左右，稳定版大概在3-4天
      </div>
    </el-alert>
    <transition name="fade" mode="out-in">
      <home-layout v-if="load" :profileList="data"></home-layout>
    </transition>
  </div>
</template>
<script>
import { getDevList } from './components/utils';
import { Alert, link } from 'element-ui';
// import HomeLayout from './components/homeLayout';
import Vue from 'vue';
Vue.use(link);
Vue.use(Alert);

import loadingC from './components/Loading';
import Mode from './stats';

const HomeLayout = () => ({
  component: import(
    /* webpackChunkName: "HomeLayout" */ './components/homeLayout'
  ),
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
      short: false,
      data: [],
      load: false,
      isBeta: Mode === '/ArknightsBeta'
    };
  },
  mounted() {
    this.linkStart();
  },
  methods: {
    linkStart() {
      this.getData().then(data => {
        this.data = data;
        this.load = true;
      });
    },
    getData() {
      return getDevList().then(source => {
        source.forEach((el, index) => {
          el.index = index;
          el.tagHit = 0;
        });
        return source.filter(el => el.logo).reverse();
      });
    }
  }
};
</script>


