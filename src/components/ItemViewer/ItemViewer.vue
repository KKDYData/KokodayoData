<template>
  <h-popping
    v-if="data"
    class="item-viewer-container"
    :class="{small}"
    :style="{zIndex}"
    popper-class="item-popover-class"
    placement="right"
    :width="!short? 350 : 250"
    :trigger="isHover"
    :title="data.name"
    :disabled="noPopover"
    :size="drawerSize + '%'"
    @opened="zIndex = 10"
    @closed="zIndex = 0"
  >
    <div slot="title">
      <div style="display: flex; align-items: center;margin-bottom: -30px">
        <h-item
          class="title-item"
          :item-pic="itemPic"
          :item-background="itemBackground"
          :type="type"
        />
        {{ data.name }}
      </div>
    </div>
    <div slot="reference" style="text-align: center">
      <div>
        <h-tooltip :disabled="!toolTip" effect="dark" :content="data.name" placement="top-start">
          <h-item
            class="click"
            :item-pic="itemPic"
            :item-background="itemBackground"
            :type="type"
            :small="small"
          />
        </h-tooltip>
      </div>
      <div v-if="num || weight" style="text-align: center">
        <span :style="{fontSize}" class="item-name">{{ data.name }}</span>
        <div style="color:rgb(86, 86, 86)">
          <span v-if="num">x{{ num }}</span>
          <span v-else>{{ weight }}%</span>
        </div>
      </div>
    </div>
    <div v-if="!noPopover">
      <p v-if="type === 'FURN'" style="color: #828282">氛围 {{ data.comfort }}</p>
      <p v-if="type === 'FURN'" style="color: #828282">{{ data.obtainApproach }}</p>
      <p>{{ data.usage }}</p>
      <p>{{ data.description }}</p>
      <div v-if="targetStageDrop">
        <el-divider content-position="left">
          <span>当前关卡</span>
          <span
            v-if="showDropInfo"
            :style="short ? 'right: -144px' : ''"
            class="item-divider-extra"
          >统计次数</span>
        </el-divider>
        <div class="item-stage-container">
          <drop-line :data="targetStageDrop" />
        </div>
      </div>
      <div v-if="type !== 'FURN'" class="item-popover">
        <div v-if="dropList.length > 0">
          <el-divider content-position="left">
            <span>主要掉落</span>
            <span
              v-if="showDropInfo"
              :style="short ? 'top: 10px; right: -165px' : ''"
              class="item-divider-extra"
            >统计次数</span>
          </el-divider>
          <div class="item-drop-info">
            <span v-if="dropList.length > 20">
              当前排序方式 {{ sortFunc.name }}
              <el-button size="mini" type="primary" @click="switchSortFunc">切换</el-button>
            </span>
            <h-tooltip placement="left">
              <el-button size="mini" type="primary">说明</el-button>
              <div slot="content">
                点击右边数据可以查看详细数据 |
                <color color="hsl(193, 78%, 69%)">掉落数</color>/
                <color color="hsl(350, 100%, 79%)">样本数 ↓</color>
              </div>
            </h-tooltip>
          </div>
          <div class="item-stage-container">
            <drop-line v-for="stage in dropList" :key="stage.stageId" :data="stage" />
          </div>
        </div>
        <div v-if="data.buildingProductList.length > 0 && formula.length > 0">
          <el-divider content-position="left">
            <span>合成配方</span>
          </el-divider>
          <div v-for="{costs, formulaId, goldCost, extraOutcomeGroup} in formula" :key="formulaId">
            <div class="item-formula-container">
              <just-viewer
                v-if="goldCost > 0"
                :item="GOLD"
                :num="goldCost"
                class="item-formula-item"
                :no-popover="true"
                small
              />
              <just-viewer
                v-for="d in costs"
                :key="d.id"
                class="item-formula-item"
                :drawer-size="drawerSize - 5"
                :no-popover="false"
                :item="d.id"
                :num="d.count"
                small
              />
            </div>
            <div v-if="listMode" style="z-index: 0; position: relative">
              <el-divider content-position="left">
                <span>合成随机产物</span>
              </el-divider>
              <div class="item-formula-container">
                <div v-for="rd in extraOutcomeGroup" :key="rd.id">
                  <just-viewer :tool-tip="true" :no-popover="true" :item="rd.itemId" small />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </h-popping>
