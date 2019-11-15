<template>
  <div>
    <p>hello</p>

    <div v-if="groups">
      <div v-for="group in groups" :key="group">{{ group }}</div>
      <filter-button-group :filters="groups" label="分类" />
    </div>
    <loading v-else />
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

  computed: {
    ...mapState(['extraSkins']),
    groups() {
      if (!this.extraSkins) return [];
      const set = new Set(
        this.extraSkins.map(({ displaySkin }) => displaySkin.skinGroupName)
      );
      return [...set].map(el => ({ key: el, text: el }));
    }
  },
  mounted() {
    console.log(this.extraSkins);
  }
};
</script>

<style lang="stylus" scoped></style>
