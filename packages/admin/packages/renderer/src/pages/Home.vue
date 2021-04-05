<template>
  <p>
    For a guide and recipes on how to configure / customize this project,<br />
    check out the
    <a
      href="https://github.com/cawa-93/vite-electron-builder"
      rel="noopener"
      target="_blank"
      >vite-electron-builder documentation</a
    >.
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"
      >Vite Documentation</a
    >
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <hr />
  <ElButton @click="getUserInfo">get UserInfo</ElButton>
  <p>{{ data }}</p>
</template>

<script lang="ts" setup>
import { ApiUser } from '@kkdy/api'
import { ElButton } from 'element-plus'

ref: count = 0

ref: data = null as any

const getUserInfo = async () => {
  const { data: res } = await ApiUser.GetUserInfo()
  if (!res.ok) {
    alert(res.msg)
  } else {
    data = res.result
  }
}
ApiUser
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
