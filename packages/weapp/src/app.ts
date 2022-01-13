import { createApp } from 'vue'
import Taro from '@tarojs/taro'
import { createPinia } from 'pinia'
import 'windi.css'

Taro.cloud.init({
  env: 'kkdy-cloud-tu6xc',
  traceUser: true,
})

import './app.styl'
import './index.css'
import { KIcon } from '/@/components/Icon'

const app = createApp({
  onShow() {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

app.use(createPinia())
app.component('KIcon', KIcon)
// app.use(Input).use(Icon)

export default app
