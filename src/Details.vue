<template>
  <div class="home-wrapper" style>
    <nav-menu></nav-menu>
    <home-layout></home-layout>
  </div>
</template>
<script>
// import FilterButtonGroup from './components/FilterButtonGroup';
import HomeLayout from './components/DetailsLayout';
import NavMenu from './NavMenu';

export default {
  components: {
    'home-layout': HomeLayout,
    'nav-menu': NavMenu
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