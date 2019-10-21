<template>
  <div class="item-viewer-container">
    <el-popover
      v-if="data"
      popper-class="item-popover-class"
      placement="top"
      :width="!short? 350 : 250"
      trigger="click"
      :open-delay="500"
      :title="data.name"
      :disabled="noPopover && show"
    >
      <!-- 去掉 ios 点击边框 -->
      <div slot="reference" style="outline: none" :class="noPopover ? 'short-force' : ''">
        <div>
          <el-tooltip
            :disabled="!noPopover"
            effect="dark"
            :content="data.name"
            placement="top-start"
          >
            <el-image
              :class="type === 'FURN' ? 'furn-item' : 'evolvcost-item-contianer'"
              :style="itemBackground"
              fit="contain"
              :src="itemPic"
              @click="show = !show"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-tooltip>
        </div>
        <div style="text-align: center" v-if="num || weight">
          <span
            class="evolvcost-name-wrapper"
            :style="data.name.length > 6 ? 'font-size: 12px' : ''"
          >{{data.name}}</span>
          <div style="color:rgb(86, 86, 86)">
            <span v-if="num">x{{num}}</span>
            <span v-else>{{weight}}%</span>
          </div>
        </div>
      </div>
      <div v-if="!noPopover">
        <div>
          <close-button></close-button>
        </div>
        <p v-if="type === 'FURN'" style="color: #828282">氛围 {{data.comfort}}</p>
        <p v-if="type === 'FURN'" style="color: #828282">{{data.obtainApproach}}</p>
        <p>{{data.usage}}</p>
        <p>{{data.description}}</p>
        <div v-if="targetStageDrop">
          <el-divider content-position="left">
            <span>当前关卡</span>
            <span
              v-if="showDropInfo"
              :style="short ? 'right: -144px' : ''"
              class="item-divider-extra"
            >
              统计次数
              <el-tooltip placement="top">
                <i class="el-icon-info"></i>
                <div slot="content">
                  点击可以查看统计的
                  <color color="hsl(193, 78%, 69%)">总掉落数</color>/
                  <color color="hsl(350, 100%, 79%)">总场次</color>
                </div>
              </el-tooltip>
            </span>
          </el-divider>
          <div class="item-stage-container">
            <drop-line :data="targetStageDrop"></drop-line>
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
              >
                统计次数
                <el-tooltip placement="top">
                  <i class="el-icon-info"></i>
                  <div slot="content">
                    点击可以查看统计的
                    <color color="hsl(193, 78%, 69%)">总掉落数</color>/
                    <color color="hsl(350, 100%, 79%)">总场次</color>
                  </div>
                </el-tooltip>
              </span>
            </el-divider>
            <div class="item-stage-container">
              <drop-line v-for="stage in dropList" :key="stage.stageId" :data="stage"></drop-line>
            </div>
          </div>
          <div v-if="data.buildingProductList.length > 0">
            <el-divider v-if="formula.length > 0" content-position="left">
              <span>合成配方</span>
            </el-divider>
            <div
              v-for="{costs, formulaId, goldCost, extraOutcomeGroup} in formula"
              :key="formulaId"
            >
              <div class="item-formula-container">
                <just-viewer
                  v-if="goldCost > 0"
                  :item="GOLD"
                  :num="goldCost"
                  class="item-formula-item"
                  :no-popover="true"
                ></just-viewer>
                <div class="item-formula-item" v-for="data in costs" :key="data.id">
                  <just-viewer :no-popover="true" :item="data.id" :num="data.count"></just-viewer>
                </div>
              </div>
              <div v-if="listMode">
                <el-divider content-position="left">
                  <span>合成随机产物</span>
                </el-divider>
                <div class="item-formula-container">
                  <div v-for="data in extraOutcomeGroup" :key="data.id">
                    <just-viewer class="item-formula-item" :no-popover="true" :item="data.itemId"></just-viewer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>


<script>
import { findStage, UA } from '../../utils';
import { path } from '../../utils/listVer';
import formula from '../../utils/formula.json';

import { itemBackground, occPer_chinese, roomType, GOLD } from '../..//utils/string';

import { mapState } from 'vuex';
import Vue from 'vue';
import { Popover, Divider, Image, Tooltip } from 'element-ui';
Vue.use(Popover);
Vue.use(Divider);
Vue.use(Image);
Vue.use(Tooltip);

import DropLine from './DropLine';
import Color from '../Color';
import CloseButton from '../CloseButton';


import { getItem } from '../../utils/fetch';

