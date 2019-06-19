<template>
  <div>
    <!-- <div class="profile-container"> -->
    <transition-group name="flip-list" class="profile-container">
      <div
        class="profile-item"
        @click="openDetails(item)"
        v-for="item in data"
        :key="item.name"
        :title="item.name"
      >
        <div class="profile-item-inner-wrapper">
          <el-image fit="cover" class="img-container" :alt="item.name" :src="profilePath(item.No)">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <transition name="slide-fade">
            <div class="tag-wrapper-1" v-if="showTags">
              <div v-for="tag in item.tags" :key="tag">
                <div class="tag-container">
                  <el-tag
                    :type="tagHit(tag) ? 'info' : 'info'"
                    :effect="tagHit(tag) ? 'dark' : 'plain'"
                    size="medium"
                    v-if="tag !== '' && tag !== 'null'"
                  >{{tag}}</el-tag>
                </div>
              </div>
              <div>
                <div class="tag-container">
                  <el-tag
                    :type="tagHit(item.position) ? 'info' : 'info'"
                    size="mini"
                    :effect="tagHit(item.position) ? 'dark' : 'plain'"
                  >{{item.position === '远程位' ? '远' : '近'}}</el-tag>
                </div>
                <div class="tag-container class-icon">
                  <el-image
                    class="img-container"
                    :style="tagHit(item.class) ? '' : 'opacity: 0.2'"
                    :alt="item.class"
                    :src="class_icon(item.class)"
                  ></el-image>
                </div>
              </div>
            </div>
          </transition>

          <div
            :class="showTags? 'name-tag-show name ' : 'name'"
            :style="showTags && item.star > 3 ? 'color: #ecc12d' : ''"
          >
            <span :style="item.name.split('').length > 6 ? 'font-size: 12px;': '' ">{{item.name}}</span>
            <span class="name" v-if="showKey">{{showKey}}:{{item.stats[showKey]}}</span>
          </div>
        </div>
      </div>

      <div
        class="fill-item img-container"
        :style="fillItemWidth"
        v-for="item in fillItems"
        :key="item"
      ></div>
      <!-- </div> -->
    </transition-group>
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
      moraleMode: false,
      fillItemWidth: { width: '100px' }
    };
  },
  mounted() {
    const self = this;
    this.calFillAmount();
    window.addEventListener('resize', self.calFillAmount);
  },
  methods: {
    class_icon(c) {
      return path + 'others/icon_profession_' + c.toLowerCase() + '.png';
    },
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
      return (
        path + 'char/profile/' + name + '.png?x-oss-process=style/small-test'
      );
    },
    changeClassShort(c) {
      return getClass_Short(c);
    }
  }
};
</script>
<style >
.flip-list-move {
  transition: transform 1s;
  transition-delay: 0.3;
}

.profile-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 100%;
  justify-content: space-around;
}
.profile-item {
  --imgWidth: 100px;
  position: relative;
  box-sizing: border-box;
}
.profile-item-inner-wrapper {
  padding: 10px;
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
}
.img-container img {
  width: 100%;
  background-color: rgba(51, 51, 51, 0.65);
}

.name {
  text-overflow: ellipsis;
  width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  position: absolute;
  top: 108px;
  /* left:50% */
}

.tag-wrapper-1 {
  margin-left: 10px;
  width: 65px;
}
.name-tag-show {
  top: -15px !important;
  padding-left: 5px;
  text-align: left;
  color: white;
  width: var(--imgWidth);
  background-color: rgba(0, 0, 0, 0.63);
  box-sizing: border-box;
  /* background-image: linear-gradient(
    to right,
    rgb(21, 16, 3),
    rgb(255, 255, 255)
  ); */
  /* transition: top 0.5s cubic-bezier(0.33, 1.01, 0.98, 0.99),
    background-color 0.3s 0.3s cubic-bezier(0.33, 1.01, 0.98, 0.99),
    color 0.3s 0.3s cubic-bezier(0.33, 1.01, 0.98, 0.99); */
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
@media screen and (max-width: 700px) {
  .profile-item {
    --imgWidth: calc(85px + 1vw);
  }

  .name {
    top: calc(100px + 1vw);
  }
  .tag-wrapper-2 {
    width: 30px;
  }
  .profile-item-inner-wrapper {
    height: calc(100px + 5vw);
  }
}
@media screen and (max-width: 400px) {
  .name {
    font-size: 13px;
  }
}
</style>

