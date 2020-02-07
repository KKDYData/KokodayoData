<template>
  <div class="details-wrapper">
    <!-- 卡片 -->
    <el-alert
      v-if="loadingFail"
      type="error"
      title="Network Error"
      effect="dark"
      :closable="false"
    >获取数据失败，若多次刷新无效，请联系管理员</el-alert>
    <my-share />
    <data-loading v-if="!loadingFail && !dataLoad" />
    <transition name="fade" mode="out-in">
      <div v-if="dataLoad">
        <agent-card :phases="phases" :data="data" />
        <!-- 属性面板 -->
        <my-title title="属性" />
        <div class="status-container">
          <div class="status-switcher">
            <div class="status-switcher-phases">
              <span class="status-switcher-title">精英阶段</span>
              <el-button
                v-for="(item, index) in data.phases"
                :key="index"
                size="mini"
                :type="phases === index ? 'primary': ''"
                @click="phases = index"
              >{{ index }}</el-button>
            </div>

            <div v-if="potentailUPList.length > 0" class="status-switcher-potential">
              <span class="status-switcher-title">潜能等级</span>
              <el-button
                size="mini"
                :type="potentialRanks === -1 ? 'primary': ''"
                @click="potentialRanks = -1"
              >1</el-button>
              <el-button
                v-for="item in potentailUPList"
                :key="item"
                size="mini"
                :type="potentialRanks === item ? 'primary': ''"
                @click="potentialRanks = item"
              >{{ item + 2 }}</el-button>
            </div>
            <div class="status-switcher-lf">
              <div class="status-switcher-lf-lv">
                <div class="status-switcher-lf-lv-title">
                  <span>等级</span>
                  <span>{{ level }}</span>
                </div>
                <div class="status-switcher-lf-lv-inner">
                  <el-slider
                    v-model="level"
                    :show-tooltip="false"
                    :min="targetPhasese[0].level"
                    :max="targetPhasese[1].level"
                  />
                </div>
              </div>
              <div v-if="data.favorKeyFrames" class="status-switcher-lf-favor">
                <el-switch v-model="isFavor" active-color="#313131" active-text="满信赖" />
              </div>
            </div>
          </div>

          <char-status class="status-details-wrapper" :status="status" />
          <div v-if="rangeId" class="status-range-wrapper">
            <div class="status-range">
              <range :range-id="rangeId" />
              <div class="status-range-title">
                <span>攻击范围</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 天赋面板 -->
        <my-title title="天赋" />
        <div v-if="talents.length > 0" class="tttt">
          <talents-panel :talents="talents" @talentPotentailUp="e => talentPotentailUp = e" />
        </div>
        <!-- 技能面板 -->
        <my-title title="技能" />
        <div v-if="skills.length > 0" class="tttt">
          <skill-panel
            :status="status"
            :skills="skills"
            :talents="talents"
            :profession="data.profession"
            :talent-potentail-up="talentPotentailUp"
            :description="data.description"
          />
        </div>
        <!-- 潜能面板 -->
        <my-title title="潜能" />
        <div v-if="normal" class="tttt potency-container">
          <div v-if="data.potentialRanks && data.potentialRanks.length" class>
            <div v-for="(item, index) in data.potentialRanks" :key="index">
              <p>
                <span class="potency-lv">潜能{{ index + 2 }}级:</span>
                {{ item.description }}
              </p>
            </div>
          </div>
          <div v-else style="margin-bottom: 20px;">
            <span>竟然没有潜能！</span>
          </div>
        </div>
        <!-- 精英化材料消耗 -->
        <div v-if="Object.keys(evolveCost).length > 0">
          <my-title title="精英化材料消耗" />
          <div class="evolvcost-wrapper tttt">
            <div
              v-for="(cost, key, index) in evolveCost"
              :key="index"
              class="evolvcost-list"
              :style="Object.keys(evolveCost).length === 1 && !short? 'margin: 0 0 10px' : ''"
            >
              <div>
                <div class="evolvcost-list-title">
                  <span>精英阶段{{ index + 1 }}</span>
                </div>
              </div>
              <div class="evolvcost-list-item">
                <item-viewer :item="GOLD" :num="cost.money" class="evolvcost-list-item-one" />
                <item-viewer
                  v-for="item in cost.items"
                  :key="item.IconId"
                  class="evolvcost-list-item-one"
                  :item="item.item"
                  :num="item.cost"
                />
                <div />
              </div>
            </div>
          </div>

          <!-- 技能升级消耗 -->
          <div v-if="skills.length > 0 && normal">
            <my-title title="技能升级消耗" />
            <skill-up-panel
              :all-level-cost="data.allSkillLvlup"
              :skills="skills"
              :seven="data.skills"
              class="tttt"
            />
          </div>
          <!-- 基建面板 -->
          <div v-if="normal">
            <my-title title="基建技能" />
            <building-data class="tttt" :building="data.buildingData" />
            <my-title title="干员资料" />
            <info-panel v-if="info" class="tttt" :data="info" :list="setList" :words="words" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { changeAttackSpeed, calStatusEnd, } from '../../utils'
