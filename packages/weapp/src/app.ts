import { createApp } from 'vue'
import store from './store'
import Taro from '@tarojs/taro'
import 'windi.css'

Taro.cloud.init({
  env: 'kkdy-cloud-tu6xc',
  traceUser: true,
})

import './app.styl'
// import './tailwind.css'

const App = createApp({
  onShow(options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(store)

export default App
