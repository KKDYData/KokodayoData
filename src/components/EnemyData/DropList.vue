<template>
  <div class="map-drop-container all">
    <p class="predefine-title">
      <span style="border-bottom: 1px solid #313131">{{title}}</span>
    </p>
    <div class="map-common-droplist">
      <div v-for="item in list" :key="(item.data.itemId)">
        <item-viewer
          :targetStage="targetStage"
          :short="short"
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

export default {
  components: {
    ItemViewer
  },
  props: {
    list: {
      required: true,
      type: Array
    },
    short: {
      required: true,
      type: Boolean
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
  }
}

.predefine-title {
  color: #828282
}
</style>
