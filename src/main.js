
import Vue from 'vue';

// import app from './app';

// new Vue(girds).$mount('#app');


import VueRouter from 'vue-router';
import NavMenu from './NavMenu';


Vue.use(VueRouter);

Vue.config.productionTip = false;


const Home = () => import(/* webpackChunkName: "Home" */'./Home');
const Details = () => import(/* webpackChunkName: "Details" */'./Details');
const Computer = () => import(/* webpackChunkName: "Computer" */'./Computer');


const routes = [
  { path: '/', component: Home },
  { path: '/computer', component: Computer },
  { path: '/details/:name', component: Details }
];
const router = new VueRouter({
  routes,

});


new Vue({
  mode: 'history',
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
}).$mount('#app');



