import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/@/pages/Home.vue'
import CharList from '/@/pages/CharList.vue'
import CharDetail from '/@/pages/CharDetail.vue'
import Qrcode from '/@/pages/Qrcode.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/about',
    name: 'About',
    component: () => import('/@/pages/About.vue'),
  }, // Lazy load route component
  {
    path: '/charlist',
    name: 'CharList',
    component: CharList,
  },
  {
    path: '/chardetail/:name',
    name: 'CharDetail',
    component: CharDetail,
  },
  {
    path: '/qrcode',
    name: 'Qrcode',
    component: Qrcode, //() => import('./pages/Qrcode.vue'),
  },
]

export default createRouter({
  routes,
  history: createWebHashHistory(),
})
