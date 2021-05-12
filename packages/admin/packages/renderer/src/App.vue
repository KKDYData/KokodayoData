<template>
  <div class="flex flex-row h-screen">
    <side-menu class="flex-grow-0 w-auto" />
    <div class="page-content">
      <!-- <div class="text-center">
        <ElImage alt="Vue logo" class="inline-block" src="assets/logo.png" />
      </div> -->
      <!-- <app-navigation /> -->
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideMenu from '/@/components/SideMenu.vue'
// import AppNavigation from '/@/components/AppNavigation.vue'
// import { ElImage } from 'element-plus'
export default defineComponent({
  name: 'App',
  components: {
    SideMenu,
    // AppNavigation,
    // ElImage,
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
  /* margin-top: 60px; */
}

.page-content {
  @apply flex-grow overflow-auto whitespace-nowrap;
  max-width: calc(100% - 9rem);
}

.page-content::-webkit-scrollbar {
  display: none;
}
</style>
