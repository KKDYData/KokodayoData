<template>
  <div class="map-drop-container-wrapper">
    <div class="map-drop-list-wrapper">
      <drop-list
        v-if="firstDrop.length > 0"
        class="flex-list"
        :list="firstDrop"
        title="首次掉落"
        :target-stage="targetStage"
      />
      <drop-list
        v-if="commonDrop.length > 0"
        class="flex-list"
        :list="commonDrop"
        title="常规掉落"
        :target-stage="targetStage"
      />
      <drop-list
        v-if="rarityDrop.length > 0"
        class="flex-list"
        :list="rarityDrop"
        title="稀有掉落"
        :target-stage="targetStage"
      />
    </div>
    <drop-list
      v-if="almostDrop.length > 0"
      :list="almostDrop"
      title="概率掉落"
      :target-stage="targetStage"
    />
  </div>
</template>

<script>
import DropList from './DropList';
import { mapState } from 'vuex';

export default {
  components: {
    DropList,
  },
  props: {
    dropInfo: {
      type: Array,
      required: true
    },
    targetStage: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState(['short']),
    firstDrop() {
      return this.dropInfo.filter(el => el.dropType === 1 || el.dropType === 8);
    },
    commonDrop() {
      return this.dropInfo.filter(el => el.dropType === 2);
    },
    rarityDrop() {
      return this.dropInfo.filter(el => el.dropType === 3);
    },
    almostDrop() {
      return this.dropInfo.filter(el => el.dropType === 4);
    },
  }
};
</script>

<style lang="stylus" scoped>
.map-drop-list-wrapper {
  display: flex
}

@media screen and (max-width: 1000px) {
  .map-drop-container-wrapper {
    margin-top: 10px
  }
}

@media screen and (max-width: 500px) {
  .map-drop-container-wrapper {
    margin-top: 0px
  }

  .map-drop-list-wrapper {
    display: flex
    flex-wrap: wrap
  }

  .flex-list {
    width: 100%
  }
}
</style>
