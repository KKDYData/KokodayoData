<template>
  <div class="map-drop-container all">
    <my-title :title="title" :style="short ? 'margin: 20px 0 10px' : ''"></my-title>
    <div class="map-common-droplist">
      <div v-for="item in list" :key="(item.data.itemId + item.dropType)">
        <item-viewer :style="{margin: '10px'}" :type="item.type" :item="item.data"></item-viewer>
      </div>
    </div>
  </div>
</template>

<script>
import MyTitle from './components/MyTitle';
import ItemViewer from './components/ItemViewer';

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
  margin-bottom: 10px;

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
