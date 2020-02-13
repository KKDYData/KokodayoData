<template>
  <div class="new-profile-layout-container">
    <slot />
    <div style="margin-left: 10px; color: rgb(168,168,168)">
      <p>不用选仅公招！排列已经去掉了公招不出的干员。</p>
      <p>
        <span v-if="tags.length> 0">点击名字可以看详细Tag，再点击头像，可以跳转角色详情。</span>
        <span v-else>还没选任何Tag，所以这里没有东西</span>
      </p>
    </div>
    <div class="new-mode-group-container">
      <el-card
        v-for="item in sortData"
        :key="item.name"
        class="new-mode-group"
        style="margin-bottom: 20px"
      >
        <!-- <div>{{item[0]}}</div> -->
        <div class="new-mode-group-title">{{ item[0] }}</div>
        <div>
          <div
            v-for="agent in item[1].agents.sort((a, b) => b.tags[0] - a.tags[0])"
            :key="agent.name"
            class="new-mode-agent"
            :style="bgColor(agent.tags[0])"
          >
            <el-popover trigger="click">
              <div class="new-mode-popover">
                <router-link :to="path + '/details/' + agent.No">
                  <div class="img-container">
                    <c-image :alt="agent.name" :src="profilePath(agent.No)" />
                  </div>
                </router-link>
                <div class="new-mode-popover-details">
                  <div class="new-mode-popover-details-title new-mode-link">
                    <router-link :to="path + '/details/' + agent.No">
                      <span class="new-mode-popover-details-title-name">{{ agent.name }}</span>
                    </router-link>
                    <div class="new-mode-popover-class-icon">
                      <c-image :src="class_icon(agent.class)" />
                    </div>
                  </div>
                  <div style="margin-top: 5px;">
                    <template v-for="(tag, index) in agent.tags">
                      <el-tag
                        v-if="index === 0 && tag > 3 || index > 1"
                        :key="tag"
                        class="new-mode-popover-tag"
                        effect="dark"
                        size="mini"
                        type="info"
                      >{{ index === 0 ? tag === 5 ? '高级资深干员' : '资深干员' : tag }}</el-tag>
                    </template>
                  </div>
                </div>
              </div>
              <div slot="reference" class="click">
                <span style="cursor: pointer">{{ agent.name }}</span>
              </div>
            </el-popover>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>

// 排列组合
const arrange = (arr, index = 0, group = []) => {
  const res = []
  res.push([arr[index]])
  for (let i = 0; i < group.length; i++) {
    res.push([...group[i], arr[index]])
  }
  group = group.concat(res)
  if (index + 1 >= arr.length) return group
  else return arrange(arr, index + 1, group)
}

import {
  sort,
  getProfilePath,
  getClass_icon
} from '../../utils'

import { getClass_Chinese, starColor } from '../../utils/string'

import { mapState } from 'vuex'
import Vue from 'vue'

import { Card, Tag } from 'element-ui'
Vue.use(Card)
Vue.use(Tag)

import { rootPath } from '../../stats'
import CImage from '@/components/base/CImage'


export default {
  components: {
    CImage
  },
  props: {
    data: Array,
    showKey: String,
    tags: Array,
    showTags: Boolean,
    filterGroups: Object,
  },
  data() {
    return {
      path: rootPath
    }
  },
  computed: {
    ...mapState(['short']),
    sortData() {
      if (!this.data || this.tags.length === 0) return
      let res = new Map()
      const resData = this.data.filter(el => el.gkzm)
      // 去掉不是公招的
      const filterGroups = Object.keys(this.filterGroups)
        .filter(el => el !== 'gkzm')
        .map(key => ({
          key: key,
          filters: this.filterGroups[key].filter(el => el.chosed)
        }))

      console.log(filterGroups)

      resData.forEach(agent => {
        const hitTag = []

        filterGroups.forEach(group => {
          const key = group.key
          if (!group.filters.length) return

          if (Array.isArray(agent[key]))
            agent[key].forEach(tag => {

              let find = group.filters.find(el => el.value === tag)
              if (find) {
                hitTag.push(find)
              }
            })
          else {
            //? class | star
            const find = group.filters.find(el => el.value === agent[key])
            if (find) {
              hitTag.push(find)
            }
          }
        })

        if (hitTag.length === 0) return
        let resArr = arrange(hitTag).filter(el => el.length < 4)
        let i = resArr.length
        while (i-- > 0) {
          const key = sort(resArr[i].map(el => el.text), (a, b) => a > b).join('，')
          if (!res.get(key)) {
            res.set(key, { agents: [agent], keys: resArr[i] })
          } else {
            res.get(key).agents.push(agent)
          }
        }
      })
      // 滤掉6星
      res = [...res].map(el => {
        if (el[0].indexOf('高级资深干员') < 0) {
          el[1].agents = el[1].agents.filter(el => el.tags[0] < 5)
        }
        return el
      }).filter(el => el[1].agents.length)
      console.log('new LayoutFilter')

      res = sort(res, (a, b) => {
        const tempA = a[1].keys
        const tempB = b[1].keys
        if (tempA.length === 1 && tempB.length === 1) {
          return tempA[0].isTag > tempB[0].isTag
        } else {
          return tempB.length < tempA.length
        }
      })
      return res
    }
  },
  methods: {
    class_icon(c) {
      return getClass_icon(c)
    },
    changeClassShort(c) {
      return getClass_Chinese(c)
    },
    bgColor(star) {
      const targetColor = starColor[star]

      return {
        'background-color': `hsla(${targetColor[0]},${targetColor[1]}%, ${targetColor[2]}%, 1)`
      }
    },
    profilePath(name) {
      return getProfilePath(name, true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.new-mode-agent {
  display: inline-block
  padding: 5px
  color: white
  margin: 5px
  border-radius: 4px
  min-width: 25px
  text-align: center
}

.new-profile-layout-container {
  max-width: 950px
  background-color: white
}

.new-mode-link {
  span {
    /*color: white;*/
    color: black
    text-decoration: none
  }

  a {
    text-decoration: none
  }
}

.img-container {
  width: 60px
  height: 60px
}

.new-mode-group {
  min-width: 150px
  margin: 10px

  &-container {
    display: flex
    flex-wrap: wrap
  }

  &-title {
    border-bottom: 1px solid #818181
  }
}

.new-mode-popover {
  display: flex
  align-items: center
}

.new-mode-popover-details {
  margin-left: 10px
}

.new-mode-popover-tag {
  margin: 5px 5px 0
}

.new-mode-popover-class-icon {
  width: 20px
  height: 20px
  vertical-align: bottom
  margin-left: 4px
}

.new-mode-popover-details-title {
  font-size: 20px
  line-height: 100%
  display: flex
}

.new-mode-popover-tag.el-tag--dark.el-tag--info {
  background-color: #313131
  border-color: #313131
}
</style>

