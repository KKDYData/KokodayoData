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
        <div class="stats-wrapper">
          <div class="group-container-title">
            <span>属性</span>
          </div>
          <div class="status-wrapper">
            <div class="status-phases-wrapper">
              <div class="status-phases-control-container">
                <span class="status-phases-text">精英阶段</span>
                <el-button
                  v-for="(item, index) in data.phases"
                  :key="index"
                  size="mini"
                  :type="phases === index ? 'primary': ''"
                  @click="phases = index"
                >{{ index }}</el-button>
              </div>

              <div v-if="potentailUPList.length > 0" class="status-potential-wrapper">
                <span class="status-phases-text">潜能等级</span>
                <div style="display: inline; font-size: 0px">
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
              </div>
              <div class="status-lv-favor-wrapper">
                <div class="status-phases-lv">
                  <div class="status-phases-lv-title">
                    <span>等级</span>
                    <span>{{ level }}</span>
                  </div>
                  <div class="status-phases-lv-inner">
                    <el-slider
                      v-model="level"
                      :show-tooltip="false"
                      :min="targetPhasese[0].level"
                      :max="targetPhasese[1].level"
                    />
                  </div>
                </div>
                <div v-if="data.favorKeyFrames" class="status-favor-switch">
                  <el-switch v-model="isFavor" active-color="#313131" active-text="满信赖" />
                </div>
              </div>
            </div>

            <char-status class="status-details-wrapper" :status="status" />
            <div class="status-range-wrapper">
              <div v-if="rangeId" class="status-range-inner-wrapper">
                <range :range-id="rangeId" />
                <div style="text-align: center;font-size: 14px">
                  <span>攻击范围</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 天赋面板 -->
        <div v-if="talents.length > 0" class="tttt">
          <div class="group-container-title">天赋</div>
          <talents-panel :talents="talents" @talentPotentailUp="e => talentPotentailUp = e" />
        </div>
        <!-- 技能面板 -->
        <div v-if="skills.length > 0" class="skill-container-wrapper">
          <div class="group-container-title">技能</div>
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
        <div v-if="normal" style="margin-bottom: 20px">
          <div class="group-container-title">潜能</div>
          <div v-if="data.potentialRanks && data.potentialRanks.length" class="potency-container">
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
          <div class="group-container-title">
            <span>精英化材料消耗</span>
          </div>
          <div class="evolvcost-wrapper">
            <div
              v-for="(cost, key, index) in evolveCost"
              :key="index"
              class="evolvcost-container-wrapper"
              :style="Object.keys(evolveCost).length === 1 && !short? 'margin: 0 0 10px' : ''"
            >
              <div class="evolvcost-title-wrapper">
                <span>精英阶段{{ index + 1 }}</span>
              </div>
              <div class="evolvcost-container">
                <item-viewer :item="GOLD" :num="cost.money" class="evolvcost-item-container" />
                <div v-for="item in cost.items" :key="item.IconId" class="evolvcost-item-container">
                  <item-viewer :item="item.item" :num="item.cost" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 技能升级消耗 -->
        <div v-if="skills.length > 0 && normal" class="skill-container-wrapper">
          <div class="group-container-title">技能升级消耗</div>
          <skill-up-panel
            :all-level-cost="data.allSkillLvlup"
            :skills="skills"
            :seven="data.skills"
          />
        </div>

        <!-- 基建面板 -->
        <div v-if="normal" class="tttt">
          <building-data :building="data.buildingData" />
        </div>
        <div v-if="normal" class="group-container-title" style="margin-bottom: 0">
          <span>干员资料</span>
        </div>
        <template slot="title">
          <span style="direction:rtl;width: 100%">打开</span>
        </template>
        <info-panel v-if="info" :data="info" :list="setList" :words="words" />
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
    MyShare
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

<style scoped>
/*  extra  */
.desc-extra {
  color: rebeccapurple;
  font-style: normal;
}
/*  */
.group-container-title {
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: #414141;
  padding-left: 1vw;
  box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.15);
}
.details-wrapper {
  min-width: 340px;
  max-width: 1200px;
  /* min-width: 1200px; */
  background-color: white;
  margin: 0 auto;
  padding: 20px;
}

/*  */
/*  */
/* part 2 */
.status-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.status-phases-wrapper {
  padding: 12px 0 12px 10px;
}

/* 改button颜色 */
.status-phases-wrapper .el-button--mini {
  background-color: rgba(172, 172, 172, 0.34);
  border: none;
  border-bottom: 2px solid;
  color: rgb(255, 255, 255);
}

.status-details-wrapper {
  width: calc(calc(100% - 350px) * 0.5);
  border-right: 1px solid hsla(0, 0%, 62%, 0.4);
}

/* 潜能 */
.status-potential-wrapper {
  margin-top: 10px;
  font-size: 0px;
}

.status-potential-wrapper .el-button--mini {
  background-color: rgba(172, 172, 172, 0.34);
  border: none;
  border-bottom: 2px solid;
  color: rgb(255, 255, 255);
}

