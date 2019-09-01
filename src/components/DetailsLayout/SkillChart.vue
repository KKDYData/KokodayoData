<template>
  <div>
    <el-popover :placement="short ? 'right':  'left'" :popper-class="short ? 'mobile-rotate' : ''">
      <div class="data-toggle" slot="reference">
        <div>单点伤害{{skillAtk}}</div>
        <div class="el-circle-icon" style="position: unset; margin-left: 10px">
          <i class="el-icon-data-line"></i>
        </div>
      </div>
      <div>
        <div class="chart-body" ref="chart"></div>
        <div class="chart-details-container">
          <div>攻击间隔: {{baseAttackTime | format}}</div>
          <div>| 攻击速度: {{speedUp | format}}</div>
          <div>| 降低防御: {{defDown | format}}</div>
          <div>| 降低防御比例: {{defDownScale | format}}</div>
          <div>| 降低魔抗: {{margicResistance}}</div>
          <div>| 降低魔抗比例: {{margicResistanceR}}</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import echarts from 'echarts/lib/echarts';

const splitToData = e => typeof e === 'number' ? e : +e.split('<')[0];



const upWhat = (what, base, e) => e.blackboard.reduce((res, cur) => {
  if (cur.key === what) res += cur.value;
  return res;
}, base);

const upAtk = (base, e) => upWhat('atk', base, e);
const upScale = (base, e) => upWhat('atk_scale', base, e);
const upProb = (base, e) => upWhat('prob', base, e);
const upProb2 = (base, e) => upWhat('prob2', base, e);
const upBaseAttackTime = (base, e) => upWhat('base_attack_time', base, e);
const toProb = (prob, scale, v) => v * scale * prob + v * (1 - prob);
const phyTdx = (atk, def, baseAttackTime, attackTimes) => {
  const res = (atk - Math.max(def, 0));
  return Math.max(res, atk * 0.05) / baseAttackTime * attackTimes;
};
const magicTdx = (atk, def, baseAttackTime, attackTimes) => (atk * (1 - def / 100)) / baseAttackTime * attackTimes;

const getWhatDef = function (what, merge, skill, talents) {
  let temp = /命中目标/.test(skill.description) ? upWhat(what, 0, skill) : 0;
  let res = 0,
    prob = upProb(0, skill);


  res = merge(temp, res);
  Object.values(talents).forEach((cur) => {
    if (res < 0) return;
    prob = upProb(prob, cur);
    const temp = upWhat(what, 0, cur);
    if (temp < 0) {
      res = merge(temp, res);
    }
  });

  if (prob) {
    const findSkillProb = upWhat('talent@prob', 0, skill);
    if (findSkillProb) {
      prob = findSkillProb;
    }
  }
  console.log(what, res);
  return prob > 0 ? prob * res : res;
};

const mergeDef = (temp, res) => {
  if (temp < -1) {
    res += temp;
  }
  return res;
};
const mergeDefR = (temp, res) => {
  if (temp < 0 && temp > -1) {
    res += temp;
  }
  return res;
};

