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

      <el-collapse @change="OpenTagsPanel">
        <el-collapse-item>
          <template slot="title">
            <span style="direction:rtl;width: 100%">Tags</span>
          </template>
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
            label="公招"
            :filters="filterGroups.gkzm"
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
import { sort, TagsArr, StarArr, class_chinese } from '../utils';
import Vue from 'vue';
import { Button, Collapse, CollapseItem } from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(CollapseItem);
import Vlf from 'vlf';
Vue.use(Vlf);

const gkzm = [{ text: '仅公招', value: true, short: '公招' }];
const position = [
  { text: '远程位', value: '远程位', short: '远程位' },
  { text: '近战位', value: '近战位', short: '近战位' }
];

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
      data: null,
      rowData: this.profileList,

      showKey: '',
      filtersLength: 0,
      sortDe: [],
      showTag: false,
      store: null,
      SelectedTag: []
    };
  },
  created() {
    this.short = window.innerWidth < 500 ? true : false;
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  mounted() {
    this.$vlf
      .createInstance({
        name: 'testDB'
      })
      .then(async store => {
        this.store = store;
        const filterGroups = await store.getItem('filterGroups').then(data => {
          console.log(data);
          return data;
        });
        console.log(`filterGroups: ${filterGroups}`);
        if (filterGroups) {
          // this.$set(this, 'filterGroups', filterGroups);
          Object.keys(filterGroups).forEach(el => {
            console.log(el);
            this.$set(this.filterGroups, el, filterGroups[el]);
          });
        }
        this.resetFilter();
      });
  },
  computed: {
    filterGroups() {
      return {
        gkzm: gkzm,
        star: StarArr,
        position: position,
        class: Object.values(class_chinese),
        tags: TagsArr
      };
    },
    // SelectedTag() {
    //   return Object.values(this.filterGroups)
    //     .map(el => {
    //       const res = el.filter(el => {
    //         console.log(el);
    //         return el.chosed;
    //       });
    //       console.log(res);
    //       return res;
    //     })
    //     .reduce((pre, cur) => pre.concat(cur));
    // },
    orAgents() {
      return this.rowData.filter(el => el.gkzm);
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
      // if (p) this.$set(this.filterGroups, p, group);
      this.store.setItem('filterGroups', this.filterGroups).then(async err => {
        // console.log(err);
        // const filterGroups = await this.store
        //   .getItem('filterGroups')
        //   .then(data => {
        //     console.log(data);
        //     return data;
        //   });
        // console.log(filterGroups);
      });
      // console.log(this.filterGroups);
      // console.log(this.store);
      //判定是否是公招模式
      let targetData = this.filterGroups.gkzm[0].chosed
        ? this.orAgents
        : this.rowData;
      // debugger;
      console.log(targetData.length);
      //如果筛选为空则跳过筛选，返回原值
      const filters = Object.keys(this.filterGroups).map(el => [
        el,
        this.filterGroups[el].filter(el => el.chosed)
      ]);
      console.log(filters);
      this.SelectedTag = [...filters.map(el => el[1])].flat(10);

      console.log(this.SelectedTag);
      let isFilter = filters
        .map(el => el[1].length)
        .reduce((pre, cur) => pre + cur);

      if (this.filterGroups.gkzm[0].chosed) isFilter -= 1;

      console.log(isFilter);
      if (isFilter > 0) {
        //重新筛选， 重置tagHit
        targetData.forEach(el => this.$set(el, 'tagHit', 0));

        targetData = targetData.filter(el => {
          let find = !this.showTag;

          for (let data of filters) {
            const group = data[1];

            //没有、或者是星级、公开招募则跳过判定
            if (group.length < 1 || data[0] === 'gkzm') {
              continue;
            }

            //多选筛选，不需要break
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

      this.data = targetData;
      this.$nextTick().then(() => {
        if (targetData.length > 0) {
          this.sortData(targetData);
          this.$refs['profile-layout'].calFillAmount();
        }
      });
    },

    OpenTagsPanel() {
      this.showTag = !this.showTag;
      if (!this.showTag) {
        // this.filterGroups.tags = [];
        // this.$refs['tagFilter'].choseAll();
        // if (this.filterGroups.gkzm.length > 0) this.$refs['gkzm'].choseAll();
        // this.filterGroups.gkzm[0].chosed = true;
        this.$set(this.filterGroups.gkzm[0], 'chosed', false);

        // setTimeout(() => {}, 500);
      } else {
        this.$set(this.filterGroups.gkzm[0], 'chosed', true);
        // if (this.filterGroups.gkzm.length < 1) this.$refs['gkzm'].choseAll();
        // setTimeout(() => {}, 500);
      }
      this.resetFilter();
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
