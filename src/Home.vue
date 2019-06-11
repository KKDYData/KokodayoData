<template>
  <div class="home-wrapper" style>
    <!-- <el-alert show-icon type="success" title="你现在访问的是稳定版" description>
      <el-link
        href="https://somedata.top/ArknightsBeta"
        type="info"
      >Beta版链接somedata.top/ArknightsBeta</el-link>，更新频繁，多Bug。Beta版更新频率在一天左右，稳定版大概在3-4天。为了资料站的健康发展，欢迎加入反馈群799872783。你的意见对我们很重要！
    </el-alert>-->
    <el-alert show-icon type="warning" title="这是Beta版,可能会有Bug" description>
      <el-link href="https://somedata.top/Arknights" type="success">somedata.top/Arknights</el-link>已经恢复，这是稳定版，建议使用。Beta版更新频率在一天左右，稳定版大概在3-4天
    </el-alert>
    <home-layout v-if="load" :profileList="data"></home-layout>
  </div>
</template>
<script>
import { getProfileList } from './components/utils';
import { Alert, link } from 'element-ui';
import HomeLayout from './components/homeLayout';
import Vue from 'vue';
Vue.use(link);
Vue.use(Alert);

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


