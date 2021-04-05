<template>
  <view class="index">
    <view class="text-gray-900 text-2xl">hello KOKODAYO</view>
    <NumberDisplay />
    <NumberSubmit />
    <view class="mt-10">
      <button class="p-3 text-2xl" @tap="qrLogin">扫码登录</button>
    </view>
  </view>
</template>

<script lang="ts">
import NumberDisplay from '../../components/NumberDisplay.vue'
import NumberSubmit from '../../components/NumberSubmit.vue'
import Taro from '@tarojs/taro'
import { onMounted } from 'vue'
import { ApiUser } from '@kkdy/api-taro'

export default {
  name: 'Index',
  components: {
    NumberDisplay,
    NumberSubmit,
  },
  setup() {
    let openid = ''

    onMounted(async () => {
      // const res = await Taro.login()
      const res = await Taro.cloud.callFunction({
        name: 'login',
      })
      if (res.result && typeof res.result === 'object') {
        openid = res.result.openid
      }
      console.log('res', res)
    })

    const qrLogin = async () => {
      console.log('qrcode start')

      const { result: qrcodeKey } = await Taro.scanCode({
        scanType: ['qrCode'],
      })
      // const { data } = a
      const res = await ApiUser.DecodeQrcode({ qrcodeKey })
      if (!res.data.ok) {
        console.error(res.data.msg)
        return
      }
      const { type, token } = res.data.result

      if (type === 'loginQrcode') {
        const { data: crossLoginRes } = await ApiUser.CrossLogin({
          qrcodeKey,
          wxId: openid,
          token,
        })
        if (!crossLoginRes.ok) {
          console.error(crossLoginRes.message)
          return
        }

        console.log('ok')
      }

      console.log('qrcode result', res.data.result)
    }

    return {
      qrLogin,
    }
  },
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
