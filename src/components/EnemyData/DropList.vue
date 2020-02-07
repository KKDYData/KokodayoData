<template>
  <div class="map-drop-container all">
    <p class="predefine-title">
      <span class="span-underline">{{ title }}</span>
    </p>
    <div class="map-common-droplist">
      <item-viewer
        v-for="item in list"
        :key="item.data ? item.data.itemId : item.itemId"
        :target-stage="targetStage"
        :type="item.type"
        :item="item.data ? item.data : item"
        :list-mode="listMode"
      />
    </div>
  </div>
</template>

<script>
import ItemViewer from '../ItemViewer'
import { mapState } from 'vuex'

export default {
  components: {
    ItemViewer
  },
  props: {
    list: {
      required: true,
      type: Array
    },
    title: {
      default: null,
      type: String
    },
    targetStage: {
      default: null,
      type: String
    },
    listMode: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapState(['short']),
  },

}
</script>

<style lang="stylus" scoped>
.map-drop-container {
  max-width: 800px

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
