<template>
  <div>
    <div class="extra-title" v-if="type === 'extra'">
      <span class="span-underline">可自动摆放多个的家具</span>
    </div>
    <div class="furni-list">
      <div class="furni-item" v-for="item in furnis" :key="item.id">
        <div v-if="type !== 'extra'" style="font-size: 14px">
          <span v-if="item.price">
            <el-image
              style="vertical-align: bottom"
              :src="path + 'others/customCoin_optimized.png'"
            ></el-image>
            <span>{{item.price}}</span>
          </span>
          <span v-else-if="type !== 'BULK'">卖不出</span>
        </div>
        <div v-else style="font-size: 14px;">
          <span>数量</span>
          <span>{{item.count}}</span>
        </div>
        <div>
          <item-viewer :item="item" type="FURN"></item-viewer>
        </div>
        <div>
          <span :style="item.name.length > 5 ? 'font-size: 13px': 'font-size: 14px'">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemViewer from './ItemViewer';
import { path } from '../utils/listVer';
export default {
  components: {
    ItemViewer
  },
  data() {
    return {
      path
    };
  },
  props: {
    furnis: {
      required: true
    },
    type: String
  },
  methods: {
    check(v) {
      if (/饰牌/.test(v)) {
        const temp = v.split('');
        temp.splice(2, 0, '<br/>');
        return temp.join('');
      }
      return v;
    }
  }

};
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
</style>
