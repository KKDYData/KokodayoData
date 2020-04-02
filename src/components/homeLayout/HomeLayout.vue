<template>
  <div class="home-layout-wrapper">
    <div id="profile-panel" class="home-filter-wrapper">
      <filter-group
        ref="tokenFilter"
        label="切换"
        :filters="category.token"
        :single="true"
        default="profileList"
        @filter="switchData($event)"
      />
      <filter-group
        label="职业"
        :filters="filterGroups.class"
        :disabled="agentFilterDisabled"
        @filter="resetFilter($event, 'class')"
      />
      <filter-group
        label="星级"
        :filters="filterGroups.star"
        :disabled="agentFilterDisabled"
        @filter="resetFilter($event, 'star')"
      />
      <filter-group
        ref="gkzm"
        label="公招"
        :filters="filterGroups.gkzm"
        :single="true"
        :disabled="agentFilterDisabled"
        @filter="resetFilter($event, 'gkzm')"
      />
      <div class="tags-popover-wrapper" style="position: relative">
        <h-popover
          popper-class="tags-popover-container click"
          placement="bottom"
          trigger="click"
          :visible-arrow="false"
          :width="short ? 320 : 800"
          :disabled="agentFilterDisabled"
          :append-to-body="false"
        >
          <div slot="reference" class="tags-selected-container click">
            <el-button
              :type="SelectedTagGz.length > 0 ? 'danger' : 'info'"
              :size="short? 'mini' :'medium'"
              round
              :style="short ? 'margin-left: 1.33vw' : ''"
              :disabled="agentFilterDisabled"
            >标签</el-button>
            <div class="tag-selected-content-container">
              <div v-show="SelectedTagGz.length !== 0 ">
                <div
                  v-for="tag in SelectedTagGz"
                  :key="tag.value"
                  class="tags-selected-inner-container"
                >
                  <el-tag
                    :size="short? 'medium' :'normal'"
                    :closable="!agentFilterDisabled"
                    effect="dark"
                    :type="agentFilterDisabled ? 'info': ''"
                    @close="handleClose(tag)"
                  >{{ tag.text }}</el-tag>
                </div>
              </div>
              <span
                v-show="SelectedTagGz.length === 0 "
                class="tags-selected-container-text"
              >点击打开标签面板</span>
            </div>
          </div>

          <div>
            <filter-group
              ref="tagFilter"
              label="Tags"
              :filters="filterGroups.tags"
              @filter="resetFilter($event, 'tags')"
            />
            <div style="direction: rtl">
              <close-button />
            </div>
          </div>
        </h-popover>
      </div>
    </div>

    <el-tabs style="padding: 0px" :value="currentMode" @tab-click="switchToNormal">
      <el-tab-pane label="一般模式" name="profile-layout">
        <profile-layout
          v-if="currentMode === 'profile-layout'"
          ref="profile-layout"
          :show-tags="showTag"
          :tags="SelectedTag"
          :filter-groups="filterGroups"
          :data="data"
        />
      </el-tab-pane>
      <el-tab-pane name="new-profile-layout" label="公开招募" lazy>
        <new-profile-layout
          v-if="currentMode === 'new-profile-layout'"
          :tags="SelectedTag"
          :filter-groups="filterGroups"
          :data="data"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import { Button, Tag, Tabs, TabPane } from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.use(Button)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(TabPane)
import HPopover from '@/components/base/Popover'


import FilterButtonGroup from '../base/FilterButtonGroup'
import loadingC from '../base/Loading'
import ProfileLayout from './ProfileLayout'
import CloseButton from '../base/CloseButton'

import { sort } from '@/utils'
import { localStore } from '@/localStore'
import { TagsArr, class_chinese, StarArr } from '@/utils/string'


