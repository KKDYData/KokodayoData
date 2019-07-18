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
import loadingC from "./components/Loading";
import { Alert } from "element-ui";
import Vue from "vue";
Vue.use(Alert);
import { getEnemyList, getEneAppearMap, isMoblie } from "./components/utils";

const EnemyDataLayout = () => ({
  component: import(
    /* webpackChunkName: "EnemyDataLayout" */ "./components/EnemyDataLayout"
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  metaInfo: {
    titleTemplate: "%s敌人图鉴 | 明日方舟",
    meta: [
      {
        vmid: "description",
        name: "Description",
        content: "霜星 塔露拉 梅菲斯特 浮士德 弑君者 碎骨 W 粉碎攻坚组长"
      }
    ]
  },
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
  },
  beforeMount() {
    this.short = isMoblie();
    window.addEventListener("resize", () => {
      this.short = window.innerWidth < 500 ? true : false;
      this.$refs.layout && this.$refs.layout.calFillAmount();
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