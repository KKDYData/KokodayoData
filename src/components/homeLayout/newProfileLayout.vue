<template>
  <div class="new-profile-layout-container">
    <slot></slot>
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
        <div>{{item[0]}}</div>
        <div>
          <div
            v-for="agent in item[1].agents.sort((a, b) => b.star - a.star)"
            :key="agent.name"
            class="other-mode-agent"
            :style="bgColor(agent.star)"
          >
            <el-popover trigger="click">
              <div class="other-mode-popover">
                <router-link :to="path + '/details/' + agent.No">
                  <el-image
                    fit="cover"
                    class="img-container"
                    :alt="agent.name"
                    :src="profilePath(agent.No)"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </router-link>
                <div class="other-mode-popover-details">
                  <div class="other-mode-popover-details-title other-mode-link">
                    <router-link :to="path + '/details/' + agent.No">
                      <span class="other-mode-popover-details-title-name">{{agent.name}}</span>
                      <span
                        :style="agent.sex === '女' ? 'color: pink;' : ''"
                      >{{agent.sex === '女' ? '♀' : '♂'}}</span>
                      <el-image
                        class="other-mode-popover-class-icon"
                        :alt="agent.class"
                        :title="changeClassShort(agent.class)"
                        :src="class_icon(agent.class)"
                      ></el-image>
                    </router-link>
                  </div>
                  <div style="margin-top: 10px;">
                    <el-tag
                      class="other-mode-popover-tag"
                      v-for="tag in agent.tags"
                      :key="tag"
                      effect="dark"
                      type="info"
                    >{{tag}}</el-tag>
                  </div>
                  <!-- <span>{{agent.tags}}</span> -->
                </div>
              </div>
              <div slot="reference">
                <span style="cursor: pointer">{{agent.name}}</span>
              </div>
            </el-popover>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
const arrange = (arr, index = 0, group = []) => {
  const res = [];
  res.push([arr[index]]);
  for (let i = 0; i < group.length; i++) {
    res.push([...group[i], arr[index]]);
  }
  group = group.concat(res);
  // debugger;
  if (index + 1 >= arr.length) return group;
  else return arrange(arr, index + 1, group);
};

import {
  sort,
  getClass_Chinese,
  getProfilePath,
  getClass_icon
} from '../utils';
import { Card, Tag } from 'element-ui';
import Vue from 'vue';
Vue.use(Card);
Vue.use(Tag);

import Mode from '../../stats';

export default {
  props: {
    data: Array,
    showKey: String,
    tags: Array,
    showTags: Boolean,
    short: Boolean,
    filterGroups: Object,
    webpOk: Boolean
  },

  computed: {
    path() {
      return process.env.NODE_ENV === 'development' ? '' : Mode;
    },
    sortData() {
      if (!this.data || this.tags.length === 0) return;
      let res = new Map();
      const resData = this.data.filter(el => el.gkzm);
      const filterGroups = Object.keys(this.filterGroups)
        .filter(el => el !== 'gkzm')
        .map(key => ({
          key: key,
          filters: this.filterGroups[key].filter(el => el.chosed)
        }));
      resData.forEach(agent => {
        const hitTag = [];

        filterGroups.forEach(group => {
          const key = group.key;
          if (!group.filters.length) return;

          if (Array.isArray(agent[key]))
            agent[key].forEach(tag => {
              const find = group.filters.find(el => el.value === tag);
              if (find) {
                hitTag.push(find);
              }
            });
          else {
            const find = group.filters.find(el => el.value === agent[key]);
            if (find) {
              hitTag.push(find);
            }
          }
        });

        if (hitTag.length === 0) return;
        let resArr = arrange(hitTag);
        let i = resArr.length;
        while (i-- > 0) {
          const key = sort(resArr[i].map(el => el.text), (a, b) => a > b).join(
            ','
          );
          if (!res.get(key)) {
            res.set(key, { agents: [agent], keys: resArr[i] });
          } else {
            res.get(key).agents.push(agent);
          }
        }
      });
      res = sort([...res], (a, b) => {
        const tempA = a[1].keys;
        const tempB = b[1].keys;
        if (tempA.length === 1 && tempB.length === 1) {
          return tempA[0].isTag > tempB[0].isTag;
        } else {
          return tempB.length < tempA.length;
        }
      });
      return res;
    }
  },
  methods: {
    class_icon(c) {
      return getClass_icon(c);
    },
    changeClassShort(c) {
      return getClass_Chinese(c);
    },
    bgColor(star) {
      const colors = {
        0: 'background-color: rgb(84, 92, 100);',
        1: 'background-color: rgb(84, 92, 100);',
        2: 'background-color: hsla(223, 25%, 65%, 1);',
        3: 'background-color:  hsla(223, 81%, 65%, 1);',
        4: 'background-color: hsla(36, 100%, 65%, 1);',
        5: 'background-color: rgb(255, 208, 75);'
      };
      return colors[star];
    },
    profilePath(name) {
      return getProfilePath(name, this.webpOk);
    }
  }
};
</script>

<style scoped>
.other-mode-agent {
  display: inline-block;
  padding: 5px;
  color: white;
  margin: 5px;
  border-radius: 4px;
  min-width: 25px;
  text-align: center;
}

.new-profile-layout-container {
  /* width: calc(100vw - 40px); */
  /* max-height: 70vh; */
  max-width: 950px;
  background-color: white;
}
.other-mode-link span {
  /* color: white; */
  color: black;
  text-decoration: none;
}
.other-mode-link a {
  text-decoration: none;
}

.img-container {
  width: 60px;
  height: 60px;
}
.new-mode-group-container {
  display: flex;
  flex-wrap: wrap;
}
.new-mode-group {
  min-width: 150px;
  margin: 10px;
}

.other-mode-popover {
  display: flex;
}

.other-mode-popover-details {
  margin-left: 10px;
}

.other-mode-popover-tag + .other-mode-popover-tag {
  margin-left: 5px;
}

.other-mode-popover-class-icon {
  width: 20px;
  height: 20px;
  vertical-align: bottom;
}

.other-mode-popover-details-title {
  font-size: 20px;
  line-height: 100%;
}

.other-mode-popover-tag.el-tag--dark.el-tag--info {
  background-color: #313131;
  border-color: #313131;
}
</style>

