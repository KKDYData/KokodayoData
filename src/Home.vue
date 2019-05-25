<template>
  <div class="home-wrapper" style>
    <nav-menu></nav-menu>
    <home-layout v-if="load" :profileList="data"></home-layout>
  </div>
</template>
<script>
import FilterButtonGroup from './components/FilterButtonGroup';
import HomeLayout from './components/homeLayout';
import { getProfileList } from './components/utils';
import NavMenu from './NavMenu';

export default {
  components: {
    'filter-group': FilterButtonGroup,
    'home-layout': HomeLayout,
    'nav-menu': NavMenu
  },
  data() {
    return {
      short: false,
      data: [],
      load: false
    };
  },
  mounted() {
    console.log('???');
    this.getData().then(data => {
      this.data = data;
      this.load = true;
    });
  },
  methods: {
    getData() {
      return getProfileList().then(source => {
        source.forEach((el, index) => {
          el.index = index;
          el.tagHit = 0;
        });
        return source.filter(el => el.position).reverse();
      });
    }
  }
};
</script>


