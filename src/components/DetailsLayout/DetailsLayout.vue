<template>
  <div class="details-wrapper">
    <el-card style=" margin-bottom: 20px; position: relative;">
      <div class="char-card-container" v-if="dataLoad">
        <div class="char-card-pic">
          <el-image style="height:100%" :src="profile" :details="name">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <div class="char-card-title-wrapper">
          <div class="title-first">
            <div>
              <span class="char-card-title-name">
                <span>{{data.name}}</span>
              </span>
            </div>
            <div>
              <span class="char-card-title-class">
                <el-image class="char-card-pro-pic" :src="professionPic" :details="name">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <span>{{ profession }}</span>
                <span class="char-card-stars">{{'⭐'.repeat(Number(data.rarity) + 1)}}</span>
              </span>
              <div class="intro-2-wrapper">
                <span class="intro-2" v-html="desc"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="details-wrapper-fixed" v-if="dataLoad">
        <p class="intro-0">{{data.itemUsage}}</p>
        <p class="intro-1">{{data.itemDesc}}</p>
        <div class="char-camp-pic">
          <el-image style="height:100%" :src="logo" :details="name">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>
      <div v-if="dataLoad" class="char-card-tags">
        <el-tag type="info" v-for="tag in  data.tagList" :key="tag">{{tag}}</el-tag>
      </div>
    </el-card>

    <div class="stats-wrapper" v-if="dataLoad">
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
            round
            :type="phases === index ? 'primary': ''"
          >{{index}}</el-button>
          <div class="status-lv-favor-wrapper">
            <div class="status-phases-lv">
              <el-switch
                v-model="isLvMax"
                :active-text="data.phases[phases].maxLevel + '级'"
                inactive-text="1级"
              ></el-switch>
            </div>
            <div class="status-favor-switch">
              <el-switch v-model="isFavor" active-text="满信赖"></el-switch>
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
                <span>{{item}}</span>
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
    <div class="tttt" v-if="dataLoad">
      <talents-panel :talents="talents"></talents-panel>
    </div>
    <!-- 技能面板 -->
    <div v-if="skills.length > 0" class="skill-container-wrapper">
      <skill-panel :skills="skills"></skill-panel>
    </div>
    <div v-if="dataLoad">
      <div class="group-container-title">潜能</div>
      <div class="potency-container">
        <div v-for="(item, index) in data.potentialRanks" :key="index">
          <p>
            <span class="potency-lv">潜能{{index + 1}}级:</span>
            {{item.description}}
          </p>
        </div>
      </div>
    </div>
    <div class="group-container-title">
      <span>精英化材料消耗</span>
    </div>
    <div class="evolvcost-wrapper">
      <div
        class="evolvcost-container-wrapper"
        v-for="(data, key, index) in evolveCost"
        :key="index"
      >
        <div class="evolvcost-title-wrapper">
          <span>精英阶段{{index + 1}}</span>
        </div>
        <div class="evolvcost-container">
          <div>
            <el-image class="cost-money" style="width: 50px" :src="itemPic('GOLD')">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <span>{{data.money}}</span>
          </div>
          <div class="evolvcost-item-contianer" v-for="item in data.items" :key="item.IconId">
            <el-image style="width: 50px" :src="itemPic(item.item.iconId)">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div style="text-align: center">
              <span>X</span>
              <span>{{item.cost}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="skills.length > 0" class="skill-container-wrapper">
      <skill-up-panel :allLevelCost="data.allSkillLvlup" :skills="skills" :seven="data.skills"></skill-up-panel>
    </div>
    <div class="tttt" v-if="dataLoad">
      <building-data :building="data.buildingData"></building-data>
    </div>
    <el-card class="extra-card">
      <p>待更新</p>
    </el-card>
  </div>
</template>

<script>
import {
  getHeroData,
  getClass_Chinese,
  path,
  fetchGet,
  evolveGoldCost,
  changeDesc
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
  Tag
} from 'element-ui';

import Range from './Range';
import TalentsPanel from './TalentsPanel';
import SkillPanel from './SkillPanel';
import SkillUpCost from './SkillUpCost';
import BuildingData from './BuildingData.vue';

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

export default {
  created() {
    this.name = this.$route.params.name;
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
        this.$set(this, 'dataLoad', true);
        // this.$nextTick();
      })
      .catch(err => {
        console.log(err);
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
    'building-data': BuildingData
  },
  data() {
    return {
      data: null,
      puLoad: false,
      picUrls: {},
      name: '',
      dataLoad: false,
      sLevel: [1, 1, 1],
      showTalentPotencailUP: [false, false, false],
      short: false,
      isLvMax: true,
      phases: 0,
      isFavor: true,
      skills: [],
      rangeData: [],
      evolveCost: { 0: {}, 1: {} }
    };
  },
  computed: {
    evoCostArr() {
      if (!this.data || this.data.rarity < 3) return;
      const arr = this.data.rarity === 2 ? [0] : [0, 1];
      return arr;
    },
    professionPic() {
      if (this.data)
        return (
          path +
          'others/icon_profession_' +
          this.data.profession.toLowerCase() +
          '_lighten.png'
        );
    },
    logo() {
      return path + 'logo/' + this.data.displayLogo + '.png';
    },
    profile() {
      const name = this.$route.params.name;
      return path + 'char/profile/' + name + '.png';
    },
    desc() {
      if (this.data) {
        let desc = this.data.description;
        desc = changeDesc(desc);

        return desc;
      }
    },
    profession() {
      if (this.data) {
        return getClass_Chinese(this.data.profession);
      }
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
          let nV = value;
          if (this.isFavor) {
            const v = this.data.favorKeyFrames[1].data[key];
            if (v !== 0) {
              nV = value + v;
              nV = nV + '(+' + v + ')';
            }
          }
          if (key === 'baseAttackTime' || key === 'respawnTime')
            nV = value + ' s';
          newData[key] = nV;
        }
        return newData;
      }
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
    }
  }
};
</script>

