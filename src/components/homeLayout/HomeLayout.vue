<template>
  <div class="home-layout-wrapper">
    <div class="home-filter-wrapper" id="profile-panel">
      <filter-group
        label="职业"
        :filters="filterGroups.class"
        :short="short"
        @filter="resetFilter($event, 'class')"
      ></filter-group>
      <filter-group
        :short="short"
        label="星级"
        :filters="filterGroups.star"
        @filter="resetFilter($event, 'star')"
      ></filter-group>

      <div class="tags-popover-wrapper">
        <el-popover
          popper-class="tags-popover-container"
          placement="bottom-start"
          trigger="click"
          :visible-arrow="false"
        >
          <div slot="reference">
            <div class="tags-selected-container">
              <el-button
                :type="SelectedTagGz.length > 0 ?  'warning' : 'info'"
                :size="short? 'mini' :'medium'"
                round
                @change="OpenTagsPanel"
              >标签</el-button>
              <div class="tag-selected-content-container" style>
                <div
                  v-for="tag in SelectedTagGz"
                  :key="tag.value"
                  class="tags-selected-inner-container"
                >
                  <el-tag
                    :size="short? 'medium' :'normal'"
                    @close="handleClose(tag)"
                    closable
                    effect="dark"
                  >{{tag.text}}</el-tag>
                </div>
                <span
                  style="margin-left: 10px; color:rgb(160, 160, 160); cursor: pointer; margin-top: 6px; display: inline-block"
                  v-if="SelectedTagGz.length === 0 "
                >点击打开标签面板</span>
              </div>
            </div>
          </div>

          <filter-group
            :short="short"
            label="Tgas"
            :filters="filterGroups.tags"
            @filter="resetFilter($event, 'tags')"
            ref="tagFilter"
          ></filter-group>
          <filter-group
            :short="short"
            label="位置"
            :filters="filterGroups.position"
            @filter="resetFilter($event, 'position')"
          ></filter-group>
          <filter-group
            :short="short"
            label="性别"
            :filters="filterGroups.sex"
            @filter="resetFilter($event, 'sex')"
          ></filter-group>
          <filter-group
            :short="short"
            label="公招"
            :filters="filterGroups.gkzm"
            :single="true"
            @filter="resetFilter($event, 'gkzm')"
            ref="gkzm"
          ></filter-group>
          <div style="direction: rtl">
            <el-button class="close-button" @click="$el.click()" type="danger" size="mini">
              <i class="el-icon-close"></i>
            </el-button>
          </div>
        </el-popover>
      </div>
    </div>

    <el-tabs @tab-click="switchToNormal" style="padding: 0px" :value="currentMode">
      <el-tab-pane label="一般模式" name="profile-layout">
        <profile-layout
          :show-tags="showTag"
          ref="profile-layout"
          :tags="SelectedTag"
          :filter-groups="filterGroups"
          :data="data"
          :webpOk="webpOk"
          :short="short"
        ></profile-layout>
      </el-tab-pane>
      <el-tab-pane name="new-profile-layout" label="排列组合">
        <new-profile-layout
          :webp-ok="webpOk"
          :tags="SelectedTag"
          :filterGroups="filterGroups"
          :data="data"
        ></new-profile-layout>
      </el-tab-pane>
      <el-tab-pane name="expalain" label="说明">
        <div style="padding: 0 20px">
          <p>1.选了标签（公招）的Tag之后，筛选模式会发生变化</p>
          <p>2.【职业】、【星级】这些分类名，点击可以取消全部选择。</p>
          <p>3.还没想到要说什么。。。对了，这个说明面板还要改</p>
          <p>4.配色还在调整</p>
          <p>5.反馈群799872783！</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FilterButtonGroup from '../FilterButtonGroup';
import ProfileLayout from './ProfileLayout';
import { sort, TagsArr, StarArr, class_chinese, webpOk } from '../utils';
import Vue from 'vue';
import { Button, MessageBox, Popover, Tag, Tabs, TabPane } from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TabPane);

import localforage from 'localforage';

