<template>
  <div class="item-viewer-container" style>
    <el-popover
      popper-class="item-popover-class"
      placement="top"
      :title="item.name"
      :width="!isShort? 350 : 250"
      trigger="click"
    >
      <div slot="reference">
        <div style>
          <el-image
            class="evolvcost-item-contianer"
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
      <div class="item-popover">
        <div v-if="item.stageDropList.length > 0">
          <el-divider content-position="left">
            <span>关卡掉落</span>
          </el-divider>
          <p class="item-stage-container" v-for="stage in item.stageDropList" :key="stage.stageId">
            <span
              :style="stage.stageId !== 'wk_kc_1' && stage.stageId !== 'wk_melee_1' ? '' : 'width: auto'"
              class="item-stage-name"
            >{{stageId(stage.stageId)}}</span>
            <span class="item-occper">{{occper(stage.occPer)}}</span>
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
import { itemBackground, path, occPer_chinese, roomType } from './utils';
import { Popover, Divider, Image } from 'element-ui';
import Vue from 'vue';
Vue.use(Popover);
Vue.use(Divider);
Vue.use(Image);

const stageList = () =>
  import(/* webpackChunkName: "stageList" */ './stageList.json');

export default {
  props: {
    item: {
      required: true
    },
    num: Number,
    short: Boolean
  },
  mounted() {
    stageList().then(res => (this.stageList = res));
  },
  data() {
    return {
      stageList: [],
      isShort: this.short
    };
  },
  computed: {
    itemBackground() {
      return itemBackground[this.item.rarity];
    },
    itemPic() {
      return path + 'item/pic/' + this.item.iconId + '.png';
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

<style>
.evolvcost-item-contianer {
  /* margin: 5px 10px; */
  width: 70px;
  height: 70px;
  display: block;
  box-sizing: border-box;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px black;
  background: grey;
  border: 2px solid rgb(249, 198, 19);
  overflow: visible;
  margin: 0 auto;
}

.evolvcost-item-contianer img {
  width: 128%;
  height: 128%;
  margin-top: -14%;
  margin-left: -14%;
}

.item-occper {
  background-color: rgb(128, 128, 128);
  color: white;
  padding: 0 6px;
  border-radius: 3px;
}

.item-stage-name {
  width: 50px;
  display: inline-block;
}
.item-viewer-container {
  text-align: center;
}

.item-stage-container {
  padding-left: 40px;
}
.item-popover .is-left {
  left: 20px;
  padding: 0;
}
.weekly {
  width: auto;
}

@media screen and (max-width: 700px) {
  .evolvcost-item-contianer {
    /* padding: 5px 10px; */
    width: calc(40px + 1vw);
    height: calc(40px + 1vw);
  }

  .evolvcost-name-wrapper {
    font-size: 14px;
  }
  .item-stage-container {
    padding-left: 30px;
  }

  .item-popover {
    max-height: 150px;
    overflow-y: scroll;
  }
  .item-popover .is-left {
    padding: 10px;
  }
  .item-popover .el-divider--horizontal {
    width: calc(100% - 10px);
  }
}
</style>
