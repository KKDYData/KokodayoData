<template>
  <div class="item-viewer-container" style>
    <el-popover
      popper-class="item-popover-class"
      placement="top"
      :title="item.name"
      :width="!short? 350 : 250"
      :trigger="isHover"
      :open-delay="500"
    >
      <div slot="reference">
        <div style>
          <el-image
            :class="type === 'FURN' ? 'furn-item' : 'evolvcost-item-contianer'"
            :style="itemBackground"
            fit="contain"
            :src="itemPic"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <div style="text-align: center" v-if="num">
          <span
            class="evolvcost-name-wrapper"
            :style="item.name.length > 6 ? 'font-size: 12px' : ''"
          >{{item.name}}</span>
          <div style="color:rgb(86, 86, 86)">
            <span>x{{num}}</span>
          </div>
        </div>
      </div>

      <p>{{item.usage}}</p>
      <div v-if="type !== 'FURN'" class="item-popover">
        <div v-if="dropList.length > 0">
          <el-divider content-position="left">
            <span>关卡掉落</span>
            <span
              v-if="showDropInfo"
              :style="short ? 'top: 10px; right: -150px' : ''"
              class="item-divider-extra"
            >统计次数</span>
          </el-divider>
          <p class="item-stage-container" v-for="stage in dropList" :key="stage.stageId">
            <span
              :style="stage.stageId !== 'wk_kc_1' && stage.stageId !== 'wk_melee_1' ? '' : 'width: auto'"
              class="item-stage-name"
            >{{stageId(stage.stageId)}}</span>
            <span class="item-occper">{{occper(stage.occPer)}}</span>
            <el-tooltip v-if="stage.times" class="item-dropInfo" placement="top">
              <div slot="content">{{stage.times}}/{{stage.quantity}}</div>
              <span>{{stage.rate}}/次</span>
            </el-tooltip>
          </p>
        </div>
        <div v-if="item.buildingProductList.length > 0">
          <el-divider content-position="left">
            <span>基建生产</span>
          </el-divider>
          <p
            class="item-stage-container"
            v-for="way in item.buildingProductList"
            :key="way.formulaId"
          >{{roomName(way.roomType)}}</p>
        </div>
      </div>
    </el-popover>
  </div>
</template>


<script>
import { path } from '../utils';

import { itemBackground, occPer_chinese, roomType } from '../utils/string';

import { Popover, Divider, Image, Tooltip } from 'element-ui';
import Vue from 'vue';
Vue.use(Popover);
Vue.use(Divider);
Vue.use(Image);
Vue.use(Tooltip);

const stageList = () =>
  import(/* webpackChunkName: "stageList" */ './stageList.json');

export default {
  props: {
    item: {
      required: true
    },
    num: Number,
    short: Boolean,
    type: String
  },
  mounted() {
    stageList().then(res => (this.stageList = res.default));
  },
  data() {
    return {
      stageList: [],
      isHover:
        process.env.NODE_ENV === 'development' || this.short ? 'click' : 'hover'
    };
  },
  computed: {
    itemBackground() {
      return this.type !== 'FURN' ? itemBackground[this.item.rarity] : {};
    },
    itemPic() {
      return (
        path +
        (this.type === 'FURN' ? 'custom/furnitures/pic/' : 'item/pic/') +
        this.item.iconId +
        '_optimized.png'
      );
    },
    showDropInfo() {
      return this.dropList[0].times;
    },
    dropList() {
      const list = this.$store.getters.itemDropList(this.item.itemId);
      if (list) {
        return list.filter(el =>
          this.item.stageDropList.find(stage => {
            if (stage.stageId === el.stageId) {
              el.occPer = stage.occPer;
              el.rate = Math.round((el.quantity / el.times) * 100) / 100;
              return true;
            }
          })
        );
      } else {
        return this.item.stageDropList;
      }
    }
  },
  methods: {
    stageId(id) {
      if (this.stageList) return this.stageList[id];
    },
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
 .evolvcost-item-contianer
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

 .evolvcost-item-contianer>>>img
   width: 128%
   height: 128%
   margin-top: -14%
   margin-left: -14%

 .item-popover
   &.is-left
     left: 20px
     padding: 0

   .item-divider-extra
     position: absolute
     top: 0
     right: - 230px

   .item-stage-container
     padding-left: 40px

     .item-occper
       background-color: rgb(128, 128, 128)
       color: white
       padding: 0 6px
       border-radius: 3px

     .item-dropInfo
       float: right
       cursor: pointer

     .item-occper
       background-color: rgb(128, 128, 128)
       color: white
       padding: 0 6px
       border-radius: 3px

     .item-stage-name
       width: 50px
       display: inline-block

 .weekly
   width: auto

 .furn-item
   width: 70px
   display: block
   box-sizing: border-box
   border-radius: 3px
   box-shadow: inset 0px 6px 13px 0px #4a4a4a
   background: url('../assets/bbbj_optimized.png')
   background-size: cover
   /*overflow: visible;*/
   margin: 0 auto
   padding: 9px 0

   & >>> img
     width: calc(100% - 1px)
     box-shadow: 1px 1px 0px 1px #6b6b6b63, 1px -1px 0px 0px #fff

 @media screen and (max-width: 700px)
   .evolvcost-item-contianer
     /*padding: 5px 10px;*/
     width: calc(40px + 1vw)
     height: calc(40px + 1vw)

   .evolvcost-name-wrapper
     font-size: 14px

   .item-stage-container
     padding-left: 30px

   .item-popover
     max-height: 150px
     overflow-y: scroll

   .item-popover .is-left
     padding: 10px

   .item-popover .el-divider--horizontal
     width: calc(100% - 10px)
</style>
