<template>
  <div class="home-wrapper" style>
    <details-layout></details-layout>
  </div>
</template>
<script>
// import FilterButtonGroup from './components/FilterButtonGroup';
import loadingC from './components/loading';

const DetailsLayout = () => ({
  component: import(/* webpackChunkName: "DetailsLayout" */ './components/DetailsLayout'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  components: {
    'details-layout': DetailsLayout
  },
  data() {
    return {
      short: false,
      data: [],
      load: false
    };
  }
};
</script>