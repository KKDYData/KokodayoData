<template>
  <div class="home-wrapper">
    <el-alert
      v-if="!isBeta"
      show-icon
      type="success"
      title="你现在访问的是稳定版"
      description
    >增加召唤物显示（水濑/鸟笼/触手...）， 如果看不到图，请清空缓存。</el-alert>
    <el-alert v-else show-icon type="warning" description>
      <div slot="title">
        这是Beta版,随缘修bug。Dps柱状图准备重做，请自行分辨是否正确。
        提醒： 先看单次伤害是否正确，然后看攻击间隔。因为要重做了，所以不会去处理边缘情况了。
        现在这个图对有持续时间的一般技能是正确的例如（黑/普罗旺斯/银灰/斯卡蒂）
        <el-link href="https://somedata.top/Arknights" type="success">稳定版链接</el-link>
      </div>
    </el-alert>
    <transition name="fade" mode="out-in">
      <home-layout v-if="load" :profileList="data"></home-layout>
    </transition>
  </div>
</template>
<script>
import { getProfileList } from './utils/fetch';
import { Alert, link } from 'element-ui';
import Vue from 'vue';
Vue.use(link);
Vue.use(Alert);

import loadingC from './components/Loading';
import Mode from './stats';

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
      return getProfileList().then(source => {
        source.forEach((el, index) => {
          el.index = index;
          el.tagHit = 0;
        });
        return source.reverse();
      });
    }
  }
};
</script>


