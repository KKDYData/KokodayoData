<template>
  <view class="index">
    <view class="text-gray-900 text-2xl">hello KOKODAYO</view>
    <NumberDisplay />
    <NumberSubmit />
    <view class="mt-10">
      <button class="text-2xl p-3" @tap="qrLogin">扫码登录</button>
    </view>
  </view>
</template>

<script lang="ts">
import NumberDisplay from '../../components/NumberDisplay.vue'
import NumberSubmit from '../../components/NumberSubmit.vue'
import Taro from '@tarojs/taro'
import { onMounted } from 'vue'
export default {
  name: 'Index',
  components: {
    NumberDisplay,
    NumberSubmit
  },
  setup() {
    onMounted(async () => {
      // const res = await Taro.login()
      const res = await Taro.cloud.callFunction({
        name: 'login'
      })
      console.log('res', res)
    })

    const qrLogin = async () => {
      console.log('qrcode start')

      const res = await Taro.scanCode({ scanType: ['qrCode'] }).catch(err => {
        console.log('errr', err)
        return err
      })
      console.log('qrcode result', res)
    }

    return {
      qrLogin
    }
  }
}
</script>

<style>
.index {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
