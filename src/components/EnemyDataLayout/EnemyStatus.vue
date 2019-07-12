<template>
  <div>
    <div v-if="short">
      <slot></slot>
    </div>
    <div style="display: flex; align-items: center; margin: 10px 0">
      <div class="status-phases-wrapper" :style="short ? 'width: auto': ''">
        <div style="margin-bottom: 15px">
          <span class="status-phases-text">Level</span>
          <el-button
            v-for="(item, index) in status"
            @click="level = index"
            :key="index"
            size="mini"
            :type="level === index ? 'primary': ''"
          >{{index}}</el-button>
          <el-tooltip
            popper-class="enemy-tooltip-item"
            class="enemy-status-tip"
            effect="dark"
            :content="'敌人的Level可以理解为敌人的版本，一个地图只会出现一种版本，突袭模式会有地图加成，不是更换版本'"
            placement="top-start"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
        <div v-if="maps">
          <span class="status-phases-text">
            <b>出现章节</b>
          </span>
          <el-button
            v-for="map in maps"
            :key="map"
            @click="currentMap = map"
            size="mini"
            :type="currentMap === map ? 'primary': ''"
          >{{currentMap === map ? map + '突袭' : map}}</el-button>
          <div
            @click="currentMap = ''"
            style="padding: 0 5px; margin-left: 10px; display: inline-block; cursor: pointer"
          >
            <i v-if="currentMap !== ''" class="el-icon-close"></i>
          </div>
        </div>
      </div>
      <!-- {{filterKeys}} -->
      <div v-if="!short" style="width: 50%">
        <slot></slot>
      </div>
    </div>

    <div class="enemy-status-wrapper" style="padding-bottom: 20px">
      <div class="enemy-data-tag-container">
        <div class="enemy-data-tag" v-for="tag in Tag" :key="tag">{{tag}}</div>
      </div>

      <div class="status-details-talents-wrapper">
        <div class="status-details-wrapper">
          <div class="status-details-container" v-for="data in filterKeys" :key="data[0]">
            <div class="status-details-title">
              <span>{{data[0]}}</span>
            </div>
            <div class="status-details-value">
              <transition name="fade">
                <span>{{data[1]}}</span>
              </transition>
              <span v-if="data[0] === '攻击间隔'">s</span>
              <span v-if="data[0] === 'LifePoint'">
                <el-tooltip
                  popper-class="enemy-tooltip-item"
                  class="enemy-status-tip"
                  effect="dark"
                  :content="'对基地造成的伤害，例如普通图基地生命有3点，这个敌人进去之后就会扣掉'+ data[1] + '点生命.'"
                  placement="top-start"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div :style="short ? '' :'width: 50%'">
        <div v-if="talents.length > 0" :style="short ? 'margin: 10px 0' : 'margin-bottom: 20px'">
          <div>
            <b>能力·Blackboard</b>
          </div>
          <div v-for="(t) in filterTalents" :key="t.key">
            <div class="status-details-title enemy-status-talent">
              <span>{{t.key}}</span>
            </div>
            <span>{{t.value}}</span>
          </div>
        </div>
        <div v-if="skills.length > 0">
          <div>
            <b>Extra·技能</b>
          </div>
          <div :style="0 ? '' :'display: flex'">
            <div class="enemy-skill-container" v-for="(skill, index) in skills[level]" :key="index">
              <div style="margin: 10px 0">
                <span style="font-size: 1em">{{skill.prefabKey.toUpperCase()}}</span>
              </div>
              <div :style="short? 'display: flex; flex-wrap: wrap' : ''">
                <div :style="short ?'margin-left: 10px' : ''">
                  <span>冷却时间:</span>
                  <span>{{skill.cooldown}}</span>
                  <span>s</span>
                </div>
                <div :style="short? 'margin-left: 10px' : ''">
                  <span>初始冷却</span>
                  <span>{{skill.initCooldown}}</span>
                  <span>s</span>
                </div>
                <div :style="short? 'width: 100%; margin-left: 10px' : ''" v-if="skill.spCost > 0">
                  <span>SP消耗</span>
                  <span>{{skill.spCost}}</span>
                </div>
              </div>
              <div>
                <div style="margin: 10px 0">
                  <span>
                    <b style="opacity: 0.5">效果</b>
                  </span>
                </div>
                <div :style="short? 'display: flex;' : ''">
                  <div
                    :style="short? 'margin-left: 10px' : ''"
                    v-for="data in skill.blackboard"
                    :key="data.key"
                  >
                    <span>{{changeBlackboardToCh(data.key)}}</span>
                    <span>{{data.key === 'atk_scale'? data.value * 100 + '%' :data.value}}</span>
                    <span v-if="timeKey.includes(data.key)">s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getEnemyData } from '../utils';