import {
  getHeroData,
  getSkill,
  getItem,
  getCharWords,
  getCharInfo,
} from '../../utils/fetch'

import { path } from '../../utils/listVer'

import {
  evolveGoldCost,
  getPotentialToStatus,
  itemBackground,
  GOLD,
  statusToChChar
} from '../../utils/string'



import AgentCard from './AgentCard'
import Range from './Range'
import TalentsPanel from './TalentsPanel'
import SkillUpPanel from './SkillUpCost'
import BuildingData from './BuildingData'
import ItemViewer from '../ItemViewer'
import charStatus from '../base/charStatus'
import DataLoading from '../base/Loading'
import MyTitle from '@/components/base/MyTitle'
import MyShare from './Share'

const SkillPanel = () => ({
  component: import(
    /* webpackChunkName: "SkillPanel" */ '../DetailsLayout/SkillPanel'
  ),
  loading: DataLoading,
  error: DataLoading,
  delay: 200,
  timeout: 5000
})

const InfoPanel = () => ({
  component: import(
    /* webpackChunkName: "InfoPanel" */ './InfoPanel'
  ),
  loading: DataLoading,
  error: DataLoading,
  delay: 200,
  timeout: 5000
})

import {
  Card,
  InputNumber,
  Switch,
  Button,
  Popover,
  Tag,
  Alert,
  Slider
} from 'element-ui'

import { mapState } from 'vuex'
import Vue from 'vue'
Vue.use(Card)
Vue.use(InputNumber)
Vue.use(Switch)
Vue.use(Button)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Slider)

