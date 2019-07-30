<template>
  <div class="home-wrapper">
    <el-drawer title="章节选择" :visible.sync="drawer" size="50%">
      <div class="chapter-wrapper">
        <el-tree :data="stageList" accordion :highlight-current="true" :auto-expand-parent="true"></el-tree>
      </div>
    </el-drawer>
    <el-alert show-icon type="warning" description>
      <div slot="title">注意</div>
      <p>敌人的突袭数据由这里的数据和地图加成计算得出</p>
    </el-alert>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">点我打开</el-button>
    <enemy-data-layout ref="layout" :short="short" v-if="load" :data="data" :appear-map="appearMap"></enemy-data-layout>
    <!-- {{stageList}} -->
  </div>
</template>
<script>
import loadingC from "./components/Loading";
import { Alert, Tree, Drawer, Button } from "element-ui";
import Vue from "vue";
Vue.use(Alert);
Vue.use(Button);
Vue.use(Tree);
Vue.use(Drawer);
// Vue.use(Dialog);
import { getEnemyList, getEneAppearMap, isMoblie } from "./components/utils";
import StageList from "./components/stageListPro";

const StageType = {
  main: "主线",
  tr: "TR",
  hard: "困难",
  wk: "日常",
  camp: "剿灭作战",
  guid: "教程"
};

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
  components: {
    EnemyDataLayout
  },
  data() {
    return {
      short: false,
      data: [],
      load: false,
      appearMap: null,
      drawer: false
    };
  },
  computed: {
    stageList() {
      const change = list => {
        return Object.entries(list).map(([key, value]) => {
          // const children = Object.entries(value);
          if (Array.isArray(value)) {
            return {
              label: StageType[key] || key,
              children: value.map(el => ({ label: el }))
            };
          } else {
            return { label: StageType[key] || key, children: change(value) };
          }
        });
      };
      return change(StageList)
        .filter(el => el.label !== "st")
        .sort((pre, cur) => (pre.label > cur.label ? -1 : 1));
    },
    direction() {
      return this.short ? "btt" : "rtl";
    }
  },
  created() {
    this.linkStart();
  },
  beforeMount() {
    this.short = isMoblie();
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

<style lang="stylus" scoped>
.chapter-wrapper {
  padding-left: 20px;
}
</style>
