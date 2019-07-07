<template>
  <div class="details-wrapper">
    <!-- 卡片 -->
    <el-alert
      v-if="loadingFail"
      type="error"
      title="404"
      effect="dark"
      :closable="false"
    >获取数据失败，弱多次刷新无效，请联系管理员</el-alert>
    <data-loading v-if="!loadingFail && !dataLoad"></data-loading>
    <transition name="fade" mode="out-in">
      <div v-if="dataLoad">
        <agent-card :webpOk="webpOk" :data="data" :short="short"></agent-card>
        <!-- 属性面板 -->
        <div class="stats-wrapper">
          <div class="group-container-title">
            <span>属性</span>
          </div>
          <div class="status-wrapper">
            <div class="status-phases-wrapper">
              <span class="status-phases-text">精英阶段</span>
              <el-button
                v-for="(item, index) in data.phases"
                @click="phases = index"
                :key="index"
                size="mini"
                :type="phases === index ? 'primary': ''"
              >{{index}}</el-button>
              <div class="status-lv-favor-wrapper">
                <div class="status-phases-lv">
                  <el-switch
                    v-model="isLvMax"
                    :active-text="data.phases[phases].maxLevel + '级'"
                    inactive-text="1级"
                    active-color="#313131"
                    acitve-te
                  ></el-switch>
                </div>
                <div class="status-favor-switch">
                  <el-switch active-color="#313131" v-model="isFavor" active-text="满信赖"></el-switch>
                </div>
              </div>
              <div class="status-potential-wrapper">
                <span class="status-phases-text">潜能等级</span>
                <div style="display: inline; font-size: 0px">
                  <el-button
                    @click="potentialRanks = -1"
                    size="mini"
                    :type="potentialRanks === -1 ? 'primary': ''"
                  >1</el-button>
                  <el-button
                    v-for="item in potentailUPList"
                    @click="potentialRanks = item"
                    :key="item"
                    size="mini"
                    :type="potentialRanks === item ? 'primary': ''"
                  >{{item + 2}}</el-button>
                </div>
              </div>
            </div>
            <div class="status-details-wrapper">
              <div v-for="(item, key) in status" :key="key" class="status-details-container">
                <div>
                  <div class="status-details-title">
                    <span>{{statusToCh(key)}}</span>
                  </div>
                  <div class="status-details-value">
                    <span v-html="item"></span>
                    <span v-if="key === 'baseAttackTime' || key === 'respawnTime'">s</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="rangeData.length > 0" class="status-range-wrapper">
              <range :data="rangeData[phases]"></range>
              <div style="text-align: center;font-size: 14px">
                <span>攻击范围</span>
              </div>
            </div>
            <div v-else class="status-range-fill"></div>
          </div>
        </div>
        <!-- 天赋面板 -->
        <div class="tttt">
          <div class="group-container-title">天赋</div>
          <talents-panel :talents="talents" :short="short"></talents-panel>
        </div>
        <!-- 技能面板 -->
        <div v-if="skills.length > 0" class="skill-container-wrapper">
          <div class="group-container-title">技能</div>

          <skill-panel :skills="skills"></skill-panel>
        </div>
        <!-- 潜能面板 -->
        <div style="margin-bottom: 20px">
          <div class="group-container-title">潜能</div>
          <div v-if="data.potentialRanks && data.potentialRanks.length" class="potency-container">
            <div v-for="(item, index) in data.potentialRanks" :key="index">
              <p>
                <span class="potency-lv">潜能{{index + 2}}级:</span>
                {{item.description}}
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
              class="evolvcost-container-wrapper"
              v-for="(data, key, index) in evolveCost"
              :style="Object.keys(evolveCost).length === 1  && !short? 'margin: 0 0 10px' : ''"
              :key="index"
            >
              <div class="evolvcost-title-wrapper">
                <span>精英阶段{{index + 1}}</span>
              </div>
              <div class="evolvcost-container">
                <item-viewer
                  :short="short"
                  :item="GOLD"
                  :num="data.money"
                  class="evolvcost-item-container"
                ></item-viewer>
                <div v-for="item in data.items" :key="item.IconId" class="evolvcost-item-container">
                  <item-viewer :short="short" :item="item.item" :num="item.cost"></item-viewer>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 技能升级消耗 -->
        <div v-if="skills.length > 0" class="skill-container-wrapper">
          <div class="group-container-title">技能升级消耗</div>
          <skill-up-panel :allLevelCost="data.allSkillLvlup" :skills="skills" :seven="data.skills"></skill-up-panel>
        </div>

        <div class="tttt">
          <building-data :building="data.buildingData"></building-data>
        </div>
        <div class="group-container-title" style="margin-bottom: 0">
          <span>干员资料</span>
        </div>
        <template slot="title">
          <span style="direction:rtl;width: 100%">打开</span>
        </template>
        <info-panel
          :webpOk="webpOk"
          v-if="info"
          :data="info"
          :short="short"
          :list="setList"
          :words="words"
        ></info-panel>
        <el-card>
          <p>待更新</p>
          <p>。。。</p>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getHeroData,
  path,
  fetchGet,
  evolveGoldCost,
  changeDesc,
  potentialToStatus,
  itemBackground,
  GOLD,
  webpOk
} from '../utils';
import {
  Card,
  Collapse,
  CollapseItem,
  InputNumber,
  Switch,
  Button,
  Image,
  Popover,
  Tag,
  Alert
} from 'element-ui';

