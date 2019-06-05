<template>
  <div>
    <div class="profile-container">
      <div
        class="profile-item"
        @click="openDetails(item)"
        v-for="item in data"
        :key="item.name"
        :title="item.name"
      >
        <div class="img-container-wrapper">
          <el-image fit="cover" class="img-container" :alt="item.name" :src="profilePath(item.No)">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <transition name="slide-fade">
            <div class="tag-wrapper-1" v-if="showTags">
              <div v-for="tag in item.tags" :key="tag">
                <div class="tag-container" :style="tagHit(tag) ? 'background-color: #fff': ''">
                  <el-tag
                    :type="tagHit(tag) ? 'warning' : ''"
                    size="medium"
                    v-if="tag !== '' && tag !== 'null'"
                  >{{tag}}</el-tag>
                </div>
              </div>
            </div>
          </transition>
          <transition name="slide-fade">
            <div class="tag-wrapper-2" v-if="showTags">
              <div>
                <div
                  class="tag-container"
                  :style="tagHit(item.class) ? 'background-color: #fff': ''"
                >
                  <el-tag
                    :type="tagHit(item.position) ? 'warning' : ''"
                    size="mini"
                  >{{item.position === '远程位' ? '远' : '近'}}</el-tag>
                </div>
                <div
                  class="tag-container"
                  :style="tagHit(item.class) ? 'background-color: #fff': ''"
                >
                  <el-tag
                    :type="tagHit(item.class) ? 'warning' : ''"
                    size="mini"
                  >{{changeClassShort(item.class)}}</el-tag>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div width="100%" style="text-align:center">
          <p
            class="name"
            :style="item.name.split('').length > 6 ? 'font-size: 12px;': '' "
          >{{item.name}}</p>
          <span class="name" v-if="showKey">{{showKey}}:{{item.stats[showKey]}}</span>
        </div>
      </div>
      <div class="fill-item img-container" v-for="item in fillItems" :key="item"></div>
    </div>
  </div>
</template>

<script>
// import Image from 'element-ui/packages/image/index.js';
import { Tag, Image } from 'element-ui';
import Vue from 'vue';
import { path, getClass_Short } from '../utils';

Vue.use(Image);
Vue.use(Tag);

export default {
  props: {
    data: Array,
    showKey: String,
    tags: Array,
    showTags: Boolean
  },
  components: {},
  data() {
    return {
      fillItems: [],
      moraleMode: false
    };
  },
  mounted() {
    const self = this;
    this.calFillAmount();
    window.addEventListener('resize', self.calFillAmount);
  },
  methods: {
    async openDetails(item) {
      console.log(item.name);
      if (this.moraleMode) {
        this.$emit('chose', item.name);
        return;
      }
      // await this.$vlf.setItem('dataUrl', item.url);
      // await this.$vlf.getItem('dataUrl');
      this.$router.push('/details/' + item.No);
    },
    calFillAmount() {
      if (!this.data) return;
      const width = this.$el.clientWidth,
        cWidth = this.$el.querySelector('.profile-item').clientWidth;

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
      return path + 'char/profile/' + name + '.png';
    },
    changeClassShort(c) {
      return getClass_Short(c);
    }
  }
};
</script>
<style >
.profile-item {
  position: relative;
  box-sizing: border-box;
}
.flip-list-move {
  transition: transform 1s;
}

.profile-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 100%;
  justify-content: space-around;
}
.img-container-wrapper {
  position: relative;
}

.img-container {
  width: 100px;
  height: 100px;
  padding: 10px;
}
.img-container img {
  width: 100%;
}

.name {
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.tag-wrapper-1 {
  position: absolute;
  top: 10px;
  right: 10px;
  direction: rtl;
}
.tag-wrapper-2 {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.tag-container {
  background-color: rgba(255, 255, 255, 0.8);
  display: inline-block;
  border-radius: 2px;
  font-size: 0;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
@media screen and (max-width: 700px) {
  .img-container {
    width: calc(85px + 1vw);
    height: calc(85px + 1vw);
  }
  .tag-wrapper-2 {
    width: 30px;
  }
}
@media screen and (max-width: 400px) {
  .name {
    font-size: 13px;
  }
}
</style>