import { Button, Tooltip } from 'element-ui';
import Vue from 'vue';
Vue.use(Button);
Vue.use(Tooltip);

const statusToCh = key => {
  const t = {
    maxHp: '生命上限',
    atk: '攻击',
    def: '防御',
    moveSpeed: '移动速度',
    magicResistance: '法术抵抗',
    baseAttackTime: '攻击间隔',
    hpRecoveryPerSec: '生命回复/秒',
    // spRecoveryPerSec: '每秒Sp回复'
    // maxDeployCount: '最大部署数',
    massLevel: '重量'
    // stunImmune: '免疫打断',
    // silenceImmune: '免疫沉默'
    // massLevel: '重量等级',
    // baseForeLevel: '力量等级'
  };
  return t[key];
};

export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return { message: 'hello' };
      }
    },
    appearMap: {
      type: Object
    },
    keyName: String,
    short: {
      default: false
    }
  },
  data() {
    return {
      level: 0,
      status: [
        [
          ['生命上限', '???'],
          ['攻击', '???'],
          ['防御', '???'],
          ['法术抵抗', '???'],
          ['移动速度', '???'],
          ['攻击间隔', '???'],
          ['生命回复/秒', '???'],
          ['重量', '???'],
          ['攻击范围', '???'],
          ['LifePoint', '???']
        ]
      ],
      skills: [],
      Tag: [],
      timeKey: ['duration', 'dist', 'stun'],
      talents: [],
      currentMap: ''
    };
  },
  watch: {
    data() {
      if (!this.data) return [];
      const tagKey = { stunImmune: '免疫眩晕', silenceImmune: '免疫沉默' };
      let i = 0;
      this.Tag = [];
      this.talents = [];
      this.status = this.data.map(list => {
        const res = [];
        Object.entries(list.enemyData.attributes).forEach(entries => {
          const name = statusToCh(entries[0]);
          if (name) {
            let keyIndex = i;
            keyIndex = entries[1].m_defined > 0 ? i : 0;
            res.push([
              name,
              this.data[keyIndex].enemyData.attributes[entries[0]].m_value,
              entries[0]
            ]);
          } else if (i === 0) {
            if (tagKey[entries[0]] && entries[1].m_value) {
              this.Tag.push(tagKey[entries[0]]);
            }
          }
        });
        let keyIndex = i;

        if (i > 0) {
          keyIndex = list.enemyData.rangeRadius.m_value > 0 ? i : 0;
        }
        if (this.data[keyIndex].enemyData.talentBlackboard)
          this.talents.push(this.data[keyIndex].enemyData.talentBlackboard);
        res.push([
          '攻击范围/格',
          this.data[keyIndex].enemyData.rangeRadius.m_value,
          'rangeScale'
        ]);
        res.push([
          'LifePoint',
          this.data[keyIndex].enemyData.lifePointReduce.m_value
        ]);
        i++;

        return res;
      });
      this.skills = this.data
        .map(list => list.enemyData.skills)
        .filter(el => el);
      if (this.skills.length < this.data.length && this.skills.length === 1) {
        let i = this.data.length;
        while (--i) {
          this.skills.push(this.skills[0]);
        }
      }
    }
  },
  computed: {
    filterKeys() {
      const res = {};
      if (
        this.currentMap === '' ||
        !this.appearMap[this.keyName] ||
        !this.appearMap[this.keyName][this.level]
      )
        return this.status[this.level];
      const target = this.appearMap[this.keyName][this.level].find(el =>
        new RegExp(el.key).test(this.currentMap)
      );
      const changeKey = key => {
        const test = /_/.exec(key);
        if (test) {
          const temp = key.split('');
          temp.splice(test.index, 1);
          temp[test.index] = temp[test.index].toUpperCase();
          return temp.join('');
        } else {
          return key;
        }
      };

      target.runes.forEach(data => {
        if (data.blackboard[0].key === 'enemy') {
          if (data.blackboard[0].valueStr !== this.keyName) return;
          data.blackboard.forEach(el => {
            const key = changeKey(el.key);
            res[key] = res[key] ? res[key] * el.value : el.value;
          });
        } else {
          data.blackboard.forEach(el => {
            const key = changeKey(el.key);
            res[key] = res[key] ? res[key] * el.value : el.value;
          });
        }
      });
      return this.status[this.level].map(el => {
        if (res[el[2]]) {
          return [el[0], Math.floor(el[1] * res[el[2]] * 10) / 10];
        } else {
          return [el[0], el[1]];
        }
      });
    },
    filterTalents() {
      const row = this.talents[this.level];
      return row.map(el => {
        let v = el.value;
        if (/(duration)/.exec(el.key)) {
          v = v + 's';
        }
        if (/up|down|scale|healaura|reborn\.atk/.exec(el.key)) {
          v = v * 100 + '%';
        }
        return {
          key: this.changeTalentsBlackBordtoCh(el.key),
          value: v
        };
      });
    },
    maps() {
      if (
        this.appearMap &&
        this.appearMap[this.keyName] &&
        this.appearMap[this.keyName][this.level]
      ) {
        return this.appearMap[this.keyName][this.level].map(el =>
          el.id.slice(11)
        );
      }
    }
  },
  methods: {
    changeBlackboardToCh(key) {
      const Key = {
        atk_scale: '倍率',
        max_cnt: '最大数量',
        attack_speed: '攻速',
        duration: '持续时间',
        range_radius: '范围/格',
        move_speed: '移动速度',
        dist: '消失',
        branch_id: '地图装置ID',
        stun: '眩晕'
      };
      return Key[key] || key;
    },
    changeTalentsBlackBordtoCh(key) {
      const Key = {
        'invincible.duration': '隐身时间',
        'healaura.hp_recovery_per_sec': '治愈光环',
        'reborn.duration': '复活·时间',
        'atkup.atk': '攻击提升',
        'atkup.hp_ratio': '攻击提升·Hp%',
        'defdown.def': '防御降低·防御',
        'atkSpeedDown.attack_speed': '攻击速度下降·攻击速度',
        'defup.range_radius': '防御提升·范围',
        'antiinvi.range_radius': '侦擦范围',
        'defup.def': '防御提升·防御',
        'boom.atk_scale': '爆炸·倍率',
        'reborn.atk': '复活·攻击'
      };
      return Key[key] || key;
    }
  }
};
</script>