export default {
  props: {
    skill: {
      required: true
    },
    status: {
      required: true
    },
    talents: {
      required: true
    },
    profession: {
      required: true
    },
    short: {
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  filters: {
    format(v){
      return Math.round(v * 100) / 100;
    }
  },
  computed: {
    magic() {
      if(/变为法术/.test(this.skill.description)) return true;
      if (this.profession !== 'CASTER' && this.profession !== 'SUPPORT') return false;
      else return true;
    },
    atk() {
      return splitToData(this.status.atk);
    },
    speedUp(){
      const talentSpeedUp = Object.values(this.selectedTalents).reduce((res, cur) => res + upWhat('attack_speed', 0, cur), 0);
      const skillSpeedUp = upWhat('attack_speed', 0, this.skill);
      return   100 + talentSpeedUp + skillSpeedUp;
    
    },
    baseAttackTime() {
      const time = splitToData(this.status.baseAttackTime);
      const test = /对攻击范围内的敌人造成每秒/.test(this.skill.description);
      const duration = this.skill.duration === -1;

      // 暂时只有技能有减攻击间隔的
      let baseTime = upBaseAttackTime(time, this.skill);
      const shorten = /缩短/.test(this.skill.description);
      // 检查是否是安洁莉娜的模式
      if (shorten && baseTime - time > 0) {
        console.log('shorten !!!!!', baseTime, time);
        baseTime = (baseTime - time) * time;
      }


      return test || duration ? 1 : baseTime; 
    },
    attackTimes() {
      const times = upWhat('attack@times', 0, this.skill);
      return times ? times : 1;
    },
    defDownScale() {
      const res = getWhatDef('def', mergeDefR, this.skill, this.selectedTalents);
      console.log(res);
      return res < 0 ? res : 0;
    },
    defDown() {
      return getWhatDef('def', mergeDef, this.skill, this.selectedTalents);
    },
    margicResistance() {
      return getWhatDef('magic_resistance', mergeDef, this.skill, this.selectedTalents);
    },
    margicResistanceR() {
      const res = /无视防御力和法术抗性/.test(this.skill.description) ? -1 : getWhatDef('magic_resistance', mergeDefR, this.skill, this.selectedTalents);
      return res < 0 ? res : 0;
    },
    selectedTalents() {
      return this.talents.reduce((res, { condidate }) => {
        res[condidate[0].prefabKey] = condidate[condidate.length - 1];
        return res;
      }, {});

    },
    skillAtk() {
      let atkUp = upAtk(1, this.skill);
      let atkScale = upScale(0, this.skill),
        prob = upProb(0, this.skill),
        prob2 = upProb2(0, this.skill);

      if (!atkScale) {
        atkScale = upWhat('attack@atk_scale', 0, this.skill);
      }
      if (!atkScale) {
        atkScale = upWhat('damage_scale', 0, this.skill);
      }

      const selectedTalents = this.selectedTalents;

      Object.values(selectedTalents).forEach((cur) => {
        atkUp = upAtk(atkUp, cur);
        // 可能有问题，在天赋和技能都有攻击倍率的时候
        let tempScale = upScale(atkScale, cur);
        if (tempScale) {
          atkScale = tempScale;
        }
        prob = upProb(prob, cur);
        prob2 = upProb2(prob2, cur);

      });

      let atk = this.atk * atkUp; // this.baseAttackTime;


      if (prob) {
        const findSkillProb = upWhat('talent@prob', 0, this.skill);
        if (findSkillProb) {
          prob = findSkillProb;
        }
      }
      if (prob2) {
        // 针对大尾巴狼
        prob = prob2;
      }
      if (atkScale) {
        console.log('find atkScale!', atkScale, prob);
      }
      console.log('atkUp', atkUp);

      if (atkScale > 0) {
        atk = prob ? toProb(prob, atkScale, atk) : atk * atkScale;//atk * atkScale * prob + atk * (1 - prob);
      }
      return Math.round(atk);
    },

    dps() {
      let def = 0;
      const data = [],
        xAxis = [];
      const maxDef = this.magic ? 100 : 2000;
      while (def <= maxDef) {
        const resDef = def * (1 + this.defDownScale) + this.defDown;
        const resMagicR = Math.max((def + this.margicResistance) * (1 + this.margicResistanceR), 0);
        const dps = !this.magic ? phyTdx(this.skillAtk, resDef, this.baseAttackTime, this.attackTimes) * this.speedUp / 100
          : magicTdx(this.skillAtk, resMagicR, this.baseAttackTime, this.attackTimes) * this.speedUp / 100;
        // console.log(def, this.margicResistanceR, resMagicR, dps, this.baseAttackTime);
        data.push(Math.round(dps > 0 ? dps : 0));
        xAxis.push(def);
        def += this.magic ? 5 : 50;
      }
      return {
        xAxis,
        yAxis: { type: 'value' },
        series: [
          {
            name: 'dps',
            type: 'bar',
            data,

          }
        ]
      };
    }
  },
  watch: {
    dps(v) {
      this.chart.setOption({
        tooltip: {},
        title: {
          text: '技能DPS'
        },
        xAxis: {
          data: v.xAxis,
          name: this.magic ? '魔抗' : '物防'

        },
        yAxis: { type: 'value' },
        series: v.series
      });
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);

    this.chart.setOption({
      tooltip: {},
      title: {
        text: '技能DPS'
      },
      xAxis: {
        data: this.dps.xAxis,
        name: this.magic ? '魔抗' : '物防'
      },
      yAxis: {},
      series: this.dps.series
    });
  }
};
</script>

<style lang="stylus" scoped>
.chart-body {
  height: 300px
  width: 600px
}

.data-toggle {
  display: flex
  align-items: center
  width: 100%
}

.chart-details-container {
  display: flex
  flex-wrap: wrap
}
</style>
