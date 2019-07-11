<template>
  <div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#525252"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item :index="routes.home.path">{{routes.home.text}}</el-menu-item>
      <template v-if="!short">
        <el-menu-item :index="routes.computer.path">{{routes.computer.text}}</el-menu-item>
        <el-menu-item :index="routes.enemydata.path">{{routes.enemydata.text}}</el-menu-item>
      </template>
      <template v-else>
        <el-submenu index="2">
          <template slot="title">{{moreText}}</template>
          <el-menu-item :index="routes.computer.path">{{routes.computer.text}}</el-menu-item>
          <el-menu-item :index="routes.enemydata.path">{{routes.enemydata.text}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { Menu, MenuItem, Submenu } from 'element-ui';
import Vue from 'vue';
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);

import Mode from './stats';

export default {
  data() {
    const path = process.env.NODE_ENV === 'development' ? '' : Mode;
    return {
      activeIndex: '1',
      activeIndex2: '1',
      isCollapse: false,
      short: false,
      moreText: '更多',
      routes: {
        enemydata: {
          path: path + '/enemydata',
          text: '敌人图鉴'
        },
        computer: {
          path: path + '/computer',
          text: '经验计算'
        },
        home: {
          path: path + '/',
          text: 'Arknights Data'
        }
      }
    };
  },
  created() {
    this.short = window.innerWidth < 500 ? true : false;

    if (this.$route.path.length > 1)
      this.moreText = this.routes[this.$route.path.slice(1)].text;
    if (this.short) this.showExplain = [];
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  watch: {
    '$route.path': function(val, oldVal) {
      if (this.$route.path.length > 1 && !/^\/details/.test(val))
        this.moreText = this.routes[val.slice(1)].text;
    }
  },
  methods: {},
  computed: {
    path() {
      return process.env.NODE_ENV === 'development' ? '' : Mode;
    }
  }
};
</script>

<style scoped>
</style>


