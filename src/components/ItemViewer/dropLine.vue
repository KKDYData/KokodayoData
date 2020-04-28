<template>
  <p class="item-data-container">
    <!-- 似乎是以前物资筹备关卡的名字比较长 -->
    <!-- :style="data.stageId !== 'wk_kc_1' && data.stageId !== 'wk_melee_1' ? '' : 'width: auto'" -->
    <span
      v-if="data.stageCode"
      class="item-data-name"
      :style="data.stageCode.length > 5 ? 'font-size: 0.9em': ''"
    >{{ data.stageCode }}</span>
    <span
      v-if="data.apCost || data.etCost"
      class="item-occper"
    >{{ data.apCost ? `${data.apCost}理智` : `${data.etCost}票` }}</span>
    <span class="item-occper">{{ data.occPer? occper(data.occPer) : '概率掉落' }}</span>
    <h-tooltip v-if="data.times" class="item-dropInfo" placement="left">
      <div>
        <span v-if="data.dropCost">{{ data.dropCost }} 理智/个</span>
        <span v-else>{{ data.dropCnt }}个/{{ data.etCost }}票</span>
      </div>
      <template v-slot:content>
        <div class="item-drop-detail">
          <color color="hsl(193, 78%, 69%)">{{ data.quantity }}</color>/
          <color color="hsl(350, 100%, 79%)">{{ data.times }}</color>
          →{{ data.rate }}%
        </div>
      </template>
    </h-tooltip>
  </p>
</template>

<script>
import HTooltip from '@/components/base/Tooltip'

import { occPer_chinese } from '../../utils/string'

import Color from '../base/Color'

export default {
  components: {
    Color,
    HTooltip
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    occper(occ) {
      return occPer_chinese[occ]
    }
  }
}
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

.item-drop-detail {
  word-break: keep-all
  white-space: nowrap
}
</style>
