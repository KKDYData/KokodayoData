<template>
  <div v-loading.fullscreen.lock="true"></div>
</template>
<script>
import { Loading } from 'element-ui';
import Vue from 'vue';
Vue.use(Loading);

export default {};
</script>
