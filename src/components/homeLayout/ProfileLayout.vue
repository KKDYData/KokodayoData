<template>
  <div>
    <transition-group name="flip-list" class="profile-container">
      <div v-for="(agent, index) in data" :key="agent.name" class="profile-item" :class="dev">
        <!--  -->
        <div
          class="profile-item-inner-wrapper"
          :class="{'show-tags': showTags || agent.showTags }"
          @mouseover="hoverShowTag(true, index)"
          @mouseleave="hoverShowTag(false, index)"
        >
          <!-- class="img-container" -->
          <router-link :to="'/details/' + agent.No">
            <c-image :alt="agent.name" :src="profilePath(agent.No)" />
          </router-link>
          <transition name="slide-fade">
            <div v-if="showTags || agent.showTags" class="profile-item-tag">
              <div v-for="(tag, i) in agent.tags" :key="tag">
                <div v-if="i > 1 || i === 0 && tag > 3" class="tag-container long">
                  <el-tag
                    :effect="tagHit(tag) ? 'dark' : 'plain'"
                    size="mini"
                  >{{ i === 0 ? tag === 5 ? '高级资深干员' : '资深干员' : tag }}</el-tag>
                </div>
              </div>
              <div class="tag-container long double">
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
          <div class="profile-item-name">
            <div
              class="profile-item-name-inner-ch"
              :style="agent.name.split('').length > 6 ? 'font-size: 14px;': '' "
            >{{ agent.name }}</div>
            <div class="profile-item-name-inner-en">{{ agent.en }}</div>
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
    const { innerWidth } = window
    return {
      fillItems: [1, 2, 3, 4, 5, 6, 7],
      fillItemWidth: { width: '100px' },
      rowPath: path,
      path: rootPath,
      hoverAble: innerWidth > 1000
    }
  },
  computed: {
    ...mapState(['short']),
    dev() {
      return process.env.NODE_ENV === 'development' ? 'dev' : ''
      // return process.env.NODE_ENV !== 'development' ? 'dev' : ''
    }
  },
  watch: {
    showTags: function (v) {
      console.log('show? ' + v)
      setTimeout(() => {
        this.calFillAmount()
      }, 1500)
    },
  },
  mounted() {
    // const self = this;
    this.calFillAmount()
    window.addEventListener('resize', self.calFillAmount)
  },
  methods: {
    hoverShowTag(t, index) {
      if (!this.short && this.hoverAble)
        this.$set(this.data[index], 'showTags', t)
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
.tag-container {
  display: inline-block
  font-size: 0
  margin-bottom: 1px

  &.long {
    .el-tag {
      min-width: 48px
    }

    .el-tag--plain {
      color: #909399
    }
  }

  &.double {
    .el-tag--mini.el-tag {
      padding: 0
      font-size: 0
      overflow: hidden
      //border-radius: 3px
    }
  }

  .double-tag {
    display: inline-block
    height: 100%
    font-size: 12px
    padding: 0 5px

    &:first-child {
      border-right: 1px solid rgb(153, 153, 153)
    }
  }
}

.flip-list-move {
  transition: transform 0.5s ease-in-out
}

.flip-list-enter, .flip-list-leave-to {
  opacity: 0
}

.flip-list-leave-active {
  position: absolute
}

.slide-fade-enter-active {
  transition: all 0.5s ease
}

.slide-fade-leave-active {
  transition: all 1s ease
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(-50%)
  opacity: 1
}

.profile {
  &-container {
    display: flex
    flex-wrap: wrap
    margin: 20px auto 50px
    width: 100%
    justify-content: space-around
    --imgW: 106px
  }

  &-item {
    display: inline-block
    box-sizing: border-box
    padding: 10px
    border: 1px solid transparent

    &.dev {
      border: 1px solid red

      &-inner-wrapper {
        border: 1px solid black
      }
    }

    &:hover {
      filter: drop-shadow(1px 1px 1px #818181)
    }

    &-inner-wrapper {
      position: relative
      cursor: pointer
      transition: width 0.5s ease-out
      width: var(--imgW)
      height: calc(var(--imgW) * 1.17)
      box-sizing: border-box
      border: 1px solid transparent

      &.show-tags {
        width: 170px
      }
    }

    &-name {
      top: calc(var(--imgW) * 0.812)
      padding-left: 6px
      box-sizing: border-box
      position: absolute
      color: white
      font-family: 'FZYaSong-H-GBK'
      white-space: nowrap
      font-size: 0
      text-overflow: ellipsis
      text-shadow: 1px 0px 2px #313131
      z-index: 10

      &-inner-ch {
        min-width: 50px
        display: inline-block
        font-size: calc(var(--imgW) * 0.16)
        margin-top: 2px
        margin-bottom: -4px
      }

      &-inner-en {
        font-size: calc(var(--imgW) * 0.113)
        font-family: sans-serif
      }
    }

    &-tag {
      right: 7px
      width: 65px
      z-index: -10
      top: 0
      position: absolute
    }
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

padMode(size) {
  container = 730
  item = ((container / size))

  .profile {
    &-container {
      width: vw(container)
    }

    &-item {
      padding: calc(var(--imgW) * 0.1)

      &-inner-wrapper {
        width: vw(item)
        height: vw(item * 1.17)

        &.show-tags {
          width: vw(item * 1.56)
        }
      }

      &-name {
        top: vw(item * 0.78)

        &-inner-ch {
          //min-width: vw(item * 0.56)
          font-size: vw(item * 0.16)
          margin-top: vw(item * 0.05)
          margin-bottom: vw(item * -0.05)
          text-shadow: vw(2) 0px vw(2) #313131
        }

        &-inner-en {
          font-size: vw(item * 0.113)
        }
      }

      &-tag {
        right: vw(item * 0.02)
        width: vw(item * 0.6)
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  padMode(7)

  .profile-item {
    padding: vw(15) vw(7)

    &-inner-wrapper {
      overflow: visible
    }
  }
}

@media screen and (max-width: 700px) {
  padMode(6)

  //配合swiper
  .profile-container {
    margin: 0
  }
}

@media screen and (max-width: 500px) {
  padMode(3.3)

  .profile-item {
    padding: vw(15) vw(7)
    //padding-bottom: vw(5)
  }
}
</style>

