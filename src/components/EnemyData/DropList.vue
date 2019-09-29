<template>
  <div class="map-drop-container all">
    <p class="predefine-title">
      <span class="span-underline">{{title}}</span>
    </p>
    <div class="map-common-droplist">
      <div v-for="item in list" :key="(item.data.itemId)">
        <item-viewer
          :targetStage="targetStage"
          :style="{margin: '10px'}"
          :type="item.type"
          :item="item.data"
        ></item-viewer>
      </div>
    </div>
  </div>
</template>

<script>
import ItemViewer from '../ItemViewer';
import { mapState } from 'vuex';

export default {
  components: {
    ItemViewer
  },
  computed: {
    ...mapState(['short']),
  },
  props: {
    list: {
      required: true,
      type: Array
    },
    title: {
      type: String
    },
    targetStage: String
  }
};
</script>

<style lang="stylus" scoped>
.map-drop-container {
  &.common {
    min-width: 200px
  }

  &.all {
    flex-grow: 1
  }

  .map-common-droplist {
    display: flex
    flex-wrap: wrap
    align-items: center
  }
}
</style>
