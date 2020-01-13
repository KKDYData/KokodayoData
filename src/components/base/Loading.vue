<template>
  <div class="loading-body">
    <div v-loading.lock="true" style="width: 100%"></div>
  </div>
</template>
<script>
import { Loading } from 'element-ui';
import Vue from 'vue';
Vue.use(Loading);

export default {};
</script>

<style scoped>
.loading-body {
  height: 50vh;
  display: flex;
  justify-content: center;
}
</style>

