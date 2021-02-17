<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Socket />
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import Socket from './components/Socket.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    Socket
  }
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
