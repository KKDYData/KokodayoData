import { Browser } from './components/utils';
if (Browser.name === 'IE') {
  document.body.querySelector('#app').innerHTML = '不支持IE，请使用现代浏览器。';

}

import Vue from 'vue';
import VueRouter from 'vue-router';
import NavMenu from './NavMenu';

Vue.use(VueRouter);

Vue.config.productionTip = false;

const Home = () => import(/* webpackChunkName: "Home" */'./Home');
const Details = () => import(/* webpackChunkName: "Details" */'./Details');
const Computer = () => import(/* webpackChunkName: "Computer" */'./Computer');
const EnemyData = () => import(/* webpackChunkName: "EnemyData" */'./EnemyData');

import Mode from './stats';

const isDev = process.env.NODE_ENV === 'development';

const path = isDev ? '/' : Mode + '/';


const routes = [
  { path: path, component: Home },
  { path: path + 'computer', component: Computer },
  { path: path + 'details/:name', component: Details },
  { path: path + 'enemydata', component: EnemyData }
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

const swPath = isDev ? '/sw.js' : Mode + '/sw.js';


if ('serviceWorker' in navigator && !isDev) {
  window.addEventListener('load', async () => {
    const { Workbox } = await import('workbox-window');
    const wb = new Workbox(swPath);

    wb.register();
  });
}