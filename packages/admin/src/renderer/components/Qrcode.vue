<template>
  <div class="qrcode-container">
    <div>请用 kkdy 小程序扫描下方二维码进行登录</div>
    <img class="qrcode-img" :src="qrcode" />
  </div>
</template>

<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations'
import { ApiUser } from '@kkdy/api'

let timer = null as NodeJS.Timeout

ref: reqcount = 0
ref: token = ''
ref: wxId = ''
ref: qrcode = useQRCode($token)

ApiUser.GetQrcodeToken()
  .then((res) => {
    const resData = res.data
    if (resData.ok) {
      token = resData.result
      startGetWxIdInterval()
    }
  })
  .catch((error) => {
    console.log(error)
  })

function startGetWxIdInterval() {
  timer = setInterval(async () => {
    if (reqcount < 60) { // 一分钟
      reqcount++
      const { data } = await ApiUser.GetQrcodeWxId({ token })
      console.log(data)

      if (!data.ok) {
        // TODO add error code
        console.error(data.code)
        return
      }

      if (data.result !== 'null') {
        clearInterval(timer)
        wxId = data.result
        console.log('match wxId success:', data.result)
      } else {
        console.log('match wxId failed:', data.result)
      }
    } else {
      clearInterval(timer)
      console.log('error: request wxId failed')
      // TODO 弹框提示登录失败，等个vf-modal的demo
      console.log('登录失败，请重试')
    }
  }, 1000)
}
</script>
