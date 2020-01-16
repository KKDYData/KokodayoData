<template>
  <div class="item-list-panel">
    <drop-list v-if="items.length > 0" :list="items" title="材料" :list-mode="true" />
  </div>
</template>

<script>
import DropList from '../components/EnemyData/DropList'
import { getItem } from '../utils/fetch'
import list from '../utils/items.json'

export default {
  components: {
    DropList
  },
  data() {
    return {
      items: []
    }
  },
  mounted() {
    Promise.all(list.map(el => getItem(el))).then(arr => {
      this.items = arr
    })
  }
}
</script>

<style lang="stylus" scoped>
.item-list-panel {
  max-width: 800px
  margin: 10px auto
}

@media screen and (max-width: 800px) {
  .item-list-panel {
    max-width: auto
    padding: 5vw
  }
}

@media screen and (max-width: 400px) {
  .item-list-panel {
    width: 300px
  }
}
</style>
