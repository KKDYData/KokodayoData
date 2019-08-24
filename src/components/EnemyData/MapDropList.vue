<template>
  <my-slide-title :short="short" title="掉落" :init-value="true">
    <div class="map-drop-container-wrapper">
      <div class="map-drop-list-wrapper">
        <drop-list
          class="flex-list"
          v-if="firstDrop.length > 0"
          :list="firstDrop"
          :short="short"
          title="首次掉落"
          :target-stage="targetStage"
        ></drop-list>
        <drop-list
          class="flex-list"
          v-if="commonDrop.length > 0"
          :list="commonDrop"
          :short="short"
          title="常规掉落"
          :target-stage="targetStage"
        ></drop-list>
        <drop-list
          class="flex-list"
          v-if="rarityDrop.length > 0"
          :list="rarityDrop"
          :short="short"
          title="稀有掉落"
          :target-stage="targetStage"
        ></drop-list>
      </div>
      <drop-list
        v-if="almostDrop.length > 0"
        :list="almostDrop"
        :short="short"
        title="概率掉落"
        :target-stage="targetStage"
      ></drop-list>
    </div>
  </my-slide-title>
</template>

<script>
import DropList from './DropList';
import MySlideTitle from '../MySlideTilte';

export default {
  components: {
    MySlideTitle,
    DropList,
  },
  props: {
    dropInfo: {
      required: true
    },
    short: {
      required: true
    },
    targetStage: String
  },
  computed: {
    firstDrop() {
      return this.dropInfo.filter(el => el.dropType === 1);
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