.status-phases-wrapper .el-button--primary:focus,
.status-potential-wrapper .el-button--primary:focus {
  color: rgb(255, 208, 75);
  background-color: rgb(84, 92, 100);
  border-bottom-color: rgb(255, 208, 75);
}

.status-phases-wrapper .el-button:hover,
.status-phases-wrapper .el-button--primary,
.status-potential-wrapper .el-button:hover,
.status-potential-wrapper .el-button--primary {
  color: rgb(255, 208, 75);
  background-color: #313131;
  border-bottom: 2px solid rgb(255, 208, 75);
}

.status-phases-control-container {
  font-size: 0;
}

.status-phases-text {
  padding-right: 10px;
  font-size: 1rem;
}

.status-lv-favor-wrapper {
  display: flex;
  align-items: center;
}

.status-phases-lv {
  display: flex;
  align-items: center;
  width: 200px;
}
.status-phases-lv-inner {
  width: 80%;
  margin-left: 25px;
}

.status-phases-lv-title {
  width: 40px;
  padding-bottom: 4px;
  white-space: nowrap;
}

.status-favor-switch {
  padding-bottom: 10px;
  display: inline;
}
.status-favor-switch {
  padding-top: 10px;
  margin-left: 25px;
}

.status-title-wrapper {
  position: relative;
  width: 100%;
  width: calc(100% - 20px);

  display: flex;
}

.status-range-wrapper {
  /* width: 20%; */
  margin-right: 5%;
  display: flex;
  justify-content: center;
}
.status-range-inner-wrapper {
  min-width: 170px;
  max-height: 200px;
}
.status-range-fill {
  width: 120px;
}
.status-range-fill::before {
  content: "";
  margin-top: 100%;
  display: block;
}

/*  */
/*  */
.skill-container-wrapper {
  margin-top: 20px;
}
/*  */
/* part 5 */
.evolvcost-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.evolvcost-container {
  position: relative;
  min-width: 250px;
  width: calc(100% - 120px);
  margin-left: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
}
.cost-money {
  vertical-align: middle;
}
/*  */

.evolvcost-item-container {
  min-width: 120px;
}

.evolvcost-container-wrapper {
  position: relative;
  min-width: 340px;
  margin: 30px 0;
}

.evolvcost-title-wrapper {
  position: absolute;
  height: 100%;
  width: 90px;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

/*  */

.stats-wrapper {
  margin: 20px 0px;
}
.potency-container {
  padding-left: 20px;
}
.potency-lv {
  padding-right: 5px;
}

@media screen and (min-width: 1250px) {
  .evolvcost-container-wrapper + .evolvcost-container-wrapper {
    border-left: 2px solid rgba(56, 56, 56, 0.6);
  }
}

@media screen and (max-width: 900px) {
  .el-button + .el-button {
    margin-left: calc(3px + 1vw);
  }
  .status-wrapper {
    height: auto;
    justify-content: space-between;
  }

  .status-phases-text {
    margin-bottom: 10px;
  }
  .status-title-wrapper {
    position: relative;
    width: 100%;
    width: calc(100% - 20px);

    display: flex;
  }

  /* part 2 */
  .status-details-wrapper {
    width: 50%;
    padding-left: 5px;
    padding-top: 20px;
    height: auto;
  }

  .status-wrapper {
    position: relative;
    height: auto;
  }

  .status-phases-wrapper {
    width: 100%;
    border-bottom: 1px solid rgba(158, 158, 158, 0.4);
  }

  .status-favor-switch {
    padding: 0;
    margin-left: 20px;
    display: inline;
  }

  /*  */

  .status-range-wrapper {
    width: calc(30% - 20px);
    min-width: auto;
    margin-right: calc(10% + 10px);
  }
}

@media screen and (max-width: 700px) {
  .details-wrapper {
    padding: 10px 2.5vw;
  }

  /*  */
  .evolvcost-item-container {
    min-width: 80px;
  }
  /*  */
  .evolvcost-container-wrapper {
    min-width: 340px;
    padding: 0 0 20px 10px;
    margin: 0;
  }

  .evolvcost-container-wrapper + .evolvcost-container-wrapper {
    border: none;
    border-top: 1px solid rgb(235, 238, 245);
    padding-top: 20px;
  }

  .evolvcost-title-wrapper {
    position: relative;
    height: 20px;
    border-right: none;
    border-bottom: 1px solid rgba(158, 158, 158, 0.4);
    justify-content: start;
    font-size: calc(13px + 0.5vw);
  }
  .evolvcost-container {
    position: relative;
    min-width: 250px;
    width: calc(100% - 20px);
    margin-left: 0px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    align-content: center;
  }

  .status-range-wrapper {
    width: calc(45% - 20px);
    min-width: auto;
    margin-right: calc(2.5% + 3px);
  }
  /*  */
}
</style>