<style>
/*  extra  */
.desc-extra {
  color: rebeccapurple;
  font-style: normal;
}
/*  */
.group-container-title {
  border-bottom: 1px solid rgb(235, 238, 245);
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding-left: 1vw;
}
.el-image img {
  width: 100%;
}
.details-wrapper {
  min-width: 350px;
  max-width: 1200px;
  /* min-width: 1200px; */
  background-color: white;
  margin: 0 auto;
  padding: 20px;
}
/* part 1 */
.char-card-container {
  display: flex;
  align-items: stretch;
  align-self: stretch;
  position: relative;
  height: 150px;
}
.char-card-pic {
  display: inline-block;
  width: 150px;
  font-size: 12px;
  position: relative;
  vertical-align: middle;
}
.char-card-stars {
  letter-spacing: -30px;
}

.char-card-title-class {
  font-size: 40px;
  vertical-align: 0%;
}
.char-card-title-wrapper {
  margin-left: 20px;
}
.char-card-title-name {
  font-size: 50px;
  margin: 0;
  font-weight: bold;
}

.intro-1,
.intro-0 {
  margin: 0;
  font-size: 14px;
  opacity: 0.5;
  position: absolute;
  right: 0;
  bottom: -10%;
  z-index: 1;
  bottom: 5%;
}
.intro-0 {
  position: relative;
  bottom: 0%;
  padding-top: 20px;
}
.intro-2 {
  font-size: 14px;
  bottom: 20%;
  margin: 5px 0;
}
.char-camp-pic {
  position: absolute;
  width: 200px;
  right: 20px;
  top: -20px;
  z-index: 0;
  opacity: 0.7;
}

.char-card-tags {
  position: absolute;
  right: 0;
  top: 0;
}
.char-card-pro-pic {
  vertical-align: middle;
  width: 40px;
}

/*  */
/*  */
/*  */
/*  */
/*  */
/* part 2 */
.status-wrapper {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-content: center;
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
  left: calc(50% + 10px);
  width: 220px;
}
.status-phases-text {
  padding-right: 10px;
}
.status-phases-lv {
  padding-left: 47px;
  padding-top: 10px;
}

.status-details-container {
  flex-grow: 0.5;
  width: 50%;
  margin: 10px 0;
}
.status-details-title {
  color: white;
  background-color: black;
  width: calc(80px + 0.5vw);
  text-align: center;
  display: inline-block;
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
.status-favor-switch {
  padding-left: 80px;
  padding-top: 10px;
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
  margin-top: 30px;
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
.evolvcost-item-contianer {
  padding: 5px 10px;
}
.evolvcost-container-wrapper {
  position: relative;
  width: 50%;
  min-width: 400px;
}
.evolvcost-title-wrapper {
  position: absolute;
  height: 100%;
  width: 90px;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
  display: flex;
  align-items: center;
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

@media screen and (max-width: 900px) {
  .status-wrapper {
    height: auto;
  }
  .status-details-wrapper {
    width: 50%;
    padding-left: 5px;
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
  .char-card-pro-pic {
    width: 20px;
  }

  /* part 2 */

  .status-wrapper {
    margin-bottom: 5vw;
    position: relative;
    height: auto;
  }

  .status-phases-wrapper {
    width: 100%;
    padding-left: 10px;
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
  }
}

@media screen and (max-width: 700px) {
  .details-wrapper {
    padding: 10px 10px;
  }
  /* part 1 */
  .char-card-container {
    min-height: calc(90px + 2vw);
    height: auto;
    flex-grow: 0;
  }
  .char-card-title-class {
    font-size: 20px;
  }
  .char-card-title-name {
    font-size: 20px;
  }
  .char-card-title-wrapper {
    /* padding-left: 2; */
    margin-left: calc(100px + 5vw);
    z-index: 1;
  }

  .char-card-stars {
    letter-spacing: -12px;
  }

  .details-wrapper-fixed {
    margin-top: 10px;
  }
  .intro-2 {
    font-size: 13px;
    background-color: rgba(255, 255, 255, 0.8);
  }
  .intro-0 {
    left: -15px;
    font-size: 13px;
    padding: 0;
    position: relative;
    background-color: rgba(255, 255, 255, 0.8);
  }
  .intro-1 {
    left: -15px;
    font-size: 12px;
    position: relative;
    padding-top: 10px;
  }

  .char-card-pic {
    display: inline-block;
    width: calc(100px + 5vw);
    height: calc(100px + 5vw);
    font-size: 12px;
    position: absolute;
    /* position: relative; */
    flex-shrink: 1;
    flex-grow: 1;
    top: -20px;
    left: -20px;
    vertical-align: middle;
  }
  .char-camp-pic {
    width: 200px;
    right: 5px;
    bottom: -60px;
    opacity: 0.7;
    top: auto;
  }
  /*  */
  /*  */
  .evolvcost-container-wrapper {
    min-width: 350px;
    padding: 0 10px;
  }
  .evolvcost-title-wrapper {
    position: relative;
    height: 20px;
    width: calc(100% - 20px);
    border-right: none;
    border-bottom: 1px solid rgba(158, 158, 158, 0.4);
  }
  .evolvcost-container {
    position: relative;
    min-width: 250px;
    width: calc(100% - 20px);
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-content: center;
  }
  /*  */
  /*  */
  /*  */
}
</style>

