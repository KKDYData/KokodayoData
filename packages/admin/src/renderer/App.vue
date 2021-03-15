<template>
  <img class="mx-auto" alt="Vue logo" src="./assets/logo.png" />
  <app-navigation />
  <router-view />
</template>

<script lang="ts" setup>
import AppNavigation from '/@/components/AppNavigation.vue'
import { ApiUser } from '@kkdy/api'
import { onMounted } from '@vue/runtime-core';
import axios from 'axios'


onMounted(async () => {
  console.log('api', import.meta.env.VITE_API_URL);
  const ins = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  })
  const { data } = await ins.get('')
  console.log('data', data);

  // if (data.ok) {
  //   alert(data.result)
  // }
})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
