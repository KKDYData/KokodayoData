<template>
  <div v-if="myList && myList.length > 0">
    <div style="padding: 20px 0">
      <span style="border-bottom: 1px solid #313131">{{ title }}</span>
    </div>
    <div class="predefine-list">
      <div v-for="(item, index) in myList" :key="index" class="predefine-item">
        <h-popover popper-class="fuck-outline" :width="300" :title="item.name">
          <div slot="reference" class="fuck-outline">
            <enemy-cube
              class="predefine-item-bg"
              :src="getSrc(item.key)"
              :name="item.name + (item.alias ? '#' + item.alias.split('#')[1] : '') + (item.initialCnt ? ` x ${item.initialCnt}` : '')"
            />
          </div>
          <div v-if="showPosition" class="predefine-position">
            <content-slot v-if="showPosition" :width="short ? 60 : 100" no-wrap long>
              <div slot="title">位置</div>
              <div slot="content">
                <span>x</span>
                <span>{{ item.position.col }}</span>
                <span style="margin-left: 10px">y</span>
                <span>{{ item.position.row }}</span>
              </div>
            </content-slot>
            <content-slot v-if="item.direction > -1" :width="short ? 60 : 100" no-wrap long>
              <div slot="title">方向</div>
              <div slot="content">{{ getDirection(item.direction) }}</div>
            </content-slot>
          </div>
          <char-status
            v-if="showStatus"
            class="predefine-status"
            style="margin-top: 15px"
            :compact="true"
            :status-to-ch-fc="statusToChFc"
            :status="item.targetData"
          />
          <skill-panel :show-pic="false" :skills="item.targetSkill" :init-lv="item.mainSkillLvl" />
        </h-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetailsProfilePath, findValue } from '../../utils'
import charStatus from '../base/charStatus'
import loadingC from '../base/Loading'
import EnemyCube from './EnemyCube'
import ContentSlot from '@/components/base/ContentSlot'
import HPopover from '@/components/base/Popover'

const SkillPanel = () => ({
  component: import(
    /* webpackChunkName: "SkillPanel" */ '../DetailsLayout/SkillPanel'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
})

import { Directions } from '../../utils/string'

export default {
  components: {
    charStatus,
    SkillPanel,
    EnemyCube,
    ContentSlot,
    HPopover
  },
  props: {
    list: { required: true },
    statusToChFc: {},
    title: { required: true },
    showStatus: { default: true, type: Boolean },
    showPosition: { default: true, type: Boolean },
    runesData: { default: null }
  },
  computed: {
    myList() {
      if (this.runesData) {
        // 仅检测箱子数量，测试一下
        const checkTokenInsts = Object.values(this.runesData).find(el => el.key === 'cbuff_token_initial_cnt')
        if (checkTokenInsts) {
          const res = this.list.map(el => {
            let initialCnt = el.initialCnt
            const charKey = findValue(checkTokenInsts, 'blackboard', 'char').valueStr
            if (charKey && el.key === charKey) {
              initialCnt += findValue(checkTokenInsts, 'blackboard', 'value').value
            }
            return { ...el, initialCnt }
          })
          return res
        } else {
          return this.list
        }
      } else {
        return this.list
      }
    }
  },
  methods: {
    getSrc(key) {
      return getDetailsProfilePath(key)
    },
    getDirection(k) {

      return Directions[k]
    }
  }
}
</script>

<style lang="stylus" scoped>
.predefine-list {
  display: grid
  grid-template-columns: repeat(auto-fill, 100px)
  justify-content: space-around
  grid-gap: 20px 0
}

.predefine-status.status-details-wrapper {
  justify-content: space-between
}

.predefine-item {
  margin: 0 10px
}

.predefine-item-bg >>> .enemy-img-container {
  background: linear-gradient(45deg, #000a1d, transparent)
  //border: 5px solid #280332
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
    margin: 0
  }
}
</style>
