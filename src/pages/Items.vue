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
import Vue from 'vue'
import { Loading } from 'element-ui'
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
  width: 100%
  min-height: 80vh
  display: flex
  justify-content: center
}

@media screen and (max-width: 450px) {
  .item-list-panel {
    width: 100vw
    padding: vw(30)
    box-sizing: border-box
  }
}
</style>
