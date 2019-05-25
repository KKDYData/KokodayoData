<template>
  <div>
    <div class="ratecaulator-skill-wrapper">
      <div class="ratecaculator-skill-label">
        <span>选择技能：</span>
      </div>
      <el-select v-model="selectedSkill">
        <el-option
          v-for="skill in skills"
          :key="skill.id"
          :disabled="skill.rate.att_rate === 'n/a'"
          :label="skill.name"
          :value="skill.id"
        >{{skill.name}}</el-option>
      </el-select>
    </div>
    <div class="ratecaulator-wrapper">
      <div style="width:450px">
        <div class="ratecaulator-data-wrapper">
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>攻击</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-autocomplete
                size="mini"
                :fetch-suggestions="getAttackSug"
                v-model="attack"
                placeholder="输入攻击"
              ></el-autocomplete>
            </div>
            <div v-if="!/^[\d]*$/.test(attack)">
              <span style="color:red">攻击必须是数字</span>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>暴伤</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-autocomplete
                size="mini"
                :fetch-suggestions="getBsSug"
                v-model="Bs"
                placeholder="暴击伤害"
              >
                <template slot="suffix">%</template>
              </el-autocomplete>
            </div>
            <div v-if="!/^[\d]*$/.test(attack)">
              <span style="color:red">暴伤必须是数字</span>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>技能等级</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-select size="mini" v-model="selectedSkillRank" placeholder="选择等级">
                <el-option value="0">0</el-option>
                <el-option
                  v-for="(item ,index) in skills[selectedSkill].update"
                  :key="index"
                  :value="index + 1"
                >{{index + 1}}</el-option>
              </el-select>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>敌人防御</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-input size="mini" v-model="defense" placeholder="1-1防御为55" type="number"></el-input>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>血量</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-input size="mini" v-model="hp" placeholder="血量/速度/防御" type="number"></el-input>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>HP因素倍率</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-input size="mini" v-model="hp_scaling" placeholder="倍率" type="number"></el-input>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>速度</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-input size="mini" v-model="speed" placeholder="血量/速度/防御" type="number"></el-input>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>速度因素倍率</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-input size="mini" v-model="speed_scaling" placeholder="倍率" type="number">
                <template slot="suffix">%</template>
              </el-input>
            </div>
          </div>
          <div class="ratecaculator-data-input">
            <div class="ratecaculator-data-input-label">
              <span>其它倍率</span>
            </div>
            <div class="ratecaculator-data-inputbox">
              <el-input size="mini" v-model="other_scaling" placeholder="倍率" type="number"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="ratecaculator-result-wrapper">
        <p>技能倍率： {{skills[selectedSkill].rate.att_rate}}</p>
        <p>伤害{{damage}}</p>
        <p>命中伤害{{damage * 1.3}} 克制：{{Math.floor(damage * 1.3 * 1.1)}}</p>
        <p>暴击伤害{{critDamge}} 克制：{{Math.floor(critDamge * 1.1)}}</p>
      </div>
    </div>
    <div class="ratecaculator-result-wrapper">
      <el-collapse>
        <el-collapse-item title="公式和说明">
          <p>(攻击力*技能倍率 + HP*HP因素倍率)*属性克制增伤*(1.871*技能等级倍率)/(敌人防御/300+1)*攻击类型*(其它增伤，例如速度增伤或者攻击buff)</p>
          <p>攻击类型分为不暴击，*1，暴击， *暴击伤害， 命中， *1.3， 闪避， *0.75</p>
          <p>属性克制， *1.1</p>
          <p>技能等级倍率，通过升级技能，最高1.3</p>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { Select, Option, Input, Autocomplete } from "element-ui";
import Vue from "vue";
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Autocomplete);

export default {
  props: {
    skills: Array,
    stats: Object
  },
  data() {
    return {
      selectedSkill: 0,
      attack: this.stats.base.attack.value,
      selectedSkillRank: "0",
      Bs: this.stats.extra.criticalHitDamage.value.match(/\d+/)[0],
      hp: this.stats.base.health.value,
      hp_scaling: 0,
      speed: this.stats.base.speed.value,
      speed_scaling: 0,
      other_scaling: 1,
      defense: 55
    };
  },
  computed: {
    damage() {
      //(attack*att_rate + health*hpScaling)*element*(1.871*pow!)/(enemyDef/300+1)*hitType
      let attrate = /^[\d]+$/.test(
        this.skills[this.selectedSkill].rate.att_rate
      )
        ? this.skills[this.selectedSkill].rate.att_rate
        : this.skills[this.selectedSkill].rate.att_rate.match(/[\d|.]+/)[0];

      const attack = Number(this.attack),
        att_rate = Number(attrate),
        pow = this.pow,
        hp_scaling = this.hp_scaling,
        hp = this.hp,
        speed_scaling = this.speed_scaling,
        speed = this.speed,
        other = this.other_scaling,
        defense = this.defense;

      return Math.ceil(
        (((attack * att_rate + hp_scaling * hp) * 1.871 * pow) /
          (defense / 300 + 1)) *
          (1 + (speed_scaling / 100) * speed) *
          (1 + other)
      );
    },
    pow() {
      let p = /^[\d]+$/.test(this.skills[this.selectedSkill].rate["pow!"])
        ? this.skills[this.selectedSkill].rate["pow!"]
        : this.skills[this.selectedSkill].rate["pow!"].match(/[\d|.]+/)[0];
      let pow = Number(p);
      for (let i = 0; i < this.selectedSkillRank; i++) {
        if (
          this.skills[this.selectedSkill].update[i].match("傷害量增加") !== null
        ) {
          console.log(this.skills[this.selectedSkill].update[i]);
          pow +=
            Number(this.skills[this.selectedSkill].update[i].match(/\d+/)) /
            100;
        }
      }
      return Math.floor(pow * 100) / 100;
    },
    critDamge() {
      return (this.damage * this.Bs) / 100;
    },
    elementDamage() {
      return this.damage * 1.1;
    }
  },
  methods: {
    getAttackSug(queryString, cb) {
      var results = [
        { value: "1000" },
        { value: "2000" },
        { value: "3000" },
        { value: "4000" }
      ];
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getBsSug(queryString, cb) {
      var results = [
        { value: "150" },
        { value: "200" },
        { value: "250" },
        { value: "300" },
        { value: "350" }
      ];
      // 调用 callback 返回建议列表的数据
      cb(results);
    }
  }
};
</script>
<style scoped>
.ratecaulator-wrapper {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
.ratecaulator-title {
  margin-left: 5vw;
}
.ratecaulator-data-wrapper {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin: 10px;
}
.ratecaculator-data-input {
  margin: 5px;
  font-size: 14px;
  width: 100px;
}
.ratecaculator-data-input-label {
  display: inline-block;
}
.ratecaculator-data-inputbox {
  display: inline-block;
}
.ratecaulator-skill-wrapper {
  display: inline-block;
  margin: 10px;
}
.ratecaculator-skill-label {
  display: inline;
}
.ratecaculator-result-wrapper {
  text-align: left;
}
@media screen and (max-width: 700px) {
  .ratecaculator-result-wrapper {
    width: 100%;
    padding: 5vw;
  }
}
</style>

