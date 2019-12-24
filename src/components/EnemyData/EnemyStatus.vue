<template>
  <div>
    <div>
      <slot />
      <div v-if="talents.length > 0" :style="short ? 'margin: 30px 0' : 'margin-bottom: 20px'">
        <div>
          <b>能力·Blackboard</b>
        </div>
        <div v-for="(t) in filterTalents" :key="t.key" style="margin-bottom: 0px">
          <div class="status-details-title enemy-status-talent">
            <span>{{ t.key }}</span>
          </div>
          <span>{{ t.value }}</span>
        </div>
      </div>
    </div>
    <div style="display: flex; align-items: center; margin: 10px 0">
      <!-- 根据有没有mapLevel区分有没有选地图 -->
      <div v-if="mapLevel < 0" class :style="short ? 'width: auto': ''">
        <div style="margin-bottom: 15px">
          <span class="status-phases-text">Level</span>
          <el-button
            v-for="(item, index) in status"
            :key="index"
            size="mini"
            :type="level === index ? 'primary': ''"
            @click="level = index"
          >{{ index }}</el-button>
          <el-tooltip
            popper-class="enemy-tooltip-item"
            class="enemy-status-tip"
            effect="dark"
            :content="'敌人的Level可以理解为敌人的版本，一个地图只会出现一种版本，突袭模式会有地图加成，不是更换版本'"
            placement="top-start"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </div>
      </div>
    </div>

    <div class="enemy-status-wrapper" style="padding-bottom: 20px">
      <div class="enemy-data-tag-container">
        <div v-if="Tag.stunImmune.value" class="enemy-data-tag">{{ Tag.stunImmune.text }}</div>
        <div v-if="Tag.silenceImmune.value" class="enemy-data-tag">{{ Tag.silenceImmune.text }}</div>
      </div>
      <div v-if="data[0] && data[0].enemyData.extra">
        <content-slot long no-wrap>
          <div slot="title">额外记录</div>
          <div slot="content">—</div>
        </content-slot>
        <p v-for="(item, index) in data[0].enemyData.extra" :key="index">{{ item }}</p>
      </div>
      <div class="status-details-talents-wrapper">
        <div class="status-details-wrapper">
          <content-slot
            v-for="kData in filterKeys"
            :key="kData[0]"
            class="status-details-container"
            no-wrap
            long
            :width="100"
          >
            <template slot="title">
              <span>{{ kData[0] }}</span>
            </template>
            <template slot="content">
              <transition name="fade">
                <span>{{ kData[1] }}</span>
              </transition>
              <span v-if="kData[0] === '攻击间隔'">s</span>
              <span v-if="kData[0] === 'LifePoint'">
                <el-tooltip
                  popper-class="enemy-tooltip-item"
                  class="enemy-status-tip"
                  effect="dark"
                  :content="'对基地造成的伤害，例如普通图基地生命有3点，这个敌人进去之后就会扣掉'+ kData[1] + '点生命.'"
                  placement="top-start"
                >
                  <i class="el-icon-info" style="margin-right:0" />
                </el-tooltip>
              </span>
            </template>
          </content-slot>
        </div>
      </div>

      <div>
        <div v-if="skills.length > 0" :style="short? 'margin-top: 20px' : ''">
          <div>
            <b style="font-size: 1.2em">Extra·技能</b>
          </div>
          <div :style="0 ? '' :'display: flex;  flex-wrap: wrap'">
            <div v-for="(skill, index) in targetSkill" :key="index" class="enemy-skill-container">
              <div style="margin: 10px 0">
                <span
                  style="font-size: 1.1em"
                >{{ skill.prefabKey === 'SummonBallis' ? '召唤弩炮': skill.prefabKey.toUpperCase() }}</span>
              </div>
              <div :style="short? 'margin-left: 10px' : ''">
                <span>初始冷却</span>
                <span>{{ skill.initCooldown }}</span>
                <span>s</span>
              </div>
              <div v-if="skill.spCost > 0" :style="short? 'width: 100%; margin-left: 10px' : ''">
                <span>SP消耗</span>
                <span>{{ skill.spCost }}</span>
              </div>
            </div>
            <div>
              <div style="margin: 20px 0 10px">
                <span>
                  <b style="opacity: 0.5">效果</b>
                </span>
              </div>
              <div :style="short? 'display: flex; flex-wrap: wrap' : ''">
                <div
                  v-for="bData in skill.blackboard"
                  :key="bData.key"
                  :style="short? 'margin-left: 10px' : ''"
                >
                  <span>{{ changeBlackboardToCh(bData.key) }}</span>
                  <span>
                    {{ bData.key === 'atk_scale'? bData.value * 100 + '%' : bData.key === 'range_radius'
                    ? bData.value * skillRangeRadius : bData.value }}
                  </span>
                  <span v-if="timeKey.includes(bData.key)">s</span>
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
import { Button, Tooltip } from 'element-ui';
import Vue from 'vue';
Vue.use(Button);
Vue.use(Tooltip);

