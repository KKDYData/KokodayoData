<template>
  <div class="enemy-status-wrapper" style="padding-bottom: 20px">
    <p class="status-phases-wrapper" v-if="status.length > 1 && short">
      <span class="status-phases-text">Level</span>
      <el-button
        v-for="(item, index) in status"
        @click="level = index"
        :key="index"
        size="mini"
        :type="level === index ? 'primary': ''"
      >{{index === status.length - 1 ? '突袭' : index}}</el-button>
    </p>
    <div class="enemy-data-tag-container">
      <div class="enemy-data-tag" v-for="tag in Tag" :key="tag">{{tag}}</div>
    </div>
    <div class="status-details-wrapper">
      <div class="status-details-container" v-for="data in status[level]" :key="data[0]">
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

    <div class="status-phases-wrapper">
      <p v-if="status.length > 1 && !short">
        <span class="status-phases-text">Level</span>
        <el-button
          v-for="(item, index) in status"
          @click="level = index"
          :key="index"
          size="mini"
          :type="level === index ? 'primary': ''"
        >{{index === status.length - 1 ? '突袭' : index}}</el-button>
      </p>

      <div v-if="skills.length > 0 && !short">
        <div>
          <b>Extra</b>
        </div>
        <div :style="short ? '' :'display: flex'">
          <div
            class="enemy-skill-container"
            v-for="(skill, index) in skills[level]"
            :key="index"
            style
          >
            <div style="margin: 10px 0">
              <span style="font-size: 1.2em">{{skill.prefabKey.toUpperCase()}}</span>
            </div>
            <div :style="short? 'display: flex; flex-wrap: wrap' : ''">
              <div :style="short? 'margin-left: 10px' : ''">
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
                  <span>{{data.value}}</span>
                  <span v-if="timeKey.includes(data.key)">s</span>
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
      timeKey: ['duration', 'dist']
    };
  },
  watch: {
    data() {
      if (!this.data) return [];
      const tagKey = { stunImmune: '免疫打断', silenceImmune: '免疫沉默' };
      let i = 0;
      this.Tag = [];
      this.status = this.data.map(list => {
        const res = [];
        Object.entries(list.enemyData.attributes).forEach(entries => {
          const name = statusToCh(entries[0]);
          if (name) {
            let keyIndex = i;
            if (i > 0) {
              keyIndex = entries[1].m_value > 0 ? i : 0;
            }
            res.push([
              name,
              this.data[keyIndex].enemyData.attributes[entries[0]].m_value
            ]);
          } else if (i === 1) {
            if (tagKey[entries[0]] && !entries[entries[0].m_value]) {
              this.Tag.push(tagKey[entries[0]]);
            }
          }
        });
        // if(list.rangeRadius.m_value)
        let keyIndex = i;

        if (i > 0) {
          keyIndex = list.enemyData.rangeRadius.m_value > 0 ? i : i - 1;
        }
        res.push([
          '攻击范围/格',
          this.data[keyIndex].enemyData.rangeRadius.m_value
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
      this.level = this.data.length - 1;
      console.log(this.skills);
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
        dist: '消失'
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
  width: 50%;
  align-content: center;
  /* border: 1px solid black; */
  /* height: 180px; */
  /* border-right: 1px solid rgba(158, 158, 158, 0.4); */
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
  background-color: rgba(49, 49, 49);
  color: white;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.66);
  padding: 0 10px;
  margin: 10px 0;
  font-size: 16px;
}

.status-phases-text {
  margin-right: 10px;
}
.enemy-skill-container {
  margin-left: 15px;
}

.enemy-skill-container + .enemy-skill-container {
  border-left: 1px solid rgba(158, 158, 158, 0.4);
  padding-left: 15px;
}

.enemy-status-tip {
  margin-left: 20px;
}

@media screen and (max-width: 700px) {
  .enemy-data-tag-container {
    right: 0px;
    top: -20px;
    bottom: auto;
  }
  .enemy-data-tag {
    margin: 10px;
  }
  .status-details-wrapper {
    width: 100%;
  }
}
</style>


