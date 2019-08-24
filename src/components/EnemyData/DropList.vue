<template>
  <div class="map-drop-container all">
    <div class="drop-list-title">
      <span>{{title}}</span>
    </div>
    <div class="map-common-droplist">
      <div v-for="item in list" :key="(item.data.itemId + item.dropType)">
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

.drop-list-title {
  span {
    color: #525252
    display: inline-block
    width: 30%
    border-bottom: 1px solid #828282
  }
}
</style>
