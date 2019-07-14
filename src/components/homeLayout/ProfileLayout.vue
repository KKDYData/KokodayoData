<template>
  <div>
    <transition-group name="flip-list" class="profile-container">
      <div
        class="profile-item"
        v-for="agent in data"
        :key="agent.name"
        :title="agent.name"
        :style="showTags ? short ? 'margin: 10px 0; width: 165px' : 'width: 170px; margin: 10px' : ''"
      >
        <div
          :class="agent.star === 5 ? 'profile-item-inner-wrapper bg-6' : 'profile-item-inner-wrapper'"
          :style="bgColor(agent.star)"
        >
          <router-link :to="path + '/details/' + agent.No">
            <!-- style="box-shadow: 1px 1px 2px 1px rgba(102, 102, 102, 0.7);" -->
            <el-image
              fit="cover"
              class="img-container"
              :alt="agent.name"
              :src="profilePath(agent.No)"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </router-link>
          <transition name="slide-fade">
            <div class="tag-wrapper-1" v-if="showTags">
              <div v-for="tag in agent.tags" :key="tag">
                <div class="tag-container long-tag">
                  <el-tag
                    type="info"
                    :effect="tagHit(tag) ? 'dark' : 'plain'"
                    size="medium"
                    v-if="tag !== '' && tag !== 'null'"
                  >{{tag}}</el-tag>
                </div>
              </div>
              <div class="tag-container long-tag double-tag-container">
                <el-tag
                  effect="plain"
                  type="info"
                  size="mini"
                  :title="agent.position"
                  style="text-align: center"
                >
                  <span
                    class="double-tag"
                    :style="tagHit(agent.class) ? 'background-color: #313131; color: #fff': ''"
                  >{{changeClassShort(agent.class)}}</span>
                  <span
                    class="double-tag"
                    :style="tagHit(agent.position) ? 'background-color: #313131; color: #fff': ''"
                  >{{agent.position === '近战位' ? '近' : '远'}}</span>
                </el-tag>
              </div>
            </div>
          </transition>

          <div class="name">
            <div class="name-inner-wrapper" :style="nameColor(agent.star)">
              <span
                :style="agent.name.split('').length > 6 ? 'font-size: 14px;': '' "
              >{{agent.name}}</span>
              <span
                v-if="showTags"
                :style="agent.sex === '女' ? 'color: pink;' : 'color : #fff'"
              >{{agent.sex === '女' ? '♀' : '♂'}}</span>
            </div>
            <div
              style="font-size: 10px;font-weight: normal;line-height: 12px;font-family: sans-serif;padding-left: 6px"
            >{{agent.en}}</div>
            <div class="name-slide-logo">
              <el-image
                fit="cover"
                :alt="agent.name"
                :src="rowPath + 'logo/' + agent.logo + '.png'"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </div>
        </div>
      </div>

      <div class="fill-item" :style="fillItemWidth" v-for="item in fillItems" :key="item"></div>
      <!-- </div> -->
    </transition-group>
  </div>
</template>

<script>
// import Image from 'element-ui/packages/image/index.js';
import { Tag, Image } from 'element-ui';
import Vue from 'vue';
import {
  getClass_Chinese,
  getProfilePath,
  getClass_icon,
  path,
  charBorderColor,
  charNameColor
} from '../utils';

Vue.use(Image);
Vue.use(Tag);

import Mode from '../../stats';

export default {
  props: {
    data: Array,
    showKey: String,
    tags: Array,
    showTags: Boolean,
    webpOk: Boolean,
    short: Boolean
  },
  components: {},
  data() {
    return {
      fillItems: [],
      moraleMode: false,
      fillItemWidth: { width: '100px' },
      rowPath: path
    };
  },
  computed: {
    path() {
      return process.env.NODE_ENV === 'development' ? '' : Mode;
    }
  },
  mounted() {
    const self = this;
    this.calFillAmount();
    window.addEventListener('resize', self.calFillAmount);
  },
  methods: {
    bgColor(star) {
      return charBorderColor[star];
    },
    nameColor(star) {
      return charNameColor[star];
    },
    class_icon(c) {
      return getClass_icon(c);
    },
    async openDetails(item) {
      console.log(item.name);
      if (this.moraleMode) {
        this.$emit('chose', item.name);
        return;
      }
      this.$router.push(this.path + '/details/' + item.No);
    },
    calFillAmount() {
      if (!this.data) return;
      const width = this.$el.clientWidth;
      let cWidth = this.short ? 96 : 100;
      console.log(cWidth);
      cWidth = this.showTags
        ? this.short
          ? cWidth + 65
          : cWidth + 90
        : cWidth + 40;
      this.fillItemWidth = { width: cWidth + 'px' };
      let size = Math.floor(width / cWidth);
      size = size - (this.data.length % size);
      const arr = [];
      for (let i = 0; i < size; i++) {
        arr.push(i);
      }
      this.fillItems = arr;
    },
    tagHit(tag) {
      return this.tags.find(el => el.value === tag);
    },
    profilePath(name) {
      return getProfilePath(name);
    },
    changeClassShort(c) {
      return getClass_Chinese(c);
    }
  }
};
</script>
<style >
@font-face {
  font-family: "FZYaSong-H-GBK";
  src: url("fzty_gbk.woff") format("woff"),
    /* chrome, firefox */ url("fzty_gbk.ttf") format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url("fzty_gbk.svg#FZYaSong-H-GBK") format("svg"); /* iOS 4.1- */
  font-style: normal;
  font-weight: normal;
}

