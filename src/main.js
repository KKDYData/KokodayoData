
import Vue from 'vue';

// import app from './app';

// new Vue(girds).$mount('#app');


import VueRouter from 'vue-router';
import NavMenu from './NavMenu';


Vue.use(VueRouter);

Vue.config.productionTip = false;


// import loadingC from './components/loading';

// const Home = () => ({
//   component: import(/* webpackChunkName: "Home" */'./Home'),
//   loading: loadingC,
//   error: loadingC,
//   delay: 4000,
//   timeout: 5000
// });

const Home = () => import(/* webpackChunkName: "Home" */'./Home');
const Details = () => import(/* webpackChunkName: "Details" */'./Details');
const Computer = () => import(/* webpackChunkName: "Computer" */'./Computer');
// // const EditHome = () => import(/* webpackChunkName: "EditHome" */'./EditHome');
// // const EditPanel = () => import(/* webpackChunkName: "EditPanel" */'./EditPanel');



const routes = [
  // { path: '/EditHome', component: EditHome },
  // { path: '/EditPanel', component: EditPanel },
  // { path: '/EditPanel/:name', component: EditPanel },
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