// 可以考虑给id的话，只显示图片，不做数据拉取
// 或者noPopover + {假数据}，反正只显示图片的话，实际也不需要拉数据显示
// 但是考虑到数据有做缓存，实际不会增加http连接数
export default {
  name: 'just-viewer',
  components: {
    DropLine,
    Color,
    CloseButton
  },
  props: {
    item: {
      required: true,
      type: [String, Object]
    },
    num: Number,
    type: String,
    targetStage: String,
    noPopover: {
      default: false,
      type: Boolean
    },
    small: Boolean,
    weight: Number,
    listMode: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isHover:
        process.env.NODE_ENV === 'development' || UA.isMobliePad || this.short
          ? 'click' : 'hover',
      data: typeof this.item !== 'string' ? this.item : undefined,
      GOLD,
      show: false
    };
  },
  watch: {
    item(v) {
      if (typeof this.item === 'string') {
        getItem(this.item).then(el => this.data = el);
      } else {
        this.data = v;
      }
    }
  },
  created() {
    if (typeof this.item === 'string') {
      getItem(this.item).then(el => this.data = el);
    }
  },
  computed: {
    ...mapState(['stageTree', 'short']),
    formula() {
      if (!this.data) return;
      return this.data.buildingProductList.filter(el => el.roomType === 'WORKSHOP').map(el => formula[el.formulaId]);
    },
    itemBackground() {
      return this.type !== 'FURN' ? itemBackground[this.data.rarity] : {};
    },
    itemPic() {
      return (path + (this.type === 'FURN' ? 'custom/furnitures/pic/' : 'item/pic/') + this.data.iconId + '_optimized.png');
    },

    dropListRow() {
      return this.$store.getters.itemDropList(this.data.itemId);
    },
    targetStageDrop() {
      if (!this.targetStage || !this.dropListRow) return;
      else {
        const tempRes = this.dropList.findIndex(
          el => el.stageId === this.targetStage
        );
        if (tempRes > -1) {
          const temp = this.dropList.splice(tempRes, 1)[0];
          return temp;
        }
        // 找不到的情况， 先不改成etCost!!!
        const target = this.dropListRow.find(el => el.stageId === this.targetStage);
        if (!target) return;
        const res = Object.assign({}, target);
        const stageData = findStage(target.stageId, this.stageTree);
        const temp = stageData.label.split(' ');
        res.stageCode = temp[0];
        res.rate = Math.round((target.quantity / target.times) * 100);
        res.dropCost = Math.round((target.times / target.quantity) * stageData.apCost);
        return res;
      }
    },

    dropList() {
      const list = this.dropListRow;
      if (this.stageTree) {
        return this.data.stageDropList.map(el => {
          let res = Object.assign({}, el);
          const stageData = findStage(el.stageId, this.stageTree);
          if (stageData) {
            const temp = stageData.label.split(' ');
            res.stageCode = temp[0];
            if (temp[0] === this.ta) {
              res.target = true;
            }
            if (list) {
              const dropInfo = list.find(
                dropInfo => dropInfo.stageId === el.stageId
              );
              if (dropInfo) {
                res = Object.assign(res, dropInfo);
                res.rate = Math.round(
                  (dropInfo.quantity / dropInfo.times) * 100
                );
                res.dropCost = Math.round(
                  (dropInfo.times / dropInfo.quantity) * stageData.apCost
                );
                if (res.dropCost < 1) {
                  res.apCost = stageData.apCost;
                  res.etCost = stageData.etCost;
                  res.dropCnt = Math.round(dropInfo.quantity / dropInfo.times);
                }
              }
            }
          }
          return res;
        });
      } else {
        return this.data.stageDropList;
      }
    },
    showDropInfo() {
      return this.dropList.filter(el => el.times);
    }
  },
  methods: {
    occper(occ) {
      return occPer_chinese[occ];
    },
    roomName(id) {
      return roomType[id];
    }
  }
};
</script>

 <style lang="stylus" scoped>
 .evolvcost-item-contianer {
   /*margin: 5px 10px;*/
   width: 70px
   height: 70px
   display: block
   box-sizing: border-box
   border-radius: 50%
   box-shadow: inset 0 0 0 2px black
   background: grey
   border: 2px solid rgb(249, 198, 19)
   overflow: visible
   margin: 0 auto
 }

 .evolvcost-item-contianer>>>img {
   width: 128%
   height: 128%
   margin-top: -14%
   margin-left: -14%
 }

 .item-popover {
   &.is-left {
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

 .furn-item {
   width: 70px
   min-height: 70px
   display: block
   box-sizing: border-box
   border-radius: 3px
   box-shadow: inset 0px 6px 13px 0px #4a4a4a
   background: url('../../assets/bbbj_optimized.png')
   background-size: cover
   /*overflow: visible;*/
   padding: 9px 0

   & >>> img {
     width: calc(100% - 1px)
     box-shadow: 1px 1px 0px 1px #6b6b6b63, 1px -1px 0px 0px #fff
   }
 }

 .item-formula-container {
   display: flex
   flex-wrap: wrap
 }

 .item-formula-item {
   padding: 5px
 }

 .short-force { //强制缩小
   .evolvcost-item-contianer {
     width: 45px
     height: 45px
   }

   .evolvcost-name-wrapper {
     font-size: 13px
   }

   .item-stage-container {
     padding-left: 30px
   }

   .item-popover {
     overflow-x: hidden
     max-height: 300px
   }

   .item-popover .is-left {
     padding: 10px
   }

   .item-popover .el-divider--horizontal {
     width: calc(100% - 10px)
   }
 }

 @media screen and (max-width: 700px) {
   .evolvcost-item-contianer {
     width: calc(45px + 2vw)
     height: calc(45px + 2vw)
   }

   .evolvcost-name-wrapper {
     font-size: 14px
   }

   .item-stage-container {
     padding-left: 30px
   }

   .item-popover {
     overflow-x: hidden
     max-height: 300px
   }

   .item-popover .is-left {
     padding: 10px
   }

   .item-popover .el-divider--horizontal {
     width: calc(100% - 10px)
   }
 }
</style>
