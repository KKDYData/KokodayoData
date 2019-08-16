<template>
  <div style="width: 100%">
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#525252"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      ref="nav-menu"
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
      //修复移动端菜单不回收的bug
      setTimeout(() => {
        console.log('hello');
        this.$refs['nav-menu'].close('2');
      }, 100);

      const arr = Object.keys(this.routes);
      let i = 0;
      while (i < arr.length) {
        const temp = arr[i];
        if (new RegExp(temp).test(this.$route.path)) {
          this.moreText = this.routes[arr[i]].text;
          return;
        }
        i++;
      }
      this.moreText = '更多';
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


