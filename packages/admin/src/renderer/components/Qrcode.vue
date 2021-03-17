<template>
  <div class="qrcode-container">
    <div>请用 kkdy 小程序扫描下方二维码进行登录</div>
    <img class="qrcode-img" :src="qrcode" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useQRCode } from '@vueuse/integrations'
import { ApiUser } from '@kkdy/api'

export default defineComponent({
  name: 'Qrcode',
  data () {
    return {
      timer: 0,
      reqcount: 0,
      token: '',
      wxId: '',
      qrcode: ''
    }
  },
  setup() {
    console.log("=== setup ===")

    return {}
  },
  created() {
    console.log("=== created ===")

    ApiUser.GetQrcodeToken()
      .then(res => {
        console.log(res)

        if (res.status === 200) {
          console.log(res.data)
          const resData = res.data
          if (resData.ok) {
            this.token = resData.result
            this.qrcode = useQRCode(this.token)

            this.startGetWxIdInterval()
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    startGetWxIdInterval () {
      this.timer = setInterval(() => {
        if (this.reqcount < 10) {
          this.reqcount++
          ApiUser.GetQrcodeWxId(this.token)
            .then(res => {
              if (res.status === 200) {
                console.log(res.data)
                const resData = res.data
                if (resData.ok) {
                  if (resData.result !== null || this.wxId === resData.result) {
                    clearInterval(this.timer)
                    console.log('match wxId success:', resData.result)
                  } else {
                    // clearInterval(this.timer)
                    console.log('match wxId failed:', resData.result)
                  }
                }
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          clearInterval(this.timer)
          console.log('error: request wxId failed')
          // TODO 弹框提示登录失败，请重试
          console.log('登录失败，请重试')
        }
      }, 1000)
    }
  },
});
</script>

<style lang="scss" scoped>
.qrcode-container {
  div {
    margin: 15px 0;
    text-align: center;
    display: grid;
    justify-content: center;
  }

  img.qrcode-img {
    width: 160px;
    height: 160px;
    margin: 5px auto;
  }
}
</style>
