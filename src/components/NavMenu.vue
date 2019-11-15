<template>
  <div style="width: 100%">
    <el-menu
      ref="nav-menu"
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#525252"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item :index="routes.home.path">{{ routes.home.text }}</el-menu-item>
      <el-menu-item :index="routes.enemydata.path">{{ routes.enemydata.text }}</el-menu-item>
      <template v-if="!short">
        <el-menu-item :index="routes.items.path">{{ routes.items.text }}</el-menu-item>
        <el-menu-item :index="routes.computer.path">{{ routes.computer.text }}</el-menu-item>
        <el-menu-item :index="routes.customtheme.path">{{ routes.customtheme.text }}</el-menu-item>
      </template>
      <template v-else>
        <el-submenu index="2">
          <template slot="title">{{ moreText }}</template>
          <el-menu-item :index="routes.items.path">{{ routes.items.text }}</el-menu-item>
          <el-menu-item :index="routes.computer.path">{{ routes.computer.text }}</el-menu-item>
          <el-menu-item :index="routes.customtheme.path">{{ routes.customtheme.text }}</el-menu-item>
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

import { rootPath } from '../stats';
import { mapState } from 'vuex';

export default {
  data() {
    const path = rootPath;
    return {
      activeIndex: '1',
      activeIndex2: '1',
      isCollapse: false,
      moreText: '更多',
      routes: {
        enemydata: {
          path: path + '/enemydata',
          text: '关卡数据'
        },
        computer: {
          path: path + '/computer',
          text: '经验计算'
        },
        home: {
          path: path + '/',
          text: 'Arknights Data'
        },
        customtheme: {
          path: path + '/customtheme',
          text: '家具'
        },
        items: {
          path: path + '/items',
          text: '材料'
        }
      }
    };
  },
  computed: {
    ...mapState(['short'])
  },
  watch: {
    '$route.path': function(val, oldVal) {
      //修复移动端菜单不回收的bug
      setTimeout(() => {
        this.$refs['nav-menu'].close('2');
      }, 100);

      const arr = Object.keys(this.routes);
      let i = 0;
      while (i < arr.length) {
        const temp = arr[i];
        if (new RegExp(temp).test(this.$route.path) && temp !== 'enemydata') {
          this.moreText = this.routes[arr[i]].text;
          return;
        }
        console.log(temp, this.$route.path);
        i++;
      }
      this.moreText = '更多';
    }
  }
};
</script>



