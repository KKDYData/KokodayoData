<template>
  <div>
    <transition-group name="flip-list" class="profile-container">
      <div
        v-for="(agent, index) in data"
        :key="agent.name"
        class="profile-item"
        @mouseover="hoverShowTag(true, index)"
        @mouseleave="hoverShowTag(false, index)"
      >
        <!--  -->
        <div class="profile-item-inner-wrapper" :class="{'show-tags': showTags || agent.showTags }">
          <c-image
            class="img-container"
            :alt="agent.name"
            :src="profilePath(agent.No)"
            @click.native="openDetails(agent)"
          />
          <transition name="slide-fade">
            <div v-if="showTags || agent.showTags" class="tag-wrapper-1">
              <div v-for="(tag, i) in agent.tags" :key="tag">
                <div v-if="i > 1 || i === 0 && tag > 3" class="tag-container long-tag">
                  <el-tag
                    :effect="tagHit(tag) ? 'dark' : 'plain'"
                    size="mini"
                  >{{ i === 0 ? tag === 5 ? '高级资深干员' : '资深干员' : tag }}</el-tag>
                </div>
              </div>
              <div class="tag-container long-tag double-tag-container">
                <el-tag effect="plain" type="info" size="mini" style="text-align: center">
                  <span
                    class="double-tag"
                    :style="tagHit(agent.class) ? 'background-color: #313131; color: #fff': ''"
                  >{{ changeClassShort(agent.class) }}</span>
                  <span
                    class="double-tag"
                    :style="tagHit(agent.tags[1]) ? 'background-color: #313131; color: #fff': ''"
                  >{{ agent.tags[1] === 'MELEE' ? '近' : '远' }}</span>
                </el-tag>
              </div>
            </div>
          </transition>
          <div class="name">
            <div
              class="name-inner-ch"
              :style="agent.name.split('').length > 6 ? 'font-size: 14px;': '' "
            >{{ agent.name }}</div>
            <div class="name-inner-en">{{ agent.en }}</div>
          </div>
        </div>
      </div>

      <div v-for="item in fillItems" :key="item" class="fill-item" :style="fillItemWidth" />
    </transition-group>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import { Tag } from 'element-ui'
Vue.use(Tag)
import CImage from '@/components/base/CImage'

import { getProfilePath } from '../../utils'
import { path } from '../../utils/listVer'
import { getClass_Chinese } from '../../utils/string'

import { rootPath } from '../../stats'

export default {
  components: {
    CImage
  },
  props: {
    data: {
      default() {
        return []
      },
      type: Array
    },
    showKey: {
      type: String,
      default: ''
    },
    tags: {
      default() {
        return []
      },
      type: Array
    },
    showTags: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      fillItems: [1, 2, 3, 4, 5, 6, 7],
      fillItemWidth: { width: '100px' },
      rowPath: path,
      path: rootPath
    }
  },
  computed: {
    ...mapState(['short'])
  },
  watch: {
    showTags: function (v) {
      console.log('show? ' + v)
      this.calFillAmount()
    },
    short: function (v) {
      this.calFillAmount()
    }
  },
  mounted() {
    // const self = this;
    this.calFillAmount()
    window.addEventListener('resize', self.calFillAmount)
  },
  methods: {
    hoverShowTag(t, index) {
      if (!this.short)
        this.$set(this.data[index], 'showTags', t)
    },
    async openDetails(agent) {
      if (this.short || process.env.NODE_ENV === 'development') this.$router.push(this.path + '/details/' + agent.No)
      else window.open(this.path + '/details/' + agent.No)
    },
    calFillAmount() {
      //通过css控制填充的margin？
      setTimeout(() => {
        const target = document.querySelector('.profile-item')
        const slice2 = x => +x.slice(0, -2)
        if (!target) return
        const style = getComputedStyle(target),
          cWidth = style.width,
          vr = style['margin-right'],
          vl = style['margin-left'],
          res = slice2(cWidth) + slice2(vr) + slice2(vl)

        this.fillItemWidth = { width: res + 'px' }
      }, 500)
    },
    tagHit(tag) {
      return this.tags.find(el => el.value === tag)
    },
    profilePath(name) {
      return getProfilePath(name)
    },
    changeClassShort(c) {
      return getClass_Chinese(c)
    }
  }
}
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

  //margin: 10px
  &:hover {
    filter: drop-shadow(1px 1px 1px #818181)
  }
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

//套个div包裹使得增减干员列表时有流畅的动画
.profile-item-inner-wrapper {
  position: relative
  cursor: pointer
  margin: 10px

  &.show-tags {
    width: 170px
  }
}

@media screen and (max-width: 1300px) {
  .profile-container {
    width: 870px
  }
}

@media screen and (max-width: 1200px) {
  .profile-container {
    width: 720px
  }
}

@media screen and (max-width: 1100px) {
  .profile-container {
    width: 620px
  }
}

@media screen and (max-width: 1000px) {
  .profile-container {
    width: vw(720)
  }

  .profile-item {
    &-inner-wrapper {
      margin: vw(5) vw(12)

      &.show-tags {
        width: vw(123)
      }
    }

    --imgWidth: vw(70)
  }
}

@media screen and (max-width: 900px) {
  .profile-container {
    width: vw(720)
  }

  .profile-item {
    &-inner-wrapper {
      margin: vw(5) vw(12 * 1.3)

      &.show-tags {
        width: vw(90 * 1.65)
      }
    }

    --imgWidth: vw(90)
  }
}

@media screen and (max-width: 700px) {
  .profile-item {
    //margin: 10px 5px
  }
}

@media screen and (max-width: 500px) {
  .tag-wrapper-1 {
    right: vw(10)
    font-size: vw(24)
  }

  .profile-item {
    &-inner-wrapper {
      margin: vw(15) vw(12)

      &.show-tags {
        width: calc(var(--imgWidth) * 1.74)
      }
    }

    --imgWidth: vw(180)
  }
}
</style>

