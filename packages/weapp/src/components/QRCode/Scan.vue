<template>
  <view
    :style="{
      height: status.statusBarHeight + 'px',
      marginTop: status.safeArea.top - 10 + 'px',
    }"
    class="flex items-center"
  >
    <button
      class="text-xs clean-button"
      style="background: transparent"
      @tap="qrLogin"
    >
      <KIcon name="iconsaoma" :size="24" />
    </button>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'

const status = Taro.getSystemInfoSync()

import { User } from '@kkdy/api-taro'
import { onMounted } from '@vue/runtime-core'
let openid = ''

onMounted(async () => {
  // const res = await Taro.login()
  const res = await Taro.cloud.callFunction({
    name: 'login',
  })
  if (res.result && typeof res.result === 'object') {
    openid = res.result.openid
  }
  console.log('wechat login', res)
})

const qrLogin = async () => {
  console.log('qrcode start')

  const { result: qrcodeKey } = await Taro.scanCode({
    scanType: ['qrCode'],
  })
  // const { data } = a
  const res = await User.DecodeQrcode({ qrcodeKey })
  if (!res.data.ok) {
    console.error(res.data.msg)
    return
  }
  const { type, token } = res.data.result

  if (type === 'loginQrcode') {
    const { data: crossLoginRes } = await User.CrossLogin({
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
</script>
