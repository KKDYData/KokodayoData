<template>
  <div>
    <nav-menu></nav-menu>
    <div>
      <el-form :inline="!short" :model="char" :rules="rules" class="my-form-wrapper">
        <el-form-item label="角色星级" class="my-form-item-wrapper">
          <el-select class="my-form-item" v-model="char.star" placeholder>
            <el-option v-for="i in [0, 1, 2, 3, 4, 5]" :value="i" :key="i" :label="i + 1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标等级" prop="level" class="my-form-item-wrapper">
          <el-input class="my-form-item" v-model.number="char.level"></el-input>
        </el-form-item>
        <el-form-item label="精英阶段" class="my-form-item-wrapper">
          <el-select class="my-form-item" v-model.number="char.phases" placeholder="等级">
            <el-option v-for="i in phases" :value="i" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有龙门币" class="my-form-item-wrapper" prop="base.money">
          <el-input class="my-form-item" v-model="char.base.money" placeholder="龙门币"></el-input>
        </el-form-item>
        <el-form-item label="已有经验" class="my-form-item-wrapper">
          <el-input class="my-form-item" v-model.number="char.base.exp" placeholder="经验"></el-input>
        </el-form-item>
        <el-form-item label="日产经验" class="my-form-item-wrapper">
          <el-input class="my-form-item" v-model.number="char.production.exp" placeholder="经验"></el-input>
        </el-form-item>
        <el-form-item label="日龙门币" class="my-form-item-wrapper">
          <el-input class="my-form-item" v-model.number="char.production.money" placeholder="经验"></el-input>
        </el-form-item>
        <div class="my-form-item-fill"></div>
        <div class="my-form-item-fill"></div>
      </el-form>
      <el-form label-width="80px" class="my-form-wrapper-result">
        <el-form-item label="需要经验">
          <span>{{ExpNeed}}</span>
        </el-form-item>
        <el-form-item label="需龙门币">
          <span>{{MoneyNeed}}</span>
        </el-form-item>
        <el-form-item label="刷CE5">
          <span>{{CE5}}, 需要体力{{CE5 * 30}}, 天数 {{CE5 * 30 / 300}}</span>
        </el-form-item>
        <el-form-item label="刷LS5">
          <span>{{LS5}}, 需要体力{{LS5 * 30}}, 天数 {{LS5 * 30 / 300}}</span>
        </el-form-item>
        <el-form-item label="白嫖刷LS5">
          <span>{{BLS5}}天</span>
        </el-form-item>
        <el-form-item label="白嫖刷CE5">
          <span>{{BCE5}}天</span>
        </el-form-item>
        <p>按一天300体力算（月卡）</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import NavMenu from './NavMenu';
import data from './components/level.json';
import Vue from 'vue';
import { Form, FormItem, Input, Select, Option } from 'element-ui';
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
export default {
  components: {
    'nav-menu': NavMenu
  },
  created() {
    console.log(this.data);

    this.short = window.innerWidth < 500 ? true : false;
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  computed: {
    phases() {
      const star = this.char.star;
      if (star < 2) return [0];
      else if (star === 2) return [0, 1];
      else return [0, 1, 2];
    },
    MoneyNeed() {
      const star = this.char.star,
        phases = this.char.phases;
      const maxLv = this.data.maxLevel[this.char.star][this.char.phases];
      let level = this.char.level;
      if (!level || level > maxLv - 1) level = maxLv;
      console.log(level);
      let need = 0;
      for (let i = 0; i < phases + 1; i++) {
        for (let j = 0; j < this.data.maxLevel[star][i]; j++) {
          if (i === phases && j === level - 1) break;
          need += this.data.characterUpgradeCostMap[i][j];
        }
      }
      for (let i = 0; i < phases; i++) {
        need += this.data.evolveGoldCost[star][i];
      }
      return need;
    },
    ExpNeed() {
      const star = this.char.star,
        phases = this.char.phases;
      const maxLv = this.data.maxLevel[this.char.star][this.char.phases];
      let level = this.char.level;

      if (level > maxLv) level = maxLv;
      let need = 0;
      for (let i = 0; i < phases + 1; i++) {
        for (let j = 0; j < this.data.maxLevel[star][i]; j++) {
          if (i === phases && j === level - 1) break;
          need += this.data.characterExpMap[i][j];
        }
      }
      return need;
    },
    CE5() {
      return Math.ceil((this.MoneyNeed - this.char.base.money) / 7500);
    },
    LS5() {
      return Math.ceil((this.ExpNeed - this.char.base.exp) / 7400);
    },
    BLS5() {
      return Math.ceil(
        (this.ExpNeed - this.char.base.exp) / (74000 + this.char.production.exp)
      );
    },
    BCE5() {
      return Math.ceil(
        (this.MoneyNeed - this.char.base.money) /
          (75000 + this.char.production.money)
      );
    }
  },
  data() {
    const checkLv = (rule, value, callback, d, e) => {
      console.log(value);
      const maxLv = this.data.maxLevel[this.char.star][this.char.phases];
      if (!value) {
        return callback(new Error('请输入等级，否则按' + maxLv + '等级算'));
      }
      if (value > maxLv) {
        return callback(new Error('超过当前最高等级，会按' + maxLv + '等级算'));
      }
    };
    return {
      char: {
        phases: 0,
        star: 3,
        base: {
          money: 0,
          exp: 0
        },
        production: {
          exp: 0,
          money: 0
        },
        level: 2
      },
      rules: {
        num: [
          {
            message: '请填数字',
            trigger: 'change',
            type: 'number'
          }
        ],
        level: [{ validator: checkLv, trigger: 'change' }]
      },
      ruleForm: {
        age: ''
      },
      data: data,
      short: false
    };
  }
};
</script>

<style scoped>
.my-form-item {
  width: 100px;
}

.my-form-item-wrapper {
  margin: 0px 10px 40px;
}
.my-form-item-fill {
  width: 120px;
}
.my-form-wrapper {
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 20px auto;
  justify-content: space-evenly;
  justify-items: start;
  border-bottom: 1px solid rgba(92, 92, 92, 0.4);
}
.my-form-wrapper-result {
  padding: 20px;
  padding-top: 0;
  margin: 0 auto;
  max-width: 800px;
}

@media screen and (min-width: 600px) {
  .my-form-item-fill {
    width: 188px;
  }
}
</style>