import { mapState } from 'vuex';
import ContentSlot from '../base/ContentSlot';

import { changeKey } from '../../utils';
import { statusToCh } from '../../utils/string';

export default {
  components: {
    ContentSlot
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return { message: 'hello' };
      }
    },
    appearMap: {
      default: null,
      type: Object
    },
    keyName: {
      type: String,
      default: null
    },
    mapLevel: {
      type: Number,
      default: -1
    },
    mapData: {
      default: null,
      type: Object
    },
    runesMode: {
      type: Boolean,
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
      Tag: {
        stunImmune: {
          text: '眩晕免疫',
          value: false
        },
        silenceImmune: {
          text: '沉默免疫',
          value: false
        }
      },
      timeKey: ['duration', 'dist', 'stun'],
      talents: [],
      currentMap: '',
      skillRangeRadius: 1
    };
  },

  computed: {
    ...mapState(['short']),
    targetSkill() {
      if (this.skills.length < 1) return;
      if (this.mapLevel > -1) return this.skills[this.mapLevel];
      else return this.skills[this.level];
    },
    filterKeys() {
      const res = {};

      // 不选地图，选等级，非突袭，level为用户选择的等级
      if (this.mapLevel < 0) {
        return this.status[this.level];
      }

      //选地图非突袭，mapLevel为地图所选择的等级
      if (this.mapLevel > -1 && !this.runesMode) {
        return this.status[this.mapLevel];
      }


      const lv = this.mapLevel;

      // 防止数据没加载好，不是很安全，有空改一下
      if (!this.status[lv]) return this.status[0];

      // 突袭情况，先判定有没有选地图
      const target = this.mapData;

      target.runes.forEach(data => {
        if (!data.blackboard.length) return;
        if (data.blackboard[0].key === 'enemy') {
          if (data.blackboard[0].valueStr !== this.keyName) return;
          data.blackboard.forEach(el => {
            const key = changeKey(el.key);
            res[key] = res[key] ? res[key] * el.value : el.value;
          });
        } else if (/radius/.exec(data.key)) {
          if (!/skill/.exec(data.key)) {
            res.rangeScale = res.rangeScale
              ? res.rangeScale * data.blackboard[0].value
              : data.blackboard[0].value;
          } else {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.skillRangeRadius = data.blackboard[0].value;
          }
        } else if (data.key !== 'gbuff_lifepoint') {
          data.blackboard.forEach(el => {
            const key = changeKey(el.key);
            res[key] = res[key] ? res[key] * el.value : el.value;
          });
        }
      });

      return this.status[lv].map(el => {
        if (res[el[2]]) {
          return [el[0], Math.floor(el[1] * res[el[2]] * 10) / 10];
        } else {
          return [el[0], el[1]];
        }
      });
    },
    filterTalents() {
      const findTalent = key => {
        if (key < 0) throw Error('天赋查询失败');
        if (this.talents[key]) return this.talents[key];
        else return findTalent(key - 1);
      };
      const row = findTalent(this.level);
      return row.map(el => {
        let v = el.value;
        if (/(duration)/.test(el.key)) {
          v = v + 's';
        }
        if (/((up|down|scale)\.atk)|\.hp_ratio|healaura|speed/.test(el.key)) {
          v = v * 100 + '%';
        } else if (/defdown\.def/.test(el.key)) {
          if (Math.abs(v) < 1) {
            v = v * 100 + '%';
          }
        }
        return {
          key: this.changeTalentsBlackBordtoCh(el.key),
          value: v
        };
      });
    },
  },
  watch: {
    currentMap(v) {
      if (v === '') this.skillRangeRadius = 1;
    },
    data() {
      if (!this.data) return [];
      const tagKey = { stunImmune: '免疫眩晕', silenceImmune: '免疫沉默' };
      this.talents = [];

      this.status = this.data.map((list, i) => {
        const res = [];

        const findDefinedValue = (key, curI) => {
          if (curI < 0) return 0;
          const target =
            this.data[curI].enemyData[key] ||
            this.data[curI].enemyData.attributes[key];
          if (target.m_defined) return target.m_value;
          else return findDefinedValue(key, curI - 1);
        };

        Object.keys(list.enemyData.attributes).forEach(key => {
          const name = statusToCh(key);
          if (name) {
            res.push([name, findDefinedValue(key, i), key]);
          } else if (i === 0) {
            if (tagKey[key]) {
              this.Tag[key].value = findDefinedValue(key, i);
            }
          }
        });

        if (list.enemyData.talentBlackboard)
          this.talents.push(list.enemyData.talentBlackboard);
        res.push([
          '攻击范围/格',
          findDefinedValue('rangeRadius', i),
          'rangeScale'
        ]);
        // console.log(findDefinedValue('rangeRadius', i) + '|range');
        res.push(['LifePoint', findDefinedValue('lifePointReduce', i)]);

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
      const temp = key.split('.');
      if (temp.length < 2) return key;

      const key2str = {
        hp_ratio: '触发血线',

        attack: '攻击力',
        atk: '攻击力',
        atkup: '攻击力↑',

        def: '防御',
        defup: '防御力↑',
        defdown: '防御力↓',

        attack_speed: '攻速',
        atkSpeedDown: '攻速↓',

        speedup: '移速提升',
        move_speed: '移动速度',

        MagicResistance: '法抗↑',
        magic_resistance: '法抗',

        reborn: '复活',

        enrage: '暴怒',

        shield: '护盾',
        dynamic: 'HP',

        invincible: '隐身',

        ReduceBlockCnt: '减少阻挡数',
        block_cnt: '阻挡数量',

        healaura: '治愈光环',

        damage: '伤害',
        'attack@damage': '伤害',
        rangedamage: '范围伤害',
        range_radius: '范围',
        duration: '持续时间',
        interval: '间隔',


        damage_scale: '倍率',
        atk_scale: '倍率',
        hp_recovery_per_sec: '倍率',

        reborn_invincible: '复活隐身',
        attackfreeze: '攻击冻结',
        periodic_damage: '周期伤害'
      };
      const changeKey = key => key2str[key] || key.toUpperCase();

      return changeKey(temp[0]) + '·' + changeKey(temp[1]);
    }
  }
};
</script>

<style scoped>
.enemy-status-wrapper {
  position: relative;
}

.status-details-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-content: start;
}
.status-details-talents-wrapper {
  margin-bottom: 20px;
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
.enemy-skill-container {
  flex-grow: 0.5;
  flex-shrink: 0.5;
  margin-top: 30px;
}

.enemy-skill-container + .enemy-skill-container {
  border-left: 1px solid rgba(158, 158, 158, 0.4);
  margin-left: 15px;
  padding-left: 15px;
}

.enemy-status-tip {
  margin: 0 40px 0 20px;
}

.status-details-title.enemy-status-talent {
  width: auto;
  padding: 2px 10px;
  margin: 5px 5px 5px 0;
  max-width: 180px;
}

.el-button.no-map:hover {
  border: 1px solid #ebeef5;
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

@media screen and (max-width: 360px) {
  .enemy-status-tip {
    margin-left: 10px;
  }
}
</style>


