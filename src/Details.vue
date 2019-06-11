<template>
  <div class="home-wrapper" style>
    <home-layout></home-layout>
  </div>
</template>
<script>
// import FilterButtonGroup from './components/FilterButtonGroup';
import HomeLayout from './components/DetailsLayout';

export default {
  components: {
    'home-layout': HomeLayout
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