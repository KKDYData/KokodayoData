<template>
  <div class="home-wrapper">
    <details-layout></details-layout>
  </div>
</template>
<script>
import loadingC from '../components/base/Loading';

const DetailsLayout = () => ({
  component: import(
    /* webpackChunkName: "DetailsLayout" */ '../components/DetailsLayout'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  metaInfo: {
    titleTemplate: '%s | 干员详情 | 明日方舟'
  },
  components: {
    'details-layout': DetailsLayout
  },
  data() {
    return {
      data: [],
      load: false
    };
  }
};
</script>
