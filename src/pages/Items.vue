<template>
  <div
    v-loading="load"
    element-loading-background="rgba(168, 168, 168, 0.1)"
    class="item-list-panel"
  >
    <drop-list v-if="items.length > 0" :list="items" title="材料" :list-mode="true" />
  </div>
</template>

<script>
import DropList from '../components/EnemyData/DropList'
import { getItem } from '../utils/fetch'
import list from '../utils/items.json'
import { Loading } from 'element-ui'
import Vue from 'vue'
Vue.use(Loading)

export default {
  components: {
    DropList
  },
  data() {
    return {
      items: [],
      load: true
    }
  },
  mounted() {
    Promise.all(list.map(el => getItem(el))).then(arr => {
      this.items = arr
      this.$nextTick()
        .then(() => {
          this.load = false
        })

    })
  }
}
</script>

<style lang="stylus" scoped>
.item-list-panel {
  max-width: 800px
  margin: 10px auto
  min-height: 80vh
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
