import Vue from 'vue';
import VueRouter from 'vue-router';
import { rootPath } from '@/stats';


Vue.use(VueRouter);

const Home = () => import(/* webpackChunkName: "Home" */'@/pages/Home');
const Details = () => import(/* webpackChunkName: "Details" */'@/pages/Details');
const Computer = () => import(/* webpackChunkName: "Computer" */'@/pages/Computer');
const EnemyData = () => import(/* webpackChunkName: "Enemy" */'@/pages/Enemy');
const CustomTheme = () => import(/* webpackChunkName: "CustomTheme" */'@/pages/CustomTheme');
const Items = () => import(/* webpackChunkName: "Items" */'@/pages/Items');
const Skins = () => import(/* webpackChunkName: "Skins" */'@/pages/Skins');



const routes = [
  { path: rootPath, component: Home },
  { path: rootPath + '/computer', component: Computer },
  { path: rootPath + '/details/:name', component: Details },
  { path: rootPath + '/enemydata', component: EnemyData },
  { path: rootPath + '/enemydata/:map', component: EnemyData },
  { path: rootPath + '/customtheme', component: CustomTheme },
  { path: rootPath + '/items', component: Items },
  { path: rootPath + '/skins', component: Skins },
];
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

export {
  router
};
