<template>
  <div>
    <div v-if="type === 'extra'" class="extra-title">
      <span class="span-underline">可自动摆放多个的家具</span>
    </div>
    <div class="furni-list">
      <div v-for="item in furnis" :key="item.id" class="furni-item">
        <div v-if="type !== 'extra'" style="font-size: 14px">
          <div v-if="item.price" class="customCoin" :style="{backgroundImage: `url('${path}others/customCoin_optimized.png')`}" />
          <span v-if="item.price">
            {{ item.price }}
          </span>
          <span v-else-if="type !== 'BULK'">卖不出</span>
        </div>
        <div v-else style="font-size: 14px;">
          <span>数量</span>
          <span>{{ item.count }}</span>
        </div>
        <div>
          <item-viewer :item="item" type="FURN" />
        </div>
        <div>
          <span :style="item.name.length > 5 ? 'font-size: 13px': 'font-size: 14px'">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemViewer from '../ItemViewer'
import { path } from '../../utils/listVer'
export default {
  components: {
    ItemViewer
  },
  props: {
    furnis: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      path
    }
  },
  methods: {
    check(v) {
      if (/饰牌/.test(v)) {
        const temp = v.split('')
        temp.splice(2, 0, '<br/>')
        return temp.join('')
      }
      return v
    }
  }

}
</script>

<style lang="stylus" scoped>
.furni-list {
  display: flex
  flex-wrap: wrap
  min-height: 140px
}

.furni-item {
  max-width: 80px
  margin: 10px
}

.extra-title {
  margin: 20px 0 10px
}

.customCoin{
  display inline-block
  width 14px;
  height 14px;
  background-size contain
  background-repeat no-repeat
}
</style>
