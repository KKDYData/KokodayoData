import '@/styles/index.styl'
import '@/styles/animation.styl'
import '@/styles/cover.styl'
import 'swiper/css/swiper.min.css'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import store from '@/store'
import App from './App'
import { router } from './router'
import { Data } from '@kkdy/api'

Vue.use(VueRouter)
Vue.use(VueMeta)

Data.ListMap()

Vue.config.productionTip = false

const isDev = process.env.NODE_ENV === 'development'

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
!isDev &&
  import(/* webpackChunkName: "loadSw" */ './loadSw').then((res) => {
    res.default()
  })
store.dispatch('setDropList')
store.dispatch('Base/getInfo', { stamp: +new Date(process.env.VERSION) })