<style scoped>
.enemy-status-wrapper {
  display: flex;
  position: relative;
  /* border: 1px solid black; */
}

.status-details-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  /* border: 1px solid black; */
  /* height: 180px; */
  /* border-right: 1px solid rgba(158, 158, 158, 0.4); */
}
.status-details-talents-wrapper {
  display: flex;
  width: 50%;
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
  margin-left: 5px;
}
.status-phases-wrapper {
  width: 50%;
}
.status-phases-wrapper .el-button--mini {
  background-color: rgba(172, 172, 172, 0.34);
  /* border-color: rgb(153, 153, 153); */
  border: none;
  border-bottom: 2px solid;
  color: rgb(255, 255, 255);
}

.status-phases-wrapper .el-button--primary:focus {
  color: rgb(255, 208, 75);
  background-color: rgb(84, 92, 100);
  border-bottom-color: rgb(255, 208, 75);
}

.status-phases-wrapper .el-button:hover,
.status-phases-wrapper .el-button--primary {
  color: rgb(255, 208, 75);
  background-color: #313131;
  border-bottom: 2px solid rgb(255, 208, 75);
}

.enemy-data-tag-container {
  position: absolute;
  bottom: 0px;
  right: -20px;
}

.enemy-data-tag {
  background-color: rgb(202, 62, 71);
  color: white;
  box-shadow: 0px 2px 2px 0px rgba(123, 75, 77, 0.6);
  padding: 0 10px 2px;
  margin: 10px 0;
  font-size: 16px;
}

.status-phases-text {
  margin-right: 10px;
}
/* .enemy-skill-container {
} */

.enemy-skill-container + .enemy-skill-container {
  border-left: 1px solid rgba(158, 158, 158, 0.4);
  margin-left: 15px;
  padding-left: 15px;
}

.enemy-status-tip {
  margin-left: 20px;
}

.status-details-title.enemy-status-talent {
  width: auto;
  padding: 2px 10px;
  margin: 5px 5px 5px 0;
  max-width: 150px;
}

@media screen and (max-width: 700px) {
  .enemy-status-wrapper {
    flex-wrap: wrap;
  }

  .enemy-data-tag-container {
    right: 0px;
    bottom: auto;
    top: -80px;
  }
  .enemy-data-tag {
    margin: 10px;
  }

  .status-details-talents-wrapper {
    width: 100%;
  }
}
</style>


