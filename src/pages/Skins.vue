<template>
  <div>
    <p>hello</p>

    <div v-if="groups">
      <div v-for="group in groups" :key="group">{{group}}</div>
      <filter-button-group :filters="groups" label="分类"></filter-button-group>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import store from '../store';
import { mapState } from 'vuex';
import FilterButtonGroup from '../components/base/FilterButtonGroup';
import Loading from '../components/base/Loading';

store.dispatch('setExtraSkins');
export default {
  components: {
    FilterButtonGroup,
    Loading
  },
  mounted() {
    console.log(this.extraSkins);
  },
  computed: {
    ...mapState(['extraSkins']),
    groups() {
      if (!this.extraSkins) return [];
      const set = new Set(this.extraSkins.map(({ displaySkin }) => displaySkin.skinGroupName));
      return [...set].map(el => ({ key: el, text: el }));
    }
  }
};
</script>

<style lang="stylus" scoped></style>
