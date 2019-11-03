<template>
  <el-carousel
    class="char-set-container-wrapper"
    :height="(getScreenWidth() * (short ? 1.05: 0.82)) + 'px'"
    :autoplay="false"
    indicator-position="outside"
    :loop="false"
  >
    <el-carousel-item v-if="short && setData && !setData[0].displaySkin">
      <spine-panel class="spin-panel mobile" :canvasWidth="getScreenWidth() * 0.8"></spine-panel>z-index: 10
    </el-carousel-item>
    <spine-panel v-if="!short" class="spine-panel" :canvasWidth="300"></spine-panel>
    <div v-for="(data, index) in setData" :key="index" :data="data" :short="short">
      <el-carousel-item v-if="short && setData && setData[0].displaySkin">
        <spine-panel class="spin-panel mobile" :canvasWidth="getScreenWidth() * 0.8"></spine-panel>
      </el-carousel-item>
      <el-carousel-item :key="index" style="font-size:13px">
        <div class="char-set-contianer-wrapper">
          <div :style="short ? '' : 'padding-left: 100px'">
            <el-image class="char-set-container" :src="data.charSet">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div v-if="!short" class="set-right-panel">
            <div class="char-profile-container">
              <el-image :src="data.profile"></el-image>
            </div>
            <div class="char-half-container">
              <el-image :src="data.halfPic"></el-image>
            </div>

            <div v-if="data.displaySkin" style="margin-top: auto">
              <div>
                <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                  <template slot="title">系列</template>
                  <template slot="content">{{data.displaySkin.skinGroupName}}</template>
                </content-slot>
                <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                  <template slot="title">获得方式</template>
                  <template slot="content">{{data.displaySkin.obtainApproach}}</template>
                </content-slot>
                <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                  <template slot="title">描述</template>
                  <template slot="content">{{data.displaySkin.usage}}</template>
                </content-slot>
                <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                  <template slot="title">记录</template>
                  <template slot="content">{{data.displaySkin.content | filterColor}}</template>
                </content-slot>
              </div>
            </div>
            <div v-else style="margin-top: auto">
              <content-slot :long="true" :no-wrap="true">
                <template slot="title">Default</template>
                <template slot="content">{{data.words}}</template>
              </content-slot>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </div>
  </el-carousel>
</template>

<script>

import SpinePanel from '../../Spine';
import ContentSlot from '../../base/ContentSlot';

import { mapState } from 'vuex';

import {
  Carousel,
} from 'element-ui';

import Vue from 'vue';
Vue.use(Carousel);

export default {
  components: {
    SpinePanel,
    ContentSlot,
  },
  props: {
    setData: {
      required: true,
      type: Array
    }
  },
  computed: {
    ...mapState(['short']),

  },
  filters: {
    filterColor(v) {
      const reg = /<color (name=(.{7}))?>/g;
      const regL = /<\/color>/g;
      return v.replace(reg, '').replace(regL, '');
    }
  },
  methods: {
    getScreenWidth() {
      const w = document.body.clientWidth;
      const h = window.innerHeight;
      const width = (w < h ? w : h) - 40;
      return width > 1200 ? 1200 : width;
    }
  }
};
</script>

<style lang="stylus" scoped>
.char-set-contianer-wrapper {
  display: flex
}

.char-half-container {
  width: 110px
  position: relative
  margin-top: 20px
  font-size: 0
}

.char-profile-container {
  height: 110px
  position: relative
}

.char-profile-container + .char-half-container, .char-profile-container {
  &::before {
    content: ''
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    border: 10px solid #fff
    box-sizing: border-box
    box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.31), 0px 2px 6px 0px rgba(0, 0, 0, 0.47) inset
  }
}

.set-right-panel {
  margin-right: 10px
  width: 110px
  display: flex
  flex-flow: column
}

.spine-panel {
  position: absolute
  bottom: 0
  left: 0
}

.spin-panel.mobile {
  position: relative
  display: flex
  justify-content: center
}
</style>
