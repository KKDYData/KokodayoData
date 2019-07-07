<template>
  <div>
    <!-- <div class="profile-container"> -->
    <transition-group name="flip-list" class="profile-container">
      <div class="profile-item" v-for="agent in data" :key="agent.name" :title="agent.name">
        <div class="profile-item-inner-wrapper">
          <router-link :to="path + '/details/' + agent.No">
            <el-image
              fit="cover"
              class="img-container"
              style="box-shadow: 1px 1px 2px 1px rgba(102, 102, 102, 0.7);"
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
import { getClass_Chinese, getProfilePath, getClass_icon } from '../utils';

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
      fillItemWidth: { width: '100px' }
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
      // await this.$vlf.setItem('dataUrl', item.url);
      // await this.$vlf.getItem('dataUrl');
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
  background-color: #525252;
}

.name {
  text-overflow: ellipsis;
  width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  position: absolute;
  top: 112px;
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

@media screen and (max-width: 700px) {
  .profile-container {
    margin-top: 20px;
  }
  .profile-item {
    --imgWidth: calc(80px + 1vw);
  }

  .name {
    top: calc(100px + 1vw);
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
    height: calc(100px + 5vw);
  }
}
@media screen and (max-width: 400px) {
  .name {
    font-size: 13px;
  }
}
</style>

