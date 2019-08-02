<template>
  <div>
    <transition-group name="flip-list" class="profile-container">
      <div
        class="profile-item"
        v-for="agent in data"
        :key="agent.name"
        :title="agent.name"
        :style="showTags ? short ? ' width: 165px' : 'width: 170px; ' : ''"
      >
        <div
          :class="agent.tags[0] === 5 ? 'profile-item-inner-wrapper bg-6' : 'profile-item-inner-wrapper'"
          :style="bgColor(agent.tags[0])"
        >
          <router-link :to="path + '/details/' + agent.No">
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
              <div v-for="(tag, index) in agent.tags" :key="tag">
                <div class="tag-container long-tag" v-if="index > 2 || index === 0 &&  tag > 3">
                  <el-tag
                    type="info"
                    :effect="tagHit(String(tag)) ? 'dark' : 'plain'"
                    size="mini"
                  >{{index === 0 ? tag === 5 ? '高级资深干员' : '资深干员' : tag}}</el-tag>
                </div>
              </div>
              <div class="tag-container long-tag double-tag-container">
                <el-tag effect="plain" type="info" size="mini" style="text-align: center">
                  <span
                    class="double-tag"
                    :style="tagHit(agent.class) ? 'background-color: #313131; color: #fff': ''"
                  >{{changeClassShort(agent.class)}}</span>
                  <span
                    class="double-tag"
                    :style="tagHit(agent.tags[2]) ? 'background-color: #313131; color: #fff': ''"
                  >{{agent.tags[2] === '近战位' ? '近' : '远'}}</span>
                </el-tag>
              </div>
            </div>
          </transition>

          <div class="name">
            <div class="name-inner-wrapper" :style="nameColor(agent.tags[0])">
              <span
                :style="agent.name.split('').length > 6 ? 'font-size: 14px;': '' "
              >{{agent.name}}</span>
            </div>
            <div
              style="font-size: 12px;font-weight: normal;line-height: 12px;font-family: sans-serif;padding-left: 6px"
            >
              {{agent.en}}
              <span
                v-if="showTags && tagHit(agent.tags[1])"
              >{{agent.tags[1] === '女' ? '♀' : '♂'}}</span>
            </div>
            <div class="name-slide-logo">
              <el-image
                fit="cover"
                :alt="agent.name"
                :src="rowPath + 'logo/' + agent.logo + '_optimized.png'"
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
    </transition-group>
  </div>
</template>

<script>
import { Tag, Image } from 'element-ui';
import Vue from 'vue';
import {
  getClass_Chinese,
  getProfilePath,
  getClass_icon,
  path
} from '../../utils';

import { charBorderColor, charNameColor } from '../../utils/string';

Vue.use(Image);
Vue.use(Tag);

import Mode from '../../stats';

export default {
  props: {
    data: Array,
    showKey: String,
    tags: Array,
    showTags: Boolean,
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
  watch: {
    showTags: function(v) {
      console.log('show? ' + v);
      this.calFillAmount();
    },
    short: function(v) {
      this.calFillAmount();
    }
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
      //通过css控制填充的margin？
      const width = this.$el.clientWidth;
      let cWidth = this.short ? 106 : 120;
      cWidth = this.showTags
        ? this.short
          ? cWidth + 69
          : cWidth + 70
        : cWidth;
      this.fillItemWidth = { width: cWidth + 'px' };
      let size = Math.floor(width / cWidth);
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
<style scoped>
.flip-list-move {
  transition: transform 1s ease-in-out;
  transition-delay: 1s;
}

.flip-list-enter,
.flip-list-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.flip-list-leave-active {
  position: absolute;
}

.profile-item {
  transition: all 1s ease-in-out;
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
  transition: all 0.5s ease-in-out;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-59px);
  opacity: 0;
}

.profile-container {
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 50px;
  width: 100%;
  justify-content: space-around;
}
.profile-item {
  --imgWidth: 88px;
  /* position: relative; */
  box-sizing: border-box;
  margin: 10px;
}
.profile-item-inner-wrapper {
  height: 121px;
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
  background-image: url("bg_1_lastbreath_optimized.png");
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
  font-size: 0;
  font-family: "FZYaSong-H-GBK";
  overflow: visible;
  z-index: 10;
}
.name a {
  color: inherit;
  text-decoration: none;
  width: 100%;
  display: inline-block;
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

.class-icon {
  --imgWidth: 20px;
  vertical-align: middle;
}

.tag-container >>> .el-tag--dark {
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
  background: url("./star_6_optimized.png");
  background-size: cover;
}

.name-inner-wrapper {
  min-width: 50px;
  display: inline-block;
  padding-left: 6px;
  font-size: 17px;
}

@media screen and (max-width: 700px) {
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
    margin: 10px 5px;
  }
}
@media screen and (max-width: 360px) {
  .name {
    font-size: 16px;
  }
}
</style>

