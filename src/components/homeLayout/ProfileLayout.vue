<template>
  <div>
    <transition-group name="flip-list" class="profile-container">
      <div
        class="profile-item"
        v-for="(agent, index) in data"
        :key="agent.name"
        @mouseover="hoverShowTag(true, index)"
        @mouseleave="hoverShowTag(false, index)"
        :style="{ width: showTags || agent.showTags ? '170px' : 'var(--imgWidth)'}"
      >
        <!--  -->
        <div class="profile-item-inner-wrapper">
          <el-image
            class="img-container"
            fit="cover"
            :alt="agent.name"
            :src="profilePath(agent.No)"
            @click.native="openDetails(agent)"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <transition name="slide-fade">
            <div class="tag-wrapper-1" v-if="showTags || agent.showTags">
              <div v-for="(tag, index) in agent.tags" :key="tag">
                <div class="tag-container long-tag" v-if="index > 2 || index === 0 &&  tag > 3">
                  <el-tag
                    :effect="tagHit(tag) ? 'dark' : 'plain'"
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
                  >{{agent.tags[2] === 'MELEE' ? '近' : '远'}}</span>
                </el-tag>
              </div>
            </div>
          </transition>
          <div class="name">
            <div
              class="name-inner-ch"
              :style="agent.name.split('').length > 6 ? 'font-size: 14px;': '' "
            >{{agent.name}}</div>
            <div class="name-inner-en">
              {{agent.en}}
              <span
                v-if="showTags && tagHit(agent.tags[1])"
              >{{agent.tags[1] === '女' ? '♀' : '♂'}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="fill-item" :style="fillItemWidth" v-for="item in fillItems" :key="item"></div>
    </transition-group>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import { Tag, Image } from 'element-ui';
Vue.use(Image);
Vue.use(Tag);

import { getProfilePath, } from '../../utils';
import { path } from '../../utils/listVer';
import { getClass_Chinese, } from '../../utils/string';

import { rootPath } from '../../stats';

export default {
  props: {
    data: Array,
    showKey: String,
    tags: Array,
    showTags: Boolean,
  },
  components: {},
  data() {
    return {
      fillItems: [],
      fillItemWidth: { width: '100px' },
      rowPath: path,
      path: rootPath
    };
  },
  watch: {
    showTags: function (v) {
      console.log('show? ' + v);
      this.calFillAmount();
    },
    short: function (v) {
      this.calFillAmount();
    }
  },
  computed: {
    ...mapState(['short']),
  },

  mounted() {
    const self = this;
    this.calFillAmount();
    window.addEventListener('resize', self.calFillAmount);
  },
  methods: {
    hoverShowTag(t, index) {
      this.$set(this.data[index], 'showTags', t);
    },
    async openDetails(agent) {
      if (this.short) this.$router.push(this.path + '/details/' + agent.No);
      else window.open(this.path + '/details/' + agent.No);
    },
    calFillAmount() {
      //通过css控制填充的margin？
      setTimeout(() => {

        const width = this.$el.clientWidth,
          target = document.querySelector('.profile-item');
        const slice2 = x => +x.slice(0, -2);
        if (!target) return;
        const
          style = getComputedStyle(target),
          cWidth = style.width,
          vr = style['margin-right'],
          vl = style['margin-left'],
          res = slice2(cWidth) + slice2(vr) + slice2(vl);

        this.fillItemWidth = { width: res + 'px' };
        let size = Math.floor(width / res);
        const arr = [];
        for (let i = 0; i < size; i++) {
          arr.push(i);
        }
        this.fillItems = arr;
      }, 500);
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
<style lang="stylus" scoped>
.flip-list-move {
  transition: transform 1s ease-in-out
}

.flip-list-enter, .flip-list-leave-to {
  opacity: 0
}

.flip-list-leave-active {
  position: absolute
}

.profile-item {
  transition: all 0.6s ease-in-out
  display: inline-block
  --imgWidth: 106px
  box-sizing: border-box
  margin: 10px

  &:hover {
    filter: drop-shadow(1px 1px 1px #818181)
  }
}

//套个div包裹使得增减干员列表时有流畅的动画
.profile-item-inner-wrapper {
  position: relative
}

.tag-container {
  display: inline-block
  font-size: 0
  margin-bottom: 1px
}

.tag-container .el-tag {
  border-radius: 2px
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(-30px)
  opacity: 1
}

.profile-container {
  display: flex
  flex-wrap: wrap
  margin: 20px auto 50px
  width: 100%
  justify-content: space-around
}

.img-container {
  width: var(--imgWidth)
  height: calc(var(--imgWidth) * 1.17)

  img {
    width: 100%
  }
}

.long-tag .el-tag {
  min-width: 48px
}

.long-tag .el-tag--plain {
  color: #909399
}

.double-tag {
  display: inline-block
  height: 100%
  font-size: 12px
  padding: 0 5px
}

.double-tag-container .el-tag--mini.el-tag {
  padding: 0
  font-size: 0
  overflow: hidden
  border-radius: 3px
}

.double-tag:first-child {
  border-right: 1px solid rgb(153, 153, 153)
}

.tag-wrapper-1 {
  right: 7px
  width: 65px
  z-index: -10
  top: 0
  position: absolute
}

.name {
  top: calc(var(--imgWidth) * 0.812)
  padding-left: 6px
  box-sizing: border-box
  position: absolute
  //overflow: hidden
  color: white
  font-family: 'FZYaSong-H-GBK'
  white-space: nowrap
  font-size: 0
  text-overflow: ellipsis
  text-shadow: 1px 0px 2px #818181
  z-index: 10
}

.name-inner-ch {
  min-width: 50px
  display: inline-block
  font-size: calc(var(--imgWidth) * 0.16)
  margin-top: 2px
  margin-bottom: -2px
}

.name-inner-en {
  font-size: calc(var(--imgWidth) * 0.113)
  font-family: sans-serif
}

.name-slide-logo {
  width: 47px
  top: -18px
  position: absolute
  right: -10px
  z-index: -1
}

@media screen and (max-width: 700px) {
  .profile-item {
    margin: 10px 5px
  }
}

@media screen and (max-width: 375px) {
  .tag-wrapper-1 {
    right: 15px
  }

  .profile-item {
    --imgWidth: 96px
  }
}
</style>

