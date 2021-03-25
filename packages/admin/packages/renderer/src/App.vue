<template>
  <div class="text-center">
    <ElImage alt="Vue logo" class="inline-block" src="assets/logo.png" />
  </div>
  <app-navigation />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppNavigation from '/@/components/AppNavigation.vue'
import { ElImage } from 'element-plus'
export default defineComponent({
  name: 'App',
  components: {
    AppNavigation,
    ElImage,
  },
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
