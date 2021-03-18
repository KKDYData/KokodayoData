<template>
  <nav class="divide-x">
    <router-link class="px-2" to="/"> Home </router-link>
    <router-link class="px-2" to="/about"> About </router-link>
    <router-link class="px-2" to="/qrcode"> Qrcode </router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppNavigation'
})
</script>

<style scoped>
nav {
  display: flex;
  gap: 1em;
  justify-content: center;
}
</style>