import loadingC from '../Loading';

const newProfileLayout = () => ({
  component: import(
    /* webpackChunkName: "newProfileLayout" */ './newProfileLayout'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

const gkzm = [{ isTag: false, text: '仅公招', value: true, short: '公招' }];
const position = [
  { isTag: false, text: '远程位', value: '远程位', short: '远程位' },
  { isTag: false, text: '近战位', value: '近战位', short: '近战位' }
];

const sex = [
  { isTag: false, text: '男性干员', value: '男', short: '男' },
  { isTag: false, text: '女性干员', value: '女', short: '女' }
];

if (typeof Array.prototype.flat !== 'function') {
  Array.prototype.flat = function(num) {
    return this.reduce((pre, cur) => pre.concat(cur));
  };
}

const explain = '';

export default {
  components: {
    'filter-group': FilterButtonGroup,
    'profile-layout': ProfileLayout,
    'new-profile-layout': newProfileLayout
  },
  props: {
    profileList: Array
  },
  data() {
    return {
      short: false,
      data: null,
      rowData: this.profileList,
      showKey: '',
      filtersLength: 0,
      sortDe: [],
      showTag: false,
      store: null,
      SelectedTag: [],
      SelectedTagGz: [],
      showExplain: ['1'],
      showOtherPanel: false,
      currentMode: 'profile-layout',
      webpOk: webpOk
    };
  },
  created() {
    this.short = window.innerWidth < 500 ? true : false;
    if (this.short) this.showExplain = [];
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  mounted() {
    this.store = localforage.createInstance({
      name: 'testDB'
    });

    this.store.getItem('filterGroups').then(filterGroups => {
      if (filterGroups) {
        // this.$set(this, 'filterGroups', filterGroups);
        Object.keys(filterGroups).forEach(el => {
          if (filterGroups[el][0].isTag === undefined)
            console.log('不读缓存， 更新数据' + el);
          else {
            this.$set(this.filterGroups, el, filterGroups[el]);
          }
        });
        this.resetFilter();
      }
    });
  },
  computed: {
    filterGroups() {
      return {
        gkzm: gkzm,
        star: StarArr,
        position: position,
        class: Object.values(class_chinese),
        tags: TagsArr,
        sex: sex
      };
    },
    orAgents() {
      return this.rowData.filter(el => el.gkzm);
    }
  },
  methods: {
    switchToNormal(tab) {
      if (this.currentMode === 'profile-layout')
        this.$nextTick().then(() => {
          this.$refs['profile-layout'].calFillAmount();
        });
    },
    openExpain() {
      MessageBox.alert(explain, {
        dangerouslyUseHTMLString: true
      });
    },
    handleClose(tag) {
      tag.chosed = false;
      this.resetFilter();
    },
    sortData(key) {
      const less = this.showTag
        ? (a, b) => {
          return a.tagHit === b.tagHit
            ? a.index > b.index
            : a.tagHit > b.tagHit;
        }
        : (a, b) => a.index > b.index;

      this.data = [...sort(key, less)];
    },
    async resetFilter(group, p) {
      this.store.setItem('filterGroups', this.filterGroups);

      //判定是否是公招模式
      let targetData = this.filterGroups.gkzm[0].chosed
        ? this.orAgents
        : this.rowData;

      const starFilter = this.filterGroups.star.filter(el => el.chosed);
      targetData =
        starFilter.length > 0
          ? targetData.filter(
            el =>
              starFilter.findIndex(star => Number(star.value) === el.star) >
                -1
          )
          : targetData;
      const filters = Object.keys(this.filterGroups).map(el => [
        el,
        this.filterGroups[el].filter(el => el.chosed)
      ]);

      //所有选择的标签，包括公招、星级、职业、Tags
      this.SelectedTag = [...filters.map(el => el[1])].flat(1);

      //公招用的Tags,用于显示在角色头像旁边
      this.SelectedTagGz = [
        ...filters
          .filter(el => el[0] !== 'star' && el[0] !== 'class')
          .map(el => el[1])
      ].flat(1);

      this.showTag = this.SelectedTagGz.length > 0 ? true : false;

      //是否过滤
      const isFilter = filters
        .map(el => el[1].length && el[0] !== 'star' && el[0] !== 'gkzm')
        .reduce((pre, cur) => pre + cur);

      if (isFilter > 0) {
        //重新筛选， 重置tagHit
        targetData.forEach(el => this.$set(el, 'tagHit', 0));
        targetData = targetData.filter(el => {
          let find = !this.showTag;

          for (let data of filters) {
            const group = data[1];

            //没有、或者是星级、公开招募则跳过判定
            if (group.length < 1 || data[0] === 'gkzm' || data[0] === 'star') {
              continue;
            }

            //多选筛选(公招模式)，不需要break
            if (this.showTag && data[0] === 'tags') {
              el.tags.forEach(tag => {
                if (group.find(t => t.value === tag)) {
                  find = true;
                  el.tagHit++;
                }
              });
              continue;
            }

            //单选筛选，需要break
            const propertys = data[0].split('.');
            let groupFind = false;
            for (let i in group) {
              let key = el;
              for (let i = 0; i < propertys.length; i++) {
                key = key[propertys[i]];
              }

              if (String(key) === String(group[i].value)) {
                el.tagHit++;
                groupFind = true;
                break;
              }
            }

            //普通筛选，有一个不符合，即终止循环，返回false
            if (!this.showTag) {
              if (!groupFind) {
                find = false;
                break;
              }
            }

            //Tags模式，找到了就真，找不到，就保持原值。
            find = groupFind ? groupFind : find;
          }
          return find;
        });
      }

      this.sortData(targetData);
      await this.$nextTick();
      if (targetData.length > 0) {
        //等tag消失的动画结束
        setTimeout(() => {
          if (this.currentMode === 'profile-layout')
            this.$refs['profile-layout'].calFillAmount();
        }, 500);
      }
    },

    OpenTagsPanel() {
      this.showTag = !this.showTag;
      if (!this.showTag) {
        this.$set(this.filterGroups.gkzm[0], 'chosed', false);
      } else {
        this.$set(this.filterGroups.gkzm[0], 'chosed', true);
      }
      this.resetFilter();
    }
  }
};
</script>
<style>
.home-filter-wrapper {
  margin-bottom: 20px;
  /* border-bottom: 1px solid rgba(158, 158, 158, 0.4); */
}
.sort-group-wrapper {
  margin-left: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: left;
}

.home-layout-wrapper {
  padding-top: 20px;
  max-width: 1000px;
  min-height: 500px;
  margin: 0 auto;
}

.tags-popover-wrapper {
  margin-left: 10px;
}

.tags-selected-container button {
  vertical-align: top;
  margin-top: 3px;
}

.tags-selected-inner-container {
  display: inline-block;
  margin: 5px 5px;
}

.filter-wrapper .el-button--warning,
.tags-popover-wrapper .el-button--warning {
  background-color: #ca3e47;
  border-color: rgba(202, 62, 71, 0.6);
}

.tags-popover-wrapper .el-button--info {
  background-color: #313131;
  border-color: rgba(49, 49, 49, 0.54);
}
.explain-container {
  margin-top: 15px;
  padding: 0 10px;
}

.other-masking {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: -1;
}

.control-container {
  margin: 10px;
  border-bottom: 1px solid #414141;
}

.tag-selected-content-container {
  display: inline-block;
  width: calc(100% - 80px);
}

.tags-selected-inner-container > .el-tag--dark {
  background-color: #414141;
  border-color: #414141;
}

.home-layout-wrapper .el-button:focus,
.home-layout-wrapper .el-button:hover {
  color: rgb(82, 82, 82);
  background-color: #fff;
  border-color: rgba(49, 49, 49);
}

@media screen and (max-width: 495px) {
  .tag-selected-content-container {
    display: inline-block;
    width: calc(100% - 62px);
  }

  .tags-selected-container button {
    margin-top: 6px;
  }
}
</style>
