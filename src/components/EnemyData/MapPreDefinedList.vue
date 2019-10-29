<template>
  <div v-if="myList && myList.length > 0">
    <div style="padding: 20px 0">
      <span style="border-bottom: 1px solid #313131">{{title}}</span>
    </div>
    <div class="predefine-list">
      <div class="predefine-item" v-for="(item, index) in myList" :key="index">
        <el-popover popper-class="fuck-outline" :width="300" :title="item.name">
          <div class="fuck-outline" slot="reference">
            <char-cube class="predefine-item-bg" :src="getSrc(item.key)" width="100px"></char-cube>
            <div>
              <span
                style="color: #525252"
              >{{item.name + (item.alias ? '#' + item.alias.split('#')[1] : '') + (item.initialCnt ? ` x ${item.initialCnt}` : '')}}</span>
            </div>
          </div>
          <div v-if="showPosition" class="predefine-position">
            <div class="predefine-positon-inner">
              <div class="status-details-title">位置</div>
              <div class="predefine-position-item">
                <span>x</span>
                <span>{{item.position.col}}</span>
                <span style="margin-left: 10px">y</span>
                <span>{{item.position.row}}</span>
              </div>
            </div>
            <div v-if="item.direction > -1" class="predefine-positon-inner">
              <div class="status-details-title">方向</div>
              <div class="predefine-position-item">{{getDirection(item.direction)}}</div>
            </div>
          </div>
          <char-status
            v-if="showStatus"
            style="margin-top: 15px"
            :compact="true"
            :statusToChFc="statusToChFc"
            :status="item.targetData"
          ></char-status>
          <skill-panel
            :style="{'margin-top': '-20px'}"
            :show-pic="false"
            :skills="item.targetSkill"
            :init-lv="item.mainSkillLvl"
          ></skill-panel>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfilePath, findValue } from '../../utils';
import charCube from '../base/charCube';
import charStatus from '../base/charStatus';
import loadingC from '../base/Loading';

const SkillPanel = () => ({
  component: import(
    /* webpackChunkName: "SkillPanel" */ '../DetailsLayout/SkillPanel'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

import { Popover } from 'element-ui';
import Vue from 'vue';
import { Directions } from '../../utils/string';
Vue.use(Popover);

export default {
  components: { charCube, charStatus, SkillPanel },
  props: {
    list: { required: true },
    statusToChFc: {},
    title: { required: true },
    showStatus: { default: true, type: Boolean },
    showPosition: { default: true, type: Boolean },
    runesData: { default: null }
  },
  methods: {
    getSrc(key) {
      return getProfilePath(key);
    },
    getDirection(k) {

      return Directions[k];
    }
  },
  computed: {
    myList() {
      if (this.runesData) {
        // 仅检测箱子数量，测试一下
        const checkTokenInsts = Object.values(this.runesData).find(el => el.key === 'cbuff_token_initial_cnt');
        if (checkTokenInsts) {
          const res = this.list.map(el => {
            let initialCnt = el.initialCnt;
            const charKey = findValue(checkTokenInsts, 'blackboard', 'char').valueStr;
            if (charKey && el.key === charKey) {
              initialCnt += findValue(checkTokenInsts, 'blackboard', 'value').value;
            }
            return { ...el, initialCnt };
          });
          return res;
        } else {
          return this.list;
        }
      } else {
        return this.list;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.predefine-list {
  display: flex
  flex-wrap: wrap
}

.predefine-item {
  margin: 0 10px
}

.predefine-item-bg {
  background: linear-gradient(45deg, #000a1d, transparent)
  border: 5px solid #280332
  box-sizing: border-box
}

.predefine-position {
  margin-top: 20px
}

.predefine-positon-inner {
  display: flex
}

.predefine-positon-inner + .predefine-positon-inner {
  margin-top: 10px
}

.predefine-position-item {
  margin-left: 10px
}

.status-details-title {
  color: white
  background-color: #313131
  border-radius: 2px
  width: calc(80px + 0.5vw)
  text-align: center
  display: inline-block
  font-size: 100%
  line-height: 100%
  padding: 2px 0
  box-shadow: 1px 1px 2px 1px #0000005e
}

@media screen and (max-width: 500px) {
  .predefine-item {
    margin: 2vw 1vw
  }
}
</style>