</template>


<script>
import { findStage, sort, getfontSize } from '../../utils'
import { path } from '../../utils/listVer'
import formula from '../../utils/data/formula.json'

import {
  itemBackground,
  occPer_chinese,
  roomType,
  GOLD
} from '../..//utils/string'

import { mapState } from 'vuex'
import Vue from 'vue'
import { Divider, Tooltip } from 'element-ui'
Vue.use(Divider)
Vue.use(Tooltip)

import DropLine from './DropLine'
import Color from '../base/Color'


import { getItem } from '../../utils/fetch'
import HPopping from '@/components/base/Popping'
import HTooltip from '@/components/base/Tooltip'
import HItem from './Item'


const getItmeDropData = (el, stageTree, list) => {
  let res = Object.assign({}, el)
  const stageData = findStage(el.stageId, stageTree)
  if (stageData) {
    const temp = stageData.label.split(' ')
    res.stageCode = temp[0]
    if (list) {
      const dropInfo = list.find(dropInfo => dropInfo.stageId === el.stageId)
      if (dropInfo) {
        res = Object.assign(res, dropInfo)
        res.rate = Math.round((dropInfo.quantity / dropInfo.times) * 100)
        res.dropCost = dropInfo.quantity ? Math.round((dropInfo.times / dropInfo.quantity) * stageData.apCost) : '∞'
        res.apCost = stageData.apCost
        if (res.dropCost < 1) {
          res.etCost = stageData.etCost
          res.dropCnt = Math.round(dropInfo.quantity / dropInfo.times)
        }
      }
    }
  }
  return res
}

const sortFunc1 = {
  key: 0,
  func: (pre, cur) => pre.dropCost < cur.dropCost,
  name: '消耗',
}
const sortFunc2 = {
  key: 1,
  func: (pre, cur) => pre.times > cur.times,
  name: '样本数量'
}

const sortFuncArr = {
  0: sortFunc1,
  1: sortFunc2
}