// ?筛选数组逻辑更换的日期
const version = 200117
const newProfileLayout = () => ({
  component: import(
    /* webpackChunkName: "newProfileLayout" */ './newProfileLayout'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
})

const gkzm = [{ isTag: false, text: '仅公招', value: true }]
const token = [
  { isTag: false, text: '干员', value: 'profileList' },
  { isTag: false, text: '召唤物', value: 'tokenList' },
]

if (typeof Array.prototype.flat !== 'function') {
  Array.prototype.flat = function (num) {
    return this.reduce((pre, cur) => pre.concat(cur))
  }
}

export default {
  metaInfo() {
    return {
      titleTemplate: 'Kokodayo | ArknightsData | kkdy 一个平平无奇的明日方舟数据库 1.0 Wiki|维基|数据',
      meta: [
        {
          vmid: 'description',
          name: 'Description',
          content: '干员数据、基建技能、语音、立绘、敌人图鉴、地图数据、计算器，公开招募，由Dr.阿凡提提供'
        }
      ]
    }
  },
  components: {
    'filter-group': FilterButtonGroup,
    ProfileLayout,
    newProfileLayout,
    CloseButton,
    HPopover
  },
  props: {
    profileList: {
      default() {
        return []
      },
      type: Array
    },
    tokenList: {
      default() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      data: null,
      rowData: this.profileList,
      showKey: '',
      filtersLength: 0,
      sortDe: [],
      showTag: false,
      store: null,
      SelectedTag: [],
      SelectedTagGz: [],
      showOtherPanel: false,
      currentMode: 'profile-layout',
      agentFilterDisabled: false
    }
  },

  computed: {
    ...mapState(['short', 'extraSkins']),
    filterGroups() {
      return {
        gkzm,
        star: StarArr,
        class: Object.values(class_chinese),
        tags: TagsArr,
      }
    },
    category() {
      return {
        token
      }
    },
    orAgents() {
      return this.rowData.filter(el => el.gkzm)
    }
  },
  beforeMount() {
    this.store = localStore()
    this.store.getItem('filterGroups').then(filterGroups => {
      if (filterGroups && filterGroups._version === version) {
        //恢复上次的筛选条件
        Object.keys(filterGroups).forEach(key => {
          if (key !== '_version')
            this.$set(this.filterGroups, key, filterGroups[key])
        })
        console.log('reset')
        this.data = this.profileList
        this.resetFilter()
      } else {
        console.log('_noVersion')
        this.store.setItem('_filterVersion', version)
        this.data = this.profileList
      }
    })
  },
  methods: {
    switchData(e) {
      this.rowData = e.length === 1 ? this[e[0].value] : this.profileList
      if (e[0].value !== 'profileList') {
        this.data = this.rowData
        this.agentFilterDisabled = true
      }
      else {
        this.agentFilterDisabled = false
        this.resetFilter()
      }
    },
    getClientWidth() {
      return this.$el.clientWidth - 50
    },
    switchToNormal(tab) {
      this.currentMode = tab.name
      if (tab.name === 'profile-layout')
        this.$nextTick().then(() => {
          this.$refs['profile-layout'] &&
            this.$refs['profile-layout'].calFillAmount()
        })
    },
    handleClose(tag) {
      tag.chosed = false
      this.resetFilter()
    },
    sortData(key) {
      const less = this.showTag
        ? (a, b) => {
          return a.tagHit === b.tagHit
            ? a.index > b.index
            : a.tagHit > b.tagHit
        }
        : (a, b) => a.index > b.index
      this.data = [...sort(key, less)]
    },

    async resetFilter(group, p) {
      const saveTask = () => {
        this.store.setItem('filterGroups', {
          ...this.filterGroups,
          _version: version
        })
      }
      setTimeout(saveTask, 1000)

      //判定是否是公招模式
      let targetData = this.filterGroups.gkzm[0].chosed
        ? this.orAgents
        : this.rowData

      const starFilter = this.filterGroups.star.filter(el => el.chosed)
      targetData =
        starFilter.length > 0
          ? targetData.filter(
            el =>
              starFilter.findIndex(
                star => Number(star.value) === el.tags[0]
              ) > -1
          )
          : targetData
      const filters = Object.keys(this.filterGroups).map(el => [
        el,
        this.filterGroups[el].filter(el => el.chosed)
      ])

      //所有选择的标签，包括公招、星级、职业、Tags
      this.SelectedTag = [...filters.map(el => el[1])].flat(1)

      //公招用的Tags,用于显示在角色头像旁边
      this.SelectedTagGz = [
        ...filters
          .filter(el => el[0] !== 'star' && el[0] !== 'class')
          .map(el => el[1])
      ].flat(1)

      this.showTag = this.SelectedTagGz.length > 0 ? true : false
      //是否过滤
      const isFilter = filters
        .map(el => el[1].length && el[0] !== 'star' && el[0] !== 'gkzm')
        .reduce((pre, cur) => pre + cur)
      if (isFilter > 0) {
        //重新筛选， 重置tagHit
        targetData.forEach(el => this.$set(el, 'tagHit', 0))
        targetData = targetData.filter(el => {
          let find = !this.showTag

          for (let data of filters) {
            const group = data[1]

            //没有、或者是星级、公开招募则跳过判定
            if (group.length < 1 || data[0] === 'gkzm' || data[0] === 'star') {
              continue
            }

            //多选筛选(公招模式)，不需要break, Tags
            if (this.showTag && data[0] === 'tags') {
              el.tags.forEach(tag => {
                if (group.find(t => t.value === tag)) {
                  find = true
                  el.tagHit++
                }
              })
              continue
            }

            //单选筛选，需要break
            const propertys = data[0].split('.')
            let groupFind = false
            for (let i in group) {
              let key = el
              for (let i = 0;i < propertys.length;i++) {
                key = key[propertys[i]]
              }

              if (String(key) === String(group[i].value)) {
                el.tagHit++
                groupFind = true
                break
              }
            }

            //普通筛选，有一个不符合，即终止循环，返回false
            if (!this.showTag) {
              if (!groupFind) {
                find = false
                break
              }
            }

            //Tags模式，找到了就真，找不到，就保持原值。
            find = groupFind ? groupFind : find
          }
          return find
        })
      }
      this.sortData(targetData)
    }
  }
}
</script>
<style lang="stylus">
.home-filter-wrapper {
  margin-bottom: 20px
  padding: 10px
  /*border-bottom: 1px solid rgba(158, 158, 158, 0.4);*/
}

.sort-group-wrapper {
  margin-left: 10px
  margin-bottom: 20px
  display: flex
  justify-content: left
}

.home-layout-wrapper {
  padding-top: 20px
  max-width: 1000px
  min-height: 500px
}

.tags-popover-wrapper {
  margin-left: 10px
}

.tags-selected-container {
  display: flex
  align-items: center

  &-text {
    color: rgb(160, 160, 160)
    cursor: pointer
    margin-top: 6px
    margin-left: 10px
  }

  button {
    vertical-align: top
    margin-top: 3px
    margin: 5px 0
  }
}

.tags-selected-inner-container {
  display: inline-block
  margin: 5px 5px
}

/*.tags-popover-wrapper .el-button--info {
  background-color: #313131;
  border-color: rgba(49, 49, 49, 0.54);
}*/
.explain-container {
  margin-top: 15px
  padding: 0 10px
}

.other-masking {
  position: absolute
  top: 0
  left: 0
  height: 100vh
  width: 100vw
  z-index: -1
}

.control-container {
  margin: 10px
  border-bottom: 1px solid #414141
}

.tag-selected-content-container {
  display: inline-block
  width: calc(100% - 80px)
}

@media screen and (max-width: 495px) {
  .tag-selected-content-container {
    display: inline-block
    width: calc(100% - 80px)
  }

  .home-filter-wrapper {
    padding: 0px
  }
}
</style>
