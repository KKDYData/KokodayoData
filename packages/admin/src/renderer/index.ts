import { createApp } from 'vue'
import App from './App.vue'
import router from '/@/router'
import 'virtual:windi.css'
import 'element-plus/lib/theme-chalk/index.css'

createApp(App)
  .use(router)
  .mount('#app')
