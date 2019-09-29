<template>
  <p class="item-data-container">
    <!-- 似乎是以前物资筹备关卡的名字比较长 -->
    <!-- :style="data.stageId !== 'wk_kc_1' && data.stageId !== 'wk_melee_1' ? '' : 'width: auto'" -->
    <span
      class="item-data-name"
      :style="data.stageCode.length > 5 ? 'font-size: 0.9em': ''"
    >{{data.stageCode}}</span>
    <span class="item-occper">{{data.occPer? occper(data.occPer) : '概率掉落'}}</span>
    <el-tooltip v-if="data.times" class="item-dropInfo" placement="top">
      <div slot="content">
        <color color="hsl(350, 100%, 79%)">{{data.times}}</color>/
        <color color="hsl(193, 78%, 69%)">{{data.quantity}}</color>
        →{{data.rate}}%
      </div>
      <span v-if="data.dropCost">{{data.dropCost}} 理智/个</span>
      <span v-else>{{data.dropCnt}}个/{{data.etCost}}票</span>
    </el-tooltip>
  </p>
</template>

<script>
import { Tooltip } from 'element-ui';
import Vue from 'vue';
Vue.use(Tooltip);

import { occPer_chinese } from '../utils/string';

import Color from './Color';

export default {
  components: {
    Color
  },
  props: {
    data: {
      required: true
    }
  },
  methods: {
    occper(occ) {
      return occPer_chinese[occ];
    },
  }
};
</script>

<style lang="stylus" scoped>
.item-occper {
  background-color: rgb(128, 128, 128)
  color: white
  padding: 0 6px
  border-radius: 3px
}

.item-dropInfo {
  float: right
  cursor: pointer
}

.item-data-name {
  min-width: 50px
  display: inline-block
}

.item-occper {
  background-color: rgb(128, 128, 128)
  color: white
  padding: 0 6px
  border-radius: 3px
}

.item-stage-name {
  width: 50px
  display: inline-block
}
</style>