export default {
  name: 'JustViewer',
  components: {
    DropLine,
    Color,
    HPopping,
    HItem,
    HTooltip
  },
  props: {
    item: {
      required: true,
      type: [String, Object]
    },
    num: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    targetStage: {
      type: String,
      default: null
    },
    noPopover: {
      default: false,
      type: Boolean
    },
    small: {
      type: Boolean,
      default: false
    },
    weight: {
      default: null,
      type: Number
    },
    listMode: {
      default: false,
      type: Boolean
    },
    toolTip: {
      type: Boolean,
      default: false
    },
    drawerSize: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      // (process.env.NODE_ENV === 'development' || UA.isMobliePad || this.short)
      isHover: 'click',
      data: typeof this.item !== 'string' ? this.item : undefined,
      GOLD,
      show: false,
      sortFunc: sortFuncArr[1],
      zIndex: 0
    }
  },

  computed: {
    ...mapState(['stageTree', 'short']),
    formula() {
      if (!this.data) return []
      return this.data.buildingProductList
        .filter(el => el.roomType === 'WORKSHOP')
        .map(el => formula[el.formulaId])
        .filter(e => e)
    },
    itemBackground() {
      return this.type !== 'FURN' ? itemBackground[this.data.rarity] : {}
    },
    itemPic() {
      if (this.type === 'FURN')
        return `${path}custom/furnitures/pic/${this.data.id}.png`
      else return `${path}item/pic/${this.data.iconId}_optimized.png`
    },

    dropListRow() {
      return this.$store.getters.itemDropList(this.data.itemId)
    },
    targetStageDrop() {
      if (!this.targetStage || !this.dropListRow) return
      else {
        const tempRes = this.dropList.find(
          el => el.stageId === this.targetStage
        )
        if (tempRes > -1) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          const temp = this.dropList.splice(tempRes, 1)[0]
          return temp
        }
        // ?这是随机掉落，上面是主掉落,主掉落需要从所有掉落里分割出当前地图的掉落。
        // ?因为这里不显示随机掉落（概率）的内容（有几十个）
        // 找不到的情况， 先不改成etCost（活动）!!!
        const target = this.dropListRow.find(
          el => el.stageId === this.targetStage
        )
        if (!target) return
        const res = Object.assign({}, target)
        const stageData = findStage(target.stageId, this.stageTree)
        const temp = stageData.label.split(' ')
        res.stageCode = temp[0]
        res.rate = Math.round((target.quantity / target.times) * 100)
        res.dropCost = Math.round(
          (target.times / target.quantity) * stageData.apCost
        )
        return res
      }
    },
    dropList() {
      const list = this.dropListRow
      if (this.stageTree && list) {
        if (this.data.itemId === 'randomMaterial_2') {
          return sort(list.map((el => getItmeDropData(el, this.stageTree, list))).filter(el => el.dropCost !== '∞'), this.sortFunc.func)
        } else return this.data.stageDropList.map(el => {
          return getItmeDropData(el, this.stageTree, list)
        })
      } else {
        return this.data.stageDropList.map(el => {
          return getItmeDropData(el, this.stageTree)
        })
      }
    },
    showDropInfo() {
      return this.dropList.filter(el => el.times)
    },
    fontSize() {
      return getfontSize(this.data.name, 30, 15, 6)
    }
  },
  watch: {
    item(v) {
      if (typeof this.item === 'string') {
        getItem(this.item).then(el => (this.data = el))
      } else {
        this.data = v
      }
    },
  },
  created() {
    if (typeof this.item === 'string') {
      getItem(this.item).then(el => (this.data = el))
    }
  },
  mounted() {
  },
  methods: {
    occper(occ) {
      return occPer_chinese[occ]
    },
    roomName(id) {
      return roomType[id]
    },
    switchSortFunc() {
      if (this.sortFunc.key === 0) this.sortFunc = sortFuncArr[1]
      else this.sortFunc = sortFuncArr[0]
    }
  }
}
</script>

 <style lang="stylus" scoped>
 //?popping slot 里的类
 .item-formula-container {
   display: flex
   flex-wrap: wrap
 }

 .title-item {
   margin: 0
   margin-right: 20px
 }

 .item-drop-info {
   text-align: right
   font-size: 14px
 }

 .item-viewer-container {
   margin: 10px

   &.small {
     margin: 8px
   }

   .item-popover {
     &.el-divider__text.is-left {
       left: 20px
       padding: 0
     }
   }

   .item-divider-extra {
     display: inline-block
     background-color: #fff
     padding: 0 10px
     position: absolute
     top: 0
     right: - 242px
   }

   .item-stage-container {
     padding-left: 40px
   }

   .weekly {
     width: auto
   }

   .item-formula-item {
     margin: 0
     width: 80px
   }

   .item-name {
     word-break: keep-all
     white-space: nowrap
   }

   .short-force { //强制缩小
     .evolvcost-item-contianer {
       width: 45px
       height: 45px
     }

     .item-name {
       font-size: 13px
     }

     .item-stage-container {
       padding-left: 30px
     }

     .item-popover {
       overflow-x: hidden
       max-height: 300px
     }

     .item-popover .el-divider__text.is-left {
       padding: 10px
     }

     .item-popover .el-divider--horizontal {
       width: calc(100% - 10px)
     }
   }
 }

 @media screen and (max-width: 700px) {
   .title-item {
     margin-right: vw(20)
   }

   .item-viewer-container {
     margin: vw(10)

     &.small {
       margin: vw(5)
     }

     .item-name {
       font-size: 14px
     }

     .item-stage-container {
       padding-left: vw(60)
     }

     .item-popover {
       overflow-x: hidden
     }

     .item-popover .el-divider__text.is-left {
       padding: vw(20)
     }

     .item-popover .el-divider--horizontal {
       width: 100%
     }
   }
 }

 @media screen and (max-width: 500px) {
   .item-drop-info {
     text-align: right
     font-size: vw(28)

     .el-button--mini {
       padding: vw(7) vw(20)
       font-size: vw(28)
     }

     .el-button + .el-button[data-v-8949beae] {
       margin-left: vw(10)
     }
   }

   .item-viewer-container {
     margin: vw(10)

     &.small {
       margin: vw(5)
     }

     .item-name {
       font-size: vw(28)
     }
   }

   .item-formula-item {
     width: vw(135)
   }
 }
</style>