import AgentCard from './AgentCard';
import Range from './Range';
import TalentsPanel from './TalentsPanel';
import SkillPanel from './SkillPanel';
import SkillUpCost from './SkillUpCost';
import BuildingData from './BuildingData';
import InfoPanel from './InfoPanel';
import ItemViewer from '../ItemViewer';

import Loading from '../Loading';

import Vue from 'vue';
Vue.use(Card);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Image);
Vue.use(InputNumber);
Vue.use(Switch);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Tag);
Vue.use(Alert);

export default {
  created() {
    this.name = this.$route.params.name;
    console.log('getting data...');
    getHeroData(this.name)
      .catch(err => {
        console.log(err);
        return Promise.reject('no charactor');
      })
      .then(data => {
        this.data = data;
        this.phases = this.data.phases.length - 1;
        // this.dataLoad = true;
        this.getSkills();
        this.getRange();
        this.getEvolveCost();
        this.getInfo();
        this.getWords();
        this.dataLoad = true;
        // this.loadingFail = true;
      })
      .catch(err => {
        console.log(err);
        this.loadingFail = true;
      });
    this.short = window.innerWidth < 500 ? true : false;
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  components: {
    range: Range,
    'talents-panel': TalentsPanel,
    'skill-panel': SkillPanel,
    'skill-up-panel': SkillUpCost,
    'building-data': BuildingData,
    'info-panel': InfoPanel,
    'item-viewer': ItemViewer,
    'data-loading': Loading,
    AgentCard
  },
  data() {
    return {
      loadingFail: false,
      data: null,
      puLoad: false,
      picUrls: {},
      name: '',
      dataLoad: false,
      short: false,
      isLvMax: true,
      phases: 0,
      isFavor: true,
      potentialRanks: -1,
      skills: [],
      rangeData: [],
      evolveCost: {},
      info: null,
      words: [],
      GOLD: GOLD,
      webpOk: webpOk
    };
  },
  computed: {
    setList() {
      if (!this.data) return [];
      if (this.name === 'char_002_amiya') return [1, '1%2B', 2];
      return this.data.rarity > 2 ? [1, 2] : [1];
    },
    evoCostArr() {
      if (!this.data || this.data.rarity < 3) return;
      const arr = this.data.rarity === 2 ? [0] : [0, 1];
      return arr;
    },
    talents() {
      if (this.data) {
        const arr = [];
        for (let wrapper of this.data.talents) {
          const tGroup = wrapper.candidates;
          for (let talent of tGroup) {
            talent.description = changeDesc(talent.description);
            arr.push(talent);
          }
        }
        const res = [];

        res.push({
          name: arr[0].name,
          condidate: [arr[0]]
        });
        arr.reduce((pre, cur) => {
          if (pre.name !== cur.name) {
            res.push({
              name: cur.name,
              condidate: [cur]
            });
            return cur;
          }
          if (cur.requiredPotentialRank !== 0) {
            pre.potentailUP = cur;
          } else {
            res[res.length - 1].condidate.push(cur);
          }
          return cur;
        });
        return res;
      }
    },
    status() {
      if (this.data) {
        const data = this.data.phases[this.phases].attributesKeyFrames[
          this.isLvMax ? 1 : 0
        ].data;
        const newData = {};
        for (let [key, value] of Object.entries(data)) {
          if (!this.statusToCh(key)) continue;
          let nV = value,
            addV = 0;
          if (this.isFavor) {
            const v = this.data.favorKeyFrames[1].data[key];
            if (v !== 0) {
              addV += v;
              nV += v;
            }
          }
          // console.log(key);
          this.potentailStatusUP.forEach(el => {
            el.forEach(el => {
              if (el.type === key) {
                console.log(el.type);
                addV += el.value;
                nV += el.value;
              }
            });
          });

          const upOrMinus = addV > 0 ? '+' : '';
          if (addV)
            nV =
              nV +
              '<i style="color: #F49800;font-style: normal;">(' +
              upOrMinus +
              '' +
              addV +
              ')</i>';
          // if (key === 'baseAttackTime' || key === 'respawnTime')
          //   nV = value + ' s';
          newData[key] = nV;
        }
        return newData;
      }
    },
    potentailUPList() {
      if (!this.data) return;
      const res = [];
      this.data.potentialRanks.forEach((el, index) => {
        let haveValue = false;
        if (!el.buff) return;
        el.buff.attributes.attributeModifiers.forEach(el => {
          if (el.attributeType) haveValue = true;
        });
        res.push(index);
        return haveValue;
      });
      return res;
    },
    potentailStatusUP() {
      const rank = this.potentialRanks;
      const data = this.data.potentialRanks;
      if (!data) return;
      const res = [];

      let i = 0;
      try {
        data.forEach(el => {
          if (i++ > rank || !el.buff) return;
          if (!el.buff || !el.buff.attributes.attributeModifiers)
            throw new Error('你是假数据！' + JSON.stringify(el.buff));
          const temp = [];
          el.buff.attributes.attributeModifiers.forEach(el => {
            if (!el.attributeType) return;
            temp.push({
              type: potentialToStatus[el.attributeType],
              value: el.value
            });
            // if (!res[el.attributeType]) res[el.attributeType] = el.value;
            // else res[el.attributeType] += el.value;
          });
          res.push(temp);
        });
      } catch (err) {
        console.log(err);
      }
      return res;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  methods: {
    evolvCost(t) {
      return evolveGoldCost[this.data.rarity][t];
    },
    statusToCh(key) {
      const t = {
        maxHp: '生命上限',
        respawnTime: '再部署',
        atk: '攻击',
        cost: '部署费用',
        def: '防御',
        blockCnt: '阻挡数',
        magicResistance: '法术抵抗',
        baseAttackTime: '攻击间隔'
      };
      return t[key];
    },

    getSkills() {
      if (!this.data) return;
      const data = [...this.data.skills];
      Promise.all(
        data.map(skill => {
          return fetchGet(path + 'skills/data/' + skill.skillId + '.json');
        })
      ).then(arr => {
        this.skills = arr;
      });
    },
    getRange() {
      if (!this.data) return;
      const data = [...this.data.phases];
      Promise.all(
        data.map(p => {
          return fetchGet(path + 'range/' + p.rangeId + '.json');
        })
      ).then(arr => {
        this.rangeData = arr;
      });
    },
    itemPic(id) {
      return path + 'item/pic/' + id + '.png';
    },
    getEvolveCost() {
      if (!this.data) return;
      const data = [...this.data.phases];
      for (let i = 0; i < data.length - 1; i++) {
        Promise.all(
          data[i + 1].evolveCost.map(async p => {
            const item = await fetchGet(path + 'item/data/' + p.id + '.json');
            return { cost: p.count, item: item };
          })
        ).then(arr => {
          const data = {
            money: evolveGoldCost[this.data.rarity][i],
            items: arr
          };
          this.$set(this.evolveCost, i, data);
        });
      }
    },
    getInfo() {
      fetchGet(path + 'char/info/' + this.name + '.json').then(data => {
        this.info = data;
      });
    },
    getWords() {
      fetchGet(path + 'char/words/' + this.name + '.json').then(data => {
        this.words = data;
      });
    },
    itemBackground(rarity) {
      return itemBackground[rarity];
    }
  }
};
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
/*  */
/*  */
/* part 2 */
.status-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  height: 180px;
}
.status-details-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 37%;
  height: 180px;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
}
.status-phases-wrapper {
  padding: 12px 0;
}

/* 改button颜色 */
.status-phases-wrapper .el-button--mini {
  background-color: rgba(172, 172, 172, 0.34);
  /* border-color: rgb(153, 153, 153); */
  border: none;
  border-bottom: 2px solid;
  color: rgb(255, 255, 255);
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

.status-phases-text {
  padding-right: 10px;
  font-size: 1rem;
}

.status-lv-favor-wrapper {
  padding: 10px 15px;
  padding-left: 47px;
}
/* switch 颜色 */

.status-phases-lv {
  padding-top: 10px;
  padding-left: 47px;
}

.status-favor-switch,
.status-phases-lv {
  padding: 0;
  display: inline;
}
.status-favor-switch {
  padding-top: 10px;
  padding-left: 15px;
}

.status-details-container {
  flex-grow: 0.5;
  width: 50%;
  margin: 10px 0;
}
.status-details-title {
  color: white;
  background-color: #313131;
  border-radius: 2px;
  width: calc(80px + 0.5vw);
  text-align: center;
  display: inline-block;
  font-size: 100%;
  line-height: 100%;
  padding: 2px 0;
  box-shadow: 1px 1px 2px 1px #0000005e;
}
.status-details-value {
  display: inline-block;
}

.status-title-wrapper {
  position: relative;
  width: 100%;
  width: calc(100% - 20px);

  display: flex;
}

.status-range-wrapper {
  min-width: 170px;
  /* min-height: 170px; */
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
/* .evolvcost-item-contianer {
  margin: 5px 10px;
  width: 70px;
  height: 70px;
  display: block;
  box-sizing: border-box;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px black;
  background: grey;
  border: 2px solid rgb(249, 198, 19);
} */

.evolvcost-item-container {
  min-width: 120px;
}

/* .evolvcost-item-contianer img {
  width: 130%;
  height: 130%;
  margin-top: -15%;
  margin-left: -15%;
} */

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

@media screen and (min-width: 1200px) {
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
  .status-details-wrapper {
    width: 50%;
    padding-left: 5px;
    padding-top: 20px;
    height: auto;
  }
  .status-phases-text {
    margin-bottom: 10px;
  }
  .status-details-title {
    display: block;
  }
  .status-details-value {
    width: calc(80px + 0.5vw);
    text-align: center;
  }

  .status-title-wrapper {
    position: relative;
    width: 100%;
    width: calc(100% - 20px);

    display: flex;
  }

  /* part 2 */

  .status-wrapper {
    position: relative;
    height: auto;
  }

  .status-phases-wrapper {
    width: 100%;
    padding-left: 10px;
    border-bottom: 1px solid rgba(158, 158, 158, 0.4);
  }

  .status-favor-switch,
  .status-phases-lv {
    padding: 0;
    display: inline;
  }
  .status-favor-switch {
    padding-left: 15px;
  }

  .status-lv-favor-wrapper {
    padding: 10px 15px;
    padding-left: 47px;
  }

  /*  */

  .status-range-wrapper {
    width: calc(45% - 20px);
    min-width: auto;
    margin-right: 10px;
  }
}

@media screen and (max-width: 700px) {
  .details-wrapper {
    padding: 10px 10px;
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
    /* justify-content: space-between; */
    align-content: center;
  }
  /* 
  .evolvcost-item-contianer {
    width: calc(45px + 2vw);
    height: calc(45px + 2vw);
  } */
  .evolvcost-name-wrapper {
    font-size: 14px;
  }
  /*  */
  /*  */
  /*  */
}
</style>