.flip-list-move {
  transition: transform 1s;
  transition-delay: 0.3;
}

.profile-container {
  display: flex;
  flex-wrap: wrap;
  margin: 50px auto;
  width: 100%;
  justify-content: space-around;
}
.profile-item {
  --imgWidth: 88px;
  position: relative;
  box-sizing: border-box;
  margin: 10px 20px;
}
.profile-item-inner-wrapper {
  height: 124px;
  width: 100px;
  position: relative;
  display: flex;
}

.img-container-wrapper {
  display: flex;
}

.img-container {
  width: calc(var(--imgWidth) + 12px);
  height: calc(var(--imgWidth) + 12px);
  z-index: 1;
}
.img-container::after {
  content: "";
  background-image: url("bg_1_lastbreath.png");
  background-size: contain;
  width: var(--imgWidth);
  height: var(--imgWidth);
  display: inline-block;
  z-index: -1;
  position: absolute;
  top: 6px;
  left: 6px;
}
.img-container img {
  width: 100%;
}

.name {
  text-overflow: ellipsis;
  width: 100px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  position: absolute;
  top: 85px;
  color: white;
  font-size: 17px;
  font-family: "FZYaSong-H-GBK";
  overflow: visible;
  z-index: 10;
}

.tag-wrapper-1 {
  margin-left: -2px;
  width: 65px;
  z-index: -10;
}
.name-tag-show {
  top: -15px !important;
  padding-left: 5px;
  text-align: left;
  color: white;
  width: var(--imgWidth);
  background-color: #414141;
  box-sizing: border-box;
  height: 20px;
  line-height: 19px;
}
.name a {
  color: inherit;
  text-decoration: none;
  width: 100%;
  display: inline-block;
}

.tag-container {
  display: inline-block;
  font-size: 0;
  margin-bottom: 1px;
}

.tag-container .el-tag {
  border-radius: 2px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

.class-icon {
  --imgWidth: 20px;
  vertical-align: middle;
}

.tag-container > .el-tag--dark {
  background-color: #313131;
  border-color: #313131;
}

.long-tag .el-tag--info {
  min-width: 48px;
}

.name-slide-logo {
  width: 47px;
  top: -18px;
  position: absolute;
  right: -10px;
  z-index: -1;
}

.double-tag {
  display: inline-block;
  height: 100%;
  font-size: 12px;
  padding: 0 5px;
}
.double-tag-container .el-tag--mini.el-tag--info {
  padding: 0;
  font-size: 0;
  overflow: hidden;
  border-radius: 3px;
}

.double-tag:first-child {
  border-right: 1px solid rgb(153, 153, 153);
}

.bg-6 {
  background: url("./star_6.png");
}

.name-inner-wrapper {
  min-width: 50px;
  display: inline-block;
  /* background-color: rgba(73, 73, 73, 0.5); */
  padding-left: 6px;
  /* background: linear-gradient(45deg, #7676766e 70%, transparent); */
}

@media screen and (max-width: 700px) {
  .profile-item {
    /* --imgWidth: calc(55px + 11vw); */
  }

  .img-container {
    width: calc(var(--imgWidth) + 8px);
    height: calc(var(--imgWidth) + 8px);
  }

  .img-container::after {
    top: 4px;
    left: 4px;
  }
  .profile-item-inner-wrapper {
    width: calc(var(--imgWidth) + 8px);
  }

  .profile-item {
    margin: 10px;
  }
  /* .profile-container {
    margin-top: 20px;
  }

  .name {
    text-overflow: ellipsis;
    width: calc(100% - 20px);
    white-space: nowrap;
    overflow: hidden;
    position: absolute;
    top: 112px;
    top: 92px;
    color: white;
    left: 6px;
    font-size: 17px;
    overflow: visible;
  }

  .tag-wrapper-1 {
    margin-left: 10px;
    margin-top: calc(-24px - 1vw);
    width: 65px;
  }

  .tag-wrapper-2 {
    width: 30px;
  }
  .profile-item-inner-wrapper {
    height: 112px;
    margin: 20px 5px;
  } */
}
@media screen and (max-width: 360px) {
  .name {
    font-size: 16px;
  }
}
</style>

