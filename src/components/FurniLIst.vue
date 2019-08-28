<template>
  <div>
    <div class="extra-title" v-if="type === 'extra'">
      <span class="span-underline">可以多次购买的且自动摆放的家具</span>
    </div>
    <div class="furni-list">
      <div class="furni-item" v-for="item in furnis" :key="item.id">
        <div v-if="type !== 'extra'" style="font-size: 14px">
          <span v-if="item.price">
            价格
            <span>{{item.price}}</span>
          </span>
          <span v-else>卖不出</span>
        </div>
        <div v-else style="font-size: 14px">
          <span>数量</span>
          <span>{{item.count}}</span>
        </div>
        <div>
          <item-viewer :item="item" type="FURN"></item-viewer>
        </div>
        <div>
          <span :style="item.name.length > 6 ? 'font-size: 13px': 'font-size: 14px'">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemViewer from './ItemViewer';
export default {
  components: {
    ItemViewer
  },
  props: {
    furnis: {
      required: true
    },
    type: String
  },

  async created() {
    // this.furnis = await Promise.all(this.list.map(key => getFurn(key)));

  }
};
</script>

<style lang="stylus" scoped>
.furni-list {
  display: flex
  flex-wrap: wrap
}

.furni-item {
  max-width: 80px
  margin: 10px
}

.extra-title {
  margin: 20px 0 10px
}
</style>
