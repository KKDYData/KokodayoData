import './style.styl';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import NavMenu from './NavMenu';
import Mode from './stats';
import store from './store';

Vue.use(VueRouter);
Vue.use(VueMeta);

Vue.config.productionTip = false;

const Home = () => import(/* webpackChunkName: "Home" */'./Home');
const Details = () => import(/* webpackChunkName: "Details" */'./Details');
const Computer = () => import(/* webpackChunkName: "Computer" */'./Computer');
const EnemyData = () => import(/* webpackChunkName: "Enemy" */'./Enemy');
const Footer = () => import(/* webpackChunkName: "EnemyData" */'./Footer');
const CustomTheme = () => import(/* webpackChunkName: "CustomTheme" */'./CustomTheme');
const Items = () => import(/* webpackChunkName: "Items" */'./Items');

const isDev = process.env.NODE_ENV === 'development';
const path = isDev ? '/' : Mode + '/';

const routes = [
  { path: path, component: Home },
  { path: path + 'computer', component: Computer },
  { path: path + 'details/:name', component: Details },
  { path: path + 'enemydata', component: EnemyData },
  { path: path + 'enemydata/:map', component: EnemyData },
  { path: path + 'customtheme', component: CustomTheme },
  { path: path + 'items', component: Items },
];
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: {
    NavMenu,
    Footer
  },
  template: `
    <div id="app">
      <nav-menu />
      <transition name="fade" mode="out-in">
        <router-view class="view"></router-view>
      </transition>
      <Footer />
    </div>
  `
});

!isDev && import(/* webpackChunkName: "loadSw" */'./loadSw').then(res => {
  res.default();
});

store.dispatch('setDropList');
store.dispatch('setStageTree');
