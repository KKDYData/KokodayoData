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
                <span>{{ profession }}</span>
                <span class="char-card-stars">{{'⭐'.repeat(Number(data.rarity) + 1)}}</span>
              </span>
              <div>
                <span class="intro-2" v-html="desc"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="details-wrapper-fixed">
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
    </el-card>

    <div class="stats-wrapper" v-if="dataLoad">
      <div class="status-wrapper">
        <div class="group-container-title">
          <span>属性</span>
        </div>
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
      </div>
      <div class="tttt" v-if="dataLoad">
        <div class="group-container-title">
          <span>天赋</span>
        </div>
        <div class="talent-container-wrapper">
          <div v-for="(item, index) in talents" :key="item.name" class="talent-container">
            <div class="talent-name-wrapper">
              <span>{{item.name}}</span>
              <div class="talent-desc-change-button">
                <el-button
                  v-if="item.condidate[0].potentailUP"
                  @click="openTalentPotentailUP(index)"
                  size="mini"
                  :type="!showTalentPotencailUP[index] ? 'info' : 'warning'"
                >
                  潜能提升
                  <i
                    :class="!showTalentPotencailUP[index] ? 'el-icon-star-off' : 'el-icon-star-on'"
                  ></i>
                </el-button>
              </div>
            </div>
            <div
              class="talent-desc-container"
              v-for="talent in item.condidate"
              :key="talent.description"
            >
              <div class="talent-condition-wrapper">
                <span>精英{{talent.unlockCondition.phase}}/{{talent.unlockCondition.level}}级</span>
              </div>

              <div class="talent-desc-content-wrapper">
                <div v-if="!showTalentPotencailUP[index]" class="talent-desc-content">
                  <span>{{talent.description}}</span>
                </div>
                <div v-else class="talent-desc-content">
                  <span v-html="talent.potentailUP.description"></span>
                  <span>(需要潜能{{talent.potentailUP.requiredPotentialRank}}级)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="skills.length > 0" class="skill-container-wrapper">
        <div class="group-container-title">技能</div>
        <div class="skill-container" v-for="(skill, index) in skills" :key="skill.name">
          <div class="skill-title">
            <div class="skill-pic-contianer">
              <el-image style="height:100%" :src="getSkillPath(skill)" :details="name" lazy>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="skill-name-wrapper">
                <span>{{skill.levels[0].name}}</span>
              </div>
            </div>
            <div class="skill-tiltle-part" v-if="skill.levels[sLevel[index]-1]">
              <div class="skill-status" v-if="skill.levels[sLevel[index]-1]">
                <span>
                  <span>
                    <i class="el-icon-caret-right"></i>
                    {{skill.levels[sLevel[index]-1].spData.initSp}}
                  </span>
                  <span>
                    <i class="el-icon-star-on"></i>
                    {{skill.levels[sLevel[index]-1].spData.spCost}}
                  </span>
                </span>

                <span v-if="skill.levels[sLevel[index]-1].duration > 0">
                  <i class="el-icon-timer"></i>
                  {{skill.levels[sLevel[index]-1].duration}}
                </span>
                <span
                  class="skill-type"
                  :style="skill.type === '自动回复' ? 'color: green' : 'color: red'"
                >{{skill.type}}</span>
              </div>
              <p class="skill-status-desc" v-html="changeSkillDesc(skill.levels[sLevel[index]-1])"></p>
            </div>
          </div>

          <div class="skill-name-level">
            <span class="skill-title-level">
              LV
              <span>{{sLevel[index]}}</span>
            </span>
            <el-button icon="el-icon-minus" size="mini" circle @click="sLevelAdd(index, -1)"></el-button>
            <el-button circle icon="el-icon-plus" size="mini" @click="sLevelAdd(index, 1)"></el-button>
          </div>
        </div>
      </div>
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
    <el-card class="extra-card">
      <p>待更新</p>
      <p>......</p>
    </el-card>
  </div>
</template>

<script>
import { getHeroData, getClass_Chinese, path, fetchGet } from './utils';
import {
  Card,
  Collapse,
  CollapseItem,
  // Table,
  // TableColumn,
  InputNumber,
  Switch,
  Button
} from 'element-ui';
import Image from 'element-ui/packages/image/index.js';

import Vue from 'vue';
Vue.use(Card);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Image);
// Vue.use(Table);
// Vue.use(TableColumn);
Vue.use(InputNumber);
Vue.use(Switch);
Vue.use(Button);

