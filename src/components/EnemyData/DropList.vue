<template>
  <div class="map-drop-container all">
    <p class="predefine-title">
      <span class="span-underline">{{ title }}</span>
    </p>
    <div class="map-common-droplist">
      <div v-for="item in list" :key="item.data ? item.data.itemId : item.itemId">
        <item-viewer
          :target-stage="targetStage"
          :style="{margin: '10px'}"
          :type="item.type"
          :item="item.data ? item.data : item"
          :list-mode="listMode"
        />
      </div>
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
    targetStage: String,
    listMode: {
      default: false,
      type: Boolean
    }
  }
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
