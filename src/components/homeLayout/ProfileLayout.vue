<template>
  <div>
    <!-- <div class="profile-container"> -->
    <transition-group name="flip-list" class="profile-container">
      <div class="profile-item" v-for="agent in data" :key="agent.name" :title="agent.name">
        <div class="profile-item-inner-wrapper">
          <router-link :to="path + '/details/' + agent.No">
            <!-- style="box-shadow: 1px 1px 2px 1px rgba(102, 102, 102, 0.7);" -->
            <el-image
              fit="cover"
              class="img-container"
              :alt="agent.name"
              :src="profilePath(agent.No)"
              :style="itemBackground[agent.star]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </router-link>
          <transition name="slide-fade">
            <div class="tag-wrapper-1" v-if="showTags">
              <div style="margin-bottom: 4px">
                <div class="tag-container class-icon">
                  <el-image
                    class="img-container"
                    :style="tagHit(agent.class) ? '' : 'opacity: 0.2'"
                    :alt="agent.class"
                    :title="changeClassShort(agent.class)"
                    :src="class_icon(agent.class)"
                  ></el-image>
                </div>
                <div class="tag-container">
                  <el-tag
                    :type="tagHit(agent.position) ? 'info' : 'info'"
                    size="mini"
                    :title="agent.position"
                    :effect="tagHit(agent.position) ? 'dark' : 'plain'"
                  >{{agent.position === '远程位' ? '远' : '近'}}</el-tag>
                </div>
              </div>

              <div v-for="tag in agent.tags" :key="tag">
                <div class="tag-container long-tag">
                  <el-tag
                    :type="tagHit(tag) ? 'info' : 'info'"
                    :effect="tagHit(tag) ? 'dark' : 'plain'"
                    size="medium"
                    v-if="tag !== '' && tag !== 'null'"
                  >{{tag}}</el-tag>
                </div>
              </div>
            </div>
          </transition>

          <div
            :class="showTags? 'name-tag-show name ' : 'name'"
            :style="showTags ?  'box-shadow: rgba(102, 102, 102, 0.78) 1px 1px 3px 0px;' : ''"
          >
            <div>
              <router-link :id="agent.No" :to="path + '/details/' + agent.No">
                <span
                  :style="agent.name.split('').length > 6 ? 'font-size: 14px;': '' "
                >{{agent.name}}</span>
                <span
                  v-if="showTags"
                  :style="agent.sex === '女' ? 'color: pink;' : 'color : #fff'"
                >{{agent.sex === '女' ? '♀' : '♂'}}</span>
              </router-link>
            </div>
            <div
              style="font-size: 10px;font-weight: normal;line-height: 12px;font-family: sans-serif;"
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
  charBorderColor
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
    webpOk: Boolean
  },
  components: {},
  data() {
    return {
      fillItems: [],
      moraleMode: false,
      fillItemWidth: { width: '100px' },
      rowPath: path,
      itemBackground: charBorderColor
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
      const width = this.$el.clientWidth,
        cWidth = this.$el.querySelector('.profile-item').clientWidth;
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
}
.profile-item-inner-wrapper {
  /* padding: 10px; */
  margin: 20px 10px;
  height: 130px;
  position: relative;
  display: flex;
}

.img-container-wrapper {
  display: flex;
}

.img-container {
  width: var(--imgWidth);
  height: var(--imgWidth);
  border: 6px solid rgb(49, 49, 49);

  border: 6px solid hsla(200, 98%, 54%, 0.85);
  background-color: hsla(180, 2%, 45%, 0.7);
  box-shadow: 1px 1px 2px 1px rgba(51, 50, 48, 0.24);
  /* background-color: hsla(0, 0%, 20%, 0.7); */
  /* background-color: hsla(0, 0%, 20%, 0.7); */
  /* box-shadow: inset 0px 0px 20px 18px rgba(23, 176, 253, 0.2); */
  border-bottom-width: 27px;
}
.img-container img {
  width: 100%;
}

.name {
  text-overflow: ellipsis;
  width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  /* text-align: center; */
  position: absolute;
  /*  */
  top: 85px;
  color: white;
  left: 8px;
  /* font-weight: bold; */
  font-size: 17px;
  font-family: "FZYaSong-H-GBK";
  overflow: visible;
}

.tag-wrapper-1 {
  margin-left: 10px;
  margin-top: -27px;
  width: 65px;
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
  border-radius: 2px;
  font-size: 0;
  margin-bottom: 1px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  /* transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1); */
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
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
  /* background-color: #ca3e47; */
}

.name-slide-logo {
  width: 47px;
  top: -18px;
  position: absolute;
  right: -15px;
}

@media screen and (max-width: 700px) {
  .profile-container {
    margin-top: 20px;
  }
  .profile-item {
    /* --imgWidth: calc(85px + 1vw); */
    --imgWidth: calc(55px + 11vw);
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
    font-family: "FZYaSong-H-GBK";
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
  }
}
@media screen and (max-width: 360px) {
  .name {
    font-size: 16px;
  }
}
</style>

