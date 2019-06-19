<template>
  <div class="home-wrapper">
    <!-- <el-alert show-icon type="success" title="你现在访问的是稳定版" description>
      <el-link
        href="https://somedata.top/ArknightsBeta"
        type="info"
      >Beta版链接somedata.top/ArknightsBeta</el-link>2019年6月16日。调整了一些UI，修复了经验计算器的严重bug。
      反馈群799872783。
    </el-alert>-->
    <el-alert show-icon type="warning" title="这是Beta版,可能会有Bug" description>
      <el-link href="https://somedata.top/Arknights" type="success">这是稳定版somedata.top/Arknights</el-link>，建议使用。Beta版更新频率在一天左右，稳定版大概在3-4天
      <b style="color: black">也许你没有发现，其实这里也是可以进行公开招募筛选的</b>
    </el-alert>
    <transition name="fade" mode="out-in">
      <home-layout v-if="load" :profileList="data"></home-layout>
    </transition>
  </div>
</template>
<script>
import { getProfileList } from './components/utils';
import { Alert, link } from 'element-ui';
// import HomeLayout from './components/homeLayout';
import Vue from 'vue';
Vue.use(link);
Vue.use(Alert);

import loadingC from './components/loading';

const HomeLayout = () => ({
  component: import(/* webpackChunkName: "HomeLayout" */ './components/homeLayout'),
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
      load: false
    };
  },
  mounted() {
    this.linkStart();
    // const isOpen = localStorage.getItem('isOpen');
    // if (!isOpen) {
    //   localStorage.setItem('isOpen', true);
    // } else {
    //   this.linkStart();
    // }
  },
  methods: {
    linkStart() {
      this.getData().then(data => {
        this.data = data;
        this.load = true;
      });
    },
    getData() {
      return getProfileList().then(source => {
        source.forEach((el, index) => {
          el.index = index;
          el.tagHit = 0;
        });
        return source.filter(el => el.position).reverse();
      });
    }
  }
};
</script>


