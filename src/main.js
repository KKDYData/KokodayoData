import { Browser } from './utils';
if (Browser().name === 'IE') {
  document.body.querySelector('#app').innerHTML = '不支持IE，请使用现代浏览器。';
}

import './style.css';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import NavMenu from './NavMenu';
import Mode from './stats';

Vue.use(VueRouter);
Vue.use(VueMeta);

Vue.config.productionTip = false;

const Home = () => import(/* webpackChunkName: "Home" */'./Home');
const Details = () => import(/* webpackChunkName: "Details" */'./Details');
const Computer = () => import(/* webpackChunkName: "Computer" */'./Computer');
const EnemyData = () => import(/* webpackChunkName: "EnemyData" */'./EnemyData');


const isDev = process.env.NODE_ENV === 'development';

const path = isDev ? '/' : Mode + '/';


const routes = [
  { path: path, component: Home },
  { path: path + 'computer', component: Computer },
  { path: path + 'details/:name', component: Details },
  { path: path + 'enemydata', component: EnemyData },
  { path: path + 'enemydata/:map', component: EnemyData }
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
  components: {
    'nav-menu': NavMenu
  },
  template: `
  <div id="app">
  <nav-menu />
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
    </div>
    `
});


!isDev && import(/* webpackChunkName: "loadSw" */'./loadSw').then(res => {
  res.default();
});