export default {
  metaInfo() {
    const title = this.data && this.data.name
    const content = this.data && this.data.itemUsage
    return {
      title,
      meta: [{ vmid: 'description', name: 'Description', content: content }]
    }
  },
  components: {
    Range,
    TalentsPanel,
    SkillPanel,
    SkillUpPanel,
    BuildingData,
    InfoPanel,
    ItemViewer,
    DataLoading,
    AgentCard,
    charStatus,
    MyShare,
    MyTitle
  },
  data() {
    return {
      loadingFail: false,
      data: null,
      puLoad: false,
      picUrls: {},
      name: '',
      dataLoad: false,
      isLvMax: true,
      phases: 0,
      isFavor: true,
      potentialRanks: -1,
      skills: [],
      evolveCost: {},
      info: null,
      words: [],
      GOLD: GOLD,
      level: 1,
      talentPotentailUp: [false, false, false]
    }
  },
  computed: {
    ...mapState(['short']),
    normal() {
      return this.data && this.data.profession !== 'TOKEN'
    },
    rangeId() {
      // 针对白雪

      const talent = this.talents.filter(el => el.condidate.filter(el => /攻击范围扩大/.test(el.description) && el.rangeId).length)
      if (talent.length) {
        const id = talent.reduce((res, cur) => {
          return cur.condidate.reduce((res, cur) => {
            if (cur.unlockCondition.phase <= this.phases && cur.unlockCondition.level <= this.level) {
              res = cur.rangeId
            }
            return res
          }, res)
        }, '')
        if (id) return id
      }

      return this.data.phases[this.phases].rangeId
    },
    setList() {
      if (!this.data) return []
      if (this.name === 'char_002_amiya') return [1, '1%2B', 2]
      return this.data.rarity > 2 ? [1, 2] : [1]
    },
    evoCostArr() {
      if (!this.data || this.data.rarity < 3) return
      const arr = this.data.rarity === 2 ? [0] : [0, 1]
      return arr
    },
    talents() {
      if (this.data) {
        const arr = []
        if (!this.data.talents) return []
        for (let wrapper of this.data.talents) {
          const tGroup = wrapper.candidates
          if (!tGroup) continue
          for (let talent of tGroup) {
            const res = changeAttackSpeed(talent)
            talent.description = res
            //console.log(res);
            arr.push(talent)
          }
        }
        const res = []

        res.push({
          name: arr[0].name,
          condidate: [arr[0]]
        })
        arr.reduce((pre, cur) => {
          if (pre.name !== cur.name) {
            res.push({
              name: cur.name,
              condidate: [cur]
            })
            return cur
          }
          if (cur.requiredPotentialRank !== 0) {
            pre.potentailUP = cur
          } else {
            res[res.length - 1].condidate.push(cur)
          }
          return cur
        })
        return res
      }
      return null
    },
    targetPhasese() {
      return this.data.phases[this.phases].attributesKeyFrames
    },
    status() {
      if (this.data) {
        return calStatusEnd(this.data, this.level, this.targetPhasese, this.isFavor, this.potentailStatusUP)
      }
      return null

    },
    potentailUPList() {
      if (!this.data) return
      const res = []
      this.data.potentialRanks.forEach((el, index) => {
        let haveValue = false
        if (!el.buff) return
        el.buff.attributes.attributeModifiers.forEach(el => {
          if (el.attributeType) haveValue = true
        })
        res.push(index)
        return haveValue
      })
      return res
    },
    potentailStatusUP() {
      const rank = this.potentialRanks
      const data = this.data.potentialRanks
      if (!data) return

      return data.reduce((target, el, index) => {
        if (index > rank || !el.buff) return target
        if (!el.buff.attributes.attributeModifiers)
          throw new Error('你是假数据！' + JSON.stringify(el.buff))
        const temp = el.buff.attributes.attributeModifiers.reduce((res, el) => {
          // type = 0 是生命提升，没有小于0的
          // if (!el.attributeType) return res;
          res.push({
            type: getPotentialToStatus(el.attributeType),
            value: el.value
          })
          return res
        }, [])
        target.push(temp)
        return target
      }, [])
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      return null
    }
  },
  created() {
    this.name = this.$route.params.name
    console.log('getting data...')
    getHeroData(this.name)
      .catch(err => {
        console.log(err)
        return Promise.reject('no charactor')
      })
      .then(data => {
        this.data = data
        this.phases = this.data.phases.length - 1
        this.level = this.data.phases[this.phases].attributesKeyFrames[1].level
        this.dataLoad = true

        this.getSkills()
        if (this.data.profession === 'TOKEN') return
        // this.getRange();
        this.getEvolveCost()
        this.getInfo()
        this.getWords()
      })
      .catch(err => {
        console.log(err)
        this.loadingFail = true
      })
  },
  methods: {
    evolvCost(t) {
      return evolveGoldCost[this.data.rarity][t]
    },
    statusToChChar(key) {
      return statusToChChar(key)
    },
    itemPic(id) {
      return path + 'item/pic/' + id + '.png'
    },
    getInfo() {
      getCharInfo(this.name).then(res => this.info = res)
    },
    getWords() {
      getCharWords(this.name).then(res => this.words = res)
    },
    getSkills() {
      if (!this.data) return
      const data = [...this.data.skills]
        .map(skill => {
          if (skill.skillId)
            return getSkill(skill.skillId)
        })
      Promise.all(data).then(arr => this.skills = arr.filter(el => el))
    },
    getEvolveCost() {
      if (!this.data || !this.normal) return
      const data = [...this.data.phases]
      for (let i = 0;i < data.length - 1;i++) {
        Promise.all(data[i + 1].evolveCost.map(p => getItem(p.id).then(item => ({ cost: p.count, item }))))
          .then(items => {
            this.$set(this.evolveCost, i, { money: evolveGoldCost[this.data.rarity][i], items })
          })
      }
    },
    itemBackground(rarity) {
      return itemBackground[rarity]
    }
  }
}
</script>

<style lang="stylus" scoped>
.details-wrapper {
  //min-width: 340px
  max-width: 1200px
  background-color: white
  margin: 0 auto
  padding: 20px
}

.evolvcost-list-item-one {
  width: 100px
  box-sizing: border-box
  margin: 0
}

.tttt {
  padding: 0 10px 20px
}

/**/
/*part 2*/
.status-container {
  position: relative
  display: flex
  //justify-content: space-between
  align-items: center
  flex-wrap: wrap
  padding-bottom: 20px
}

.status-switcher {
  padding: 12px 0 12px 10px
  min-width: 335px

  /*潜能*/
  &-potential {
    margin-top: 10px
  }

  &-title {
    padding-right: 10px
  }

  &-lf {
    display: flex
    align-items: center

    &-lv {
      display: flex
      align-items: center
      width: 200px

      &-title {
        width: 40px
        padding-bottom: 4px
        white-space: nowrap
      }

      &-inner {
        width: 80%
        margin-left: 25px
      }
    }

    &-favor {
      padding-bottom: 10px
      display: inline
      padding-top: 10px
      margin-left: 25px
    }
  }

  /*改button颜色*/
  .el-button--mini {
    background-color: rgba(172, 172, 172, 0.34)
    border: none
    border-bottom: 2px solid
    color: rgb(255, 255, 255)
  }

  .el-button {
    &--primary, &:hover {
      color: rgb(255, 208, 75)
      background-color: #313131
      border-bottom: 2px solid rgb(255, 208, 75)

      &:focus {
        color: rgb(255, 208, 75)
        background-color: rgb(84, 92, 100)
        border-bottom-color: rgb(255, 208, 75)
      }
    }
  }
}

