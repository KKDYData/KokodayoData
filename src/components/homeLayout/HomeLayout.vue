<template>
  <div class="home-layout-wrapper">
    <div class="home-filter-wrapper" id="profile-panel">
      <filter-group
        label="职业"
        :filters="classData()"
        :short="short"
        @filter="resetFilter($event, 'class')"
      ></filter-group>
      <filter-group
        :short="short"
        label="星级"
        :filters="[{text:1, value:'0', short:1}, {text:2, value:'1', short:2},{text:3, value:'2', short:3},
        {text:4, value: '3', short: 4},{text:5, value:'4', short:5},{text:6, value:'5', short:6},]"
        @filter="resetFilter($event, 'star')"
      ></filter-group>

      <el-collapse @change="OpenTagsPanel">
        <el-collapse-item>
          <template slot="title">
            <span style="direction:rtl;width: 100%">Tags</span>
          </template>
          <filter-group
            :short="short"
            label="Tgas"
            :filters="Tags"
            @filter="resetFilter($event, 'tags')"
            ref="tagFilter"
          ></filter-group>
          <filter-group
            :short="short"
            label="位置"
            :filters="[{text: '远程位', value: '远程位', short: '远程位'},
            {text: '近战位', value: '近战位', short: '近战位'}]"
            @filter="resetFilter($event, 'position')"
          ></filter-group>
          <filter-group
            :short="short"
            label="公招"
            :filters="[{text: '仅公招', value: true, short: '公招'}]"
            :single="true"
            @filter="resetFilter($event, 'gkzm')"
            ref="gkzm"
          ></filter-group>
          <el-collapse>
            <el-collapse-item title="说明">
              <template slot="title">
                <span style="margin-left: 20px;width: 100%">说明</span>
              </template>
              <p style="padding: 0 25px">1.打开这个面板之后，筛选会从符合所有条件就出现，变成，只要符合其中一个就出现。</p>
              <p
                style="padding: 0 25px"
              >2.但【仅公招】和【星级】除外，选了这个两个，就会先把列表变成满足条件后(去掉不满足的)，再进行职业，Tags，位置筛选。</p>
              <p style="padding: 0 25px">3.关闭列表后，就会变成普通的筛选模式</p>
              <p style="padding: 0 25px">
                <del>4.动画又加回来了，如果感觉不合适，之后还会调整</del>
              </p>
              <p>4.Tags的折叠版活不到12号！</p>
              <p style="padding: 0 25px">5.Tags补充一个【爆发】</p>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
    <profile-layout :showTags="showTag" ref="profile-layout" :tags="SelectedTag" :data="data"></profile-layout>
  </div>
</template>
<script>
import FilterButtonGroup from '../FilterButtonGroup';
import ProfileLayout from './ProfileLayout';
import { sort, TagsArr, class_chinese } from '../utils';
import Vue from 'vue';
import { Button, Collapse, CollapseItem } from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(CollapseItem);

export default {
  components: {
    'filter-group': FilterButtonGroup,
    'profile-layout': ProfileLayout
  },
  props: {
    profileList: Array
  },
  data() {
    return {
      short: false,
      data: this.profileList,
      rowData: this.profileList,
      filterGroups: {
        gkzm: [],
        tags: [],
        star: [],
        class: [],
        position: []
      },
      showKey: '',
      filtersLength: 0,
      sortDe: [],
      showTag: false
    };
  },
  created() {
    this.short = window.innerWidth < 500 ? true : false;
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  mounted() {},
  computed: {
    Tags() {
      return TagsArr;
    },
    SelectedTag() {
      return Object.values(this.filterGroups).reduce((pre, cur) =>
        pre.concat(cur)
      );
    }
  },
  methods: {
    sortData(key) {
      const less = this.showTag
        ? (a, b) => {
          return a.tagHit === b.tagHit
            ? a.index > b.index
            : a.tagHit > b.tagHit;
        }
        : (a, b) => a.index > b.index;

      this.data = [...sort(this.data, less)];
    },
    resetFilter(group, p) {
      this.$set(this.filterGroups, p, group);

      let targetData = this.rowData;

      if (this.filterGroups.gkzm.length > 0) {
        targetData = targetData.filter(el => {
          return el.gkzm;
        });
      }
      if (this.filterGroups.star.length > 0) {
        targetData = targetData.filter(el => {
          return this.filterGroups.star.find(
            star => star.value === String(el.star)
          );
        });
      }

      if (
        this.filterGroups.tags.length > 0 ||
        this.filterGroups.class.length > 0 ||
        this.filterGroups.position.length > 0
      ) {
        //重新筛选， 重置tagHit
        targetData.forEach(el => this.$set(el, 'tagHit', 0));

        targetData = targetData.filter(el => {
          let find = !this.showTag;

          for (let key of Object.keys(this.filterGroups)) {
            if (
              this.filterGroups[key].length < 1 ||
              key === 'star' ||
              key === 'gkzm'
            ) {
              continue;
            }
            const group = this.filterGroups[key];

            //多选筛选，不需要break
            if (this.showTag && key === 'tags') {
              el.tags.forEach(tag => {
                if (group.find(t => t.value === tag)) {
                  find = true;
                  el.tagHit++;
                }
              });
              continue;
            }

            //单选筛选，需要break
            const propertys = key.split('.');
            let groupFind = false;
            for (let i in group) {
              let key = el;
              for (let i = 0; i < propertys.length; i++) {
                key = key[propertys[i]];
              }

              if (String(key) === String(group[i].value)) {
                ++el.tagHit;
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

      this.data = targetData;
      this.$nextTick().then(() => {
        if (targetData.length > 0) {
          this.sortData(targetData);
          this.$refs['profile-layout'].calFillAmount();
        }
      });
    },

    classData() {
      return Object.values(class_chinese);
    },
    OpenTagsPanel() {
      this.showTag = !this.showTag;
      if (!this.showTag) {
        this.filterGroups.tags = [];
        this.$refs['tagFilter'].choseAll();
        if (this.filterGroups.gkzm.length > 0) this.$refs['gkzm'].choseAll();
        // setTimeout(() => {}, 500);
      } else {
        if (this.filterGroups.gkzm.length < 1) this.$refs['gkzm'].choseAll();
        // setTimeout(() => {}, 500);
      }
    }
  }
};
</script>
<style>
.home-filter-wrapper {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(158, 158, 158, 0.4);
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
  margin: 0 auto;
}
</style>
