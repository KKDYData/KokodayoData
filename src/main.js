
import Vue from 'vue';

// import app from './app';

// new Vue(app).$mount('#app');



import VueRouter from 'vue-router';


Vue.use(VueRouter);

Vue.config.productionTip = false;


const Home = () => import(/* webpackChunkName: "Home" */'./Home');
const Details = () => import(/* webpackChunkName: "Details" */'./Details');
const Computer = () => import(/* webpackChunkName: "Computer" */'./Computer');
const EditHome = () => import(/* webpackChunkName: "EditHome" */'./EditHome');
// const EditPanel = () => import(/* webpackChunkName: "EditPanel" */'./EditPanel');



const routes = [
  { path: '/EditHome', component: EditHome },
  // { path: '/EditPanel', component: EditPanel },
  // { path: '/EditPanel/:name', component: EditPanel },
  { path: '/', component: Home },
  { path: '/computer', component: Computer },
  { path: '/details/:name', component: Details }
];
const router = new VueRouter({
  routes
});


new Vue({
  mode: 'history',
  router
}).$mount('#app');