//属性面板
.status-details-wrapper {
  border-right: 1px solid hsla(0, 0%, 62%, 0.4)
  box-sizing: border-box
  flex: 1
  min-width: 420px
}

.status-range-wrapper {
  width: 20%
  margin: 0 auto
  display: flex
  justify-content: center
  flex: 0.5
}

.status-range {
  width: 100%

  &-title {
    text-align: center
    font-size: 14px
  }
}

/**/
.evolvcost-wrapper {
  display: flex
  flex-wrap: wrap
  justify-content: space-between
}

/**/
.evolvcost-list {
  position: relative
  margin: 30px 0
  flex: 1
  display: flex

  &-item {
    display: flex
    align-items: center
    align-content: center
  }

  &-title {
    height: 100%
    width: 90px
    border-right: 1px solid rgba(158, 158, 158, 0.4)
    box-sizing: border-box
    display: flex
    align-items: center
    justify-content: center
    flex: 1
  }
}

/**/
.potency-container {
  padding-left: 10px

  .potency-lv {
    padding-right: 5px
  }
}

@media screen and (max-width: 900px) {
  .status-details-wrapper {
    flex: 1
    min-width: auto
  }

  .status-range-wrapper {
    flex: 1
  }

  .status-range {
    width: 100%

    &-title {
      text-align: center
      font-size: 14px
    }
  }

  .el-button + .el-button {
    margin-left: calc(3px + 1vw)
  }

  .status-container {
    height: auto
    justify-content: space-between
  }

  .status-switcher-title {
    margin-bottom: 10px
  }

  .status-title-wrapper {
    position: relative
    width: calc(100% - 20px)
    display: flex
  }

  /*part 2*/
  .status-details-wrapper {
    width: 50%
    padding-top: 20px
    height: auto
  }

  .status-container {
    position: relative
    height: auto
  }

  .status-switcher {
    width: 100%
    flex: auto
    box-sizing: border-box
    border-bottom: 1px solid rgba(158, 158, 158, 0.4)
  }

  .status-switcher-lf-favor {
    padding: 0
    margin-left: 20px
    display: inline
  }

  /**/
  .status-range-wrapper {
    width: 50%
    margin: 0
    min-width: auto
  }
}

@media screen and (max-width: 700px) {
  .details-wrapper {
    padding: 10px vw(20)
  }

  /**/
  .evolvcost-list {
    padding: 0 0 20px
    margin: 0
    display: block

    & + & {
      border: none
      border-top: 1px solid rgb(235, 238, 245)
      padding-top: 20px
    }

    &-item-one {
      width: vw(170)
    }

    &-title {
      position: relative
      height: 20px
      border-right: none
      border-bottom: 1px solid rgba(158, 158, 158, 0.4)
      justify-content: start
      font-size: calc(13px + 0.5vw)
    }

    &-item {
      position: relative
      min-width: 250px
      margin-left: 0px
      margin-top: 10px
      display: flex
      align-items: center
      align-content: center
    }
  }
}

@media screen and (max-width: 500px) {
  .tttt {
    padding: 0 vw(20) vw(20)
  }

  //属性面板
  .status-details-wrapper {
    width: 50%
    padding-top: vw(20)
    height: auto
  }

  .status-container {
    padding-bottom: vw(20)
  }

  .status-switcher {
    .status-switcher-lf-lv {
      width: 55vw
    }

    padding: vw(24) vw(20)
    font-size: vw(32)

    .el-switch__label * {
      font-size: vw(32)
    }

    .el-button--mini {
      padding: vw(14) vw(30)
      font-size: vw(24)
    }

    .el-button + .el-button[data-v-8949beae] {
      margin-left: vw(10)
    }

    .el-switch__core {
      height: vw(40)
      width: vw(80) !important
      border-width: vw(2)
      border-radius: vw(20)

      &:after {
        top: vw(2)
        left: vw(2)
        width: vw(32)
        height: vw(32)
      }
    }

    .el-switch.is-checked .el-switch__core:after {
      margin-left: vw(-34)
      left: 100%
    }
  }
}
</style>

