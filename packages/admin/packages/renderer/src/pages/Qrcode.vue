<template>
  <div class="qrcode-container">
    <div>请用 kkdy 小程序扫描下方二维码进行登录</div>
    <ElImage v-if="!isLogin" :src="qrcode" />
    <p v-else>登录成功 3s 后回到首页</p>
  </div>
</template>

<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations'
import { ApiUser, setXToken } from '@kkdy/api'
import { ElImage } from 'element-plus'
import { useRouter } from 'vue-router'

let timer = 0

ref: reqcount = 0
ref: token = ''
ref: qrcodeKey = ''
ref: qrcode = useQRCode($qrcodeKey)
ref: isLogin = false

const router = useRouter()

ApiUser.GetQrcodeToken()
  .then(res => {
    const resData = res.data
    if (resData.ok) {
      token = resData.result.token
      qrcodeKey = resData.result.qrcodeKey
      startGetWxIdInterval()
    }
  })
  .catch(error => {
    console.log(error)
  })

function startGetWxIdInterval() {
  timer = (setInterval(async () => {
    if (reqcount < 60 * 5) {
      // 一分钟
      reqcount++
      const { data } = await ApiUser.GetLoginToken({ qrcodeKey, token })
      console.log(data)

      if (!data.ok) {
        // TODO add error code
        // 会提示过期 code -1002
        console.error(data.code)
        return
      }

      if (data.result) {
        clearInterval(timer)
        isLogin = true
        setXToken(data.result)

        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        console.log('match wxId failed:', data.result)
      }
    } else {
      clearInterval(timer)
      console.log('error: request wxId failed')
      // TODO 弹框提示登录失败，等个vf-modal的demo
      console.log('登录失败，请重试')
    }
  }, 1500) as unknown) as number
}
</script>