export default {
  created() {
    console.log(this.$route.params.name);
    this.name = this.$route.params.name;
    getHeroData(this.name)
      .catch(err => {
        console.log(err);
        return Promise.reject('no charactor');
      })
      .then(data => {
        this.data = data;
        // this.dataLoad = true;
        this.getSkills();
        this.$set(this, 'dataLoad', true);
        // this.$nextTick();
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
    this.short = window.innerWidth < 500 ? true : false;
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  components: {},
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
      isLvMax: false,
      phases: 0,
      isFavor: true,
      skills: []
    };
  },
  computed: {
    logo() {
      return path + 'logo/' + this.data.displayLogo + '.png';
    },
    profile() {
      const name = this.$route.params.name;
      return path + 'char/profile/' + name + '.png';
    },
    desc() {
      const reg1 = /(<@ba.kw>)/g,
        reg2 = /(<\/>)/g,
        reg3 = /\\n/g;
      if (this.data) {
        console.log(this.data.description);
        let desc = this.data.description;
        if (!reg1.test(desc)) return desc;
        desc = desc
          .replace(reg1, '<i class="desc-extra" title="潜能提升">')
          .replace(reg2, '</i>')
          .replace(reg3, '<br/>');

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
        const reg1 = /(<@ba.talpu>)/g,
          reg2 = /(<\/>)/g,
          reg3 = /\\n/g,
          arr = [];
        for (let wrapper of this.data.talents) {
          const tGroup = wrapper.candidates;
          for (let talent of tGroup) {
            let t = talent.description
              .replace(reg1, '<i class="desc-extra" title="潜能提升">')
              .replace(reg2, '</i>')
              .replace(reg3, '<br/>');
            talent.description = t;
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
    sLevelAdd(index, i) {
      let num = this.sLevel[index] + i;
      if (num > this.skills[0].levels.length)
        num = this.skills[0].levels.length;
      if (num < 1) num = 1;
      this.$set(this.sLevel, index, num);
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
    openTalentPotentailUP(t) {
      this.$set(this.showTalentPotencailUP, t, !this.showTalentPotencailUP[t]);
    },
    getSkillPath(skill) {
      const name = skill.iconId ? skill.iconId : skill.skillId;
      return path + 'skills/pics/skill_icon_' + name + '.png';
    },
    getSkills() {
      if (this.data) {
        const data = [...this.data.skills];
        Promise.all(
          data.map(skill => {
            return fetchGet(path + 'skills/data/' + skill.skillId + '.json');
          })
        ).then(arr => {
          this.skills = arr;
        });
      }
    },
    changeSkillDesc(skill) {
      const reg1 = /(<@ba.vup>)/g,
        reg2 = /(<\/>)/g,
        reg3 = /\\n/g,
        reg4 = /<@ba.rem>/g,
        reg5 = /<@ba.vdown>/g;

      const str = skill.description
        .replace(reg1, '<i class="desc-extra">')
        .replace(reg4, '<i class="desc-extra">')
        .replace(reg5, '<i class="desc-extra">')
        .replace(reg2, '</i>')
        .replace(reg3, '</br>');
      const res = str.replace(/(\{)(.*?)(\})/g, (match, p1, p2, p3, p4, p5) => {
        let percent = '',
          minus = false,
          res = '';
        if (p2.match(/:0%/)) {
          p2 = p2.slice(0, -3);
          percent = '%';
        }
        if (p2.match(/-/)) {
          p2 = p2.slice(1);
          minus = true;
        }
        let temp = skill.blackboard.find(el => el.key === p2);
        if (temp) {
          res = temp.value;
          if (minus) res *= -1;
          if (percent) res *= 100;
        }
        return Math.floor(res) + percent;
      });
      return res;
    }
  }
};
</script>

<style>
.el-image img {
  width: 100%;
}
.details-wrapper {
  min-width: 350px;
  max-width: 1200px;
  /* min-width: 850px; */
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

.details-wrapper-fixed {
  /* width: 100%; */
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

/*  */
/*  */
/*  */
/*  */
/*  */
/* part 2 */
.status-wrapper {
  margin-bottom: 30px;
  position: relative;
}
.status-details-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 50%;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
}
.status-phases-wrapper {
  padding: 12px 0;
  position: absolute;
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
  margin-bottom: 2vw;
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

/*  */
/*  */
/*  */
/*  */
/*  */
/*  part3  */
.talent-name-wrapper,
.talent-container-wrapper {
  display: flex;
  position: relative;
  flex-wrap: wrap;
}
.talent-container-wrapper {
  min-width: 1200px;
}

.talent-container {
  width: calc(50% - 2px);
  min-width: 550px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  position: relative;
}

.talent-container + .talent-container {
  border-left: 2px solid rgba(56, 56, 56, 0.6);
}

/* 天赋名字 */
.talent-name-wrapper {
  position: absolute;
  height: 100%;
  width: 90px;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
  display: flex;
  align-items: center;
}
.talent-name-wrapper span {
  padding-left: 10px;
}

/* 天赋内容 */
.talent-desc-container {
  padding: 5px 10px;
  position: relative;
  min-width: 350px;
  height: 60px;
  width: calc(100% - 120px);
  margin-left: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
}

.talent-condition-wrapper {
  padding-right: 10px;
  /* display: inline-block; */
  width: 100px;
}

.talent-desc-content-wrapper {
  position: relative;
  display: inline-block;
  flex-grow: 1;
  padding-right: 10px;
}

.talent-desc-change-button {
  position: absolute;
  bottom: 10px;
}
.talent-desc-change-button .el-button--mini {
  padding: 0;
}

/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/* part 4 */
.skill-container-wrapper {
  margin-top: 30px;
  /* border-top: 1px solid rgb(235, 238, 245); */
}
.skill-container {
  border-bottom: 1px solid rgb(235, 238, 245);
  padding-bottom: 30px;
  position: relative;
}
.group-container-title {
  border-bottom: 1px solid rgb(235, 238, 245);
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding-left: 1vw;
}
.skill-title {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2vw;
  width: 100%;
  justify-content: start;
}

.skill-tiltle-part {
  /* display: inline-block; */
  /* display: flex; */
  flex-wrap: wrap;
  padding-left: 2vw;
  width: calc(70% - 100px);
  border-right: 1px solid rgba(158, 158, 158, 0.4);
}
.skill-title-level {
  /* padding-left: 2vw; */
  display: inline-block;
  /* position: absolute; */
  /* right: 2vw; */
  left: 0;
  /* padding-left: 35vw; */
  padding-right: 2vw;
  /* width: calc(100%-100px); */
}
.skill-name-level {
  position: absolute;
  margin-top: 2vw;
  margin-bottom: 2vw;
  right: 0px;
  bottom: 10px;
}
.skill-pic-contianer {
  /* display: inline-block; */
  flex-shrink: 0.5;
  width: 100px;
  height: 100px;
  /* background: green; */
  /* font-size: 12px; */
  position: relative;
  vertical-align: middle;
}
.skill-name-wrapper {
  text-align: center;
}
.skill-type {
  word-break: keep-all;
  padding: 0 !important;
}
.skill-status {
  font-size: 14px;
}
.skill-status-desc {
  font-size: 16px;
  color: #606266;
}
.skill-status span + span {
  padding-right: 5px;
}

.extra-card {
  margin-top: 5vw;
  margin-bottom: 5vw;
}
.desc-extra {
  color: rebeccapurple;
  font-style: normal;
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

@media screen and (max-width: 700px) {
  .details-wrapper {
    padding: 10px 10px;
  }
  /* part 1 */
  .char-card-container {
    height: calc(100px + 2vw);
  }
  .char-card-title-class {
    font-size: 20px;
  }
  .char-card-title-name {
    font-size: 20px;
  }
  .char-card-title-wrapper {
    /* padding-left: 2; */
    margin-left: 10px;
    z-index: 1;
  }

  .char-card-stars {
    letter-spacing: -12px;
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
    font-size: 12px;
    /* position: absolute; */
    position: relative;

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
  /*  */
  /*  */
  /* part 2 */

  .status-wrapper {
    margin-bottom: 5vw;
    position: relative;
  }
  .status-details-wrapper {
    width: 55%;
    padding-left: 5px;
  }
  .status-phases-wrapper {
    left: calc(55% + 10px);
  }
  .status-phases-text {
    margin-bottom: 10px;
    display: block;
  }
  .status-phases-lv {
    padding-top: 20px;
    padding-left: 0;
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
  .status-favor-switch {
    padding-left: 32px;
  }
  /*  */
  /*  */
  /*  */
  /* part 3 */
  .talent-container-wrapper {
    min-width: 350px;
  }
  .talent-container {
    width: calc(100% - 2px);
    min-width: 300px;
    margin-bottom: 20px;
  }

  .talent-container + .talent-container {
    border: none;
    padding-top: 20px;
    border-top: 2px solid rgba(56, 56, 56, 0.6);
  }

  .talent-name-wrapper {
    position: relative;
    height: 20px;
    width: calc(100% - 20px);
    border-right: none;
    border-bottom: 1px solid rgba(158, 158, 158, 0.4);
  }

  /* 天赋内容 */
  .talent-desc-container {
    height: 60px;
    width: 100%;
    margin-left: 0px;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .talent-desc-container + .talent-desc-container {
    padding-top: 20px;
    border-top: 1px solid rgba(158, 158, 158, 0.4);
  }

  .talent-condition-wrapper {
    width: calc(100% - 20px);
    padding-bottom: 10px;
    font-size: 13px;
    direction: rtl;
  }
  .talent-condition-wrapper span {
    border-bottom: 2px solid rgba(247, 203, 10, 0.582);
  }

  .talent-desc-content {
    padding-bottom: 10px;
    position: relative;
    display: inline-block;
    padding-right: 10px;
    font-size: 15px;
  }

  .talent-desc-change-button {
    right: 10px;
  }

  /*  */
  /*  */
  .skill-status {
    font-size: calc(12px + 0.5vw);
  }
  .skill-status-desc {
    font-size: calc(13px + 0.5vw);
  }
  .talents-effects-desc {
    font-size: calc(12px + 0.5vw);
  }
  .skill-title-level {
    /* padding-left: 2vw; */
    display: inline-block;
    /* position: absolute; */
    /* right: 2vw; */
    /* position: absolute; */
    left: 0;
    padding-left: 35vw;
    padding-right: 2vw;
    /* width: calc(100%-100px); */
  }
  .skill-tiltle-part {
    /* display: inline-block; */
    /* display: flex; */
    flex-wrap: wrap;
    padding-left: 2vw;
    width: calc(100% - 100px);
    border: none;
  }
  .skill-name-level {
    position: relative;
    right: -90px;
  }
  .skill-container {
    padding-bottom: 0px;
  }
}
</style>

