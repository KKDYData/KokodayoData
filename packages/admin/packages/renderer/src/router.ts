import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/@/pages/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/about',
    name: 'About',
    component: () => import('/@/pages/About.vue')
  }, // Lazy load route component
  {
    path: '/qrcode',
    name: 'Qrcode',
    component: () => import('/@/components/Qrcode.vue')
  }
]

export default createRouter({
  routes,
  history: createWebHashHistory()
})
