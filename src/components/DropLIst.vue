<template>
  <div class="map-drop-container all">
    <my-title :title="title" style="margin: 10px 0"></my-title>
    <div class="map-common-droplist">
      <div v-for="item in list" :key="(item.data.itemId + item.dropType)">
        <item-viewer :short="short" :style="{margin: '10px'}" :type="item.type" :item="item.data"></item-viewer>
      </div>
    </div>
  </div>
</template>

<script>
import MyTitle from './MyTitle';
import ItemViewer from './ItemViewer';

export default {
  components: {
    MyTitle,
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
    }
  }
};
</script>

<style lang="stylus" scoped>
.map-drop-container {
  &.common {
    min-width: 200px;
  }

  &.all {
    flex-grow: 1;
  }

  .map-common-droplist {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
