<template>
  <div>
    <div>
      <el-form :inline="!short" :model="char">
        <div class="my-form-wrapper">
          <el-form-item label="角色星级" class="my-form-item-wrapper">
            <el-select
              :size="short ? 'medium' : ''"
              class="my-form-item"
              v-model="char.star"
              placeholder
            >
              <el-option v-for="i in [0, 1, 2, 3, 4, 5]" :value="i" :key="i" :label="i + 1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前等级" prop="level" class="my-form-item-wrapper">
            <el-input-number
              :size="short ? 'medium' : ''"
              controls-position="right"
              class="my-form-item"
              :step="10"
              :min="0"
              :max="data.maxLevel[char.star][char.phases_now]"
              v-model.number="char.level_now"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="精英阶段" class="my-form-item-wrapper">
            <el-select
              :size="short ? 'medium' : ''"
              class="my-form-item"
              v-model.number="char.phases_now"
              placeholder="等级"
            >
              <el-option v-for="i in phases" :value="i" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="my-form-wrapper">
          <div class="my-form-item-fill"></div>
          <el-form-item label="目标等级" prop="level" class="my-form-item-wrapper">
            <el-input-number
              :size="short ? 'medium' : ''"
              controls-position="right"
              class="my-form-item"
              :step="10"
              :min="0"
              :max="data.maxLevel[char.star][char.phases]"
              v-model.number="char.level"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="精英阶段" class="my-form-item-wrapper">
            <el-select
              :size="short ? 'medium' : ''"
              class="my-form-item"
              v-model.number="char.phases"
              placeholder="等级"
            >
              <el-option v-for="i in phases" :value="i" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="my-form-wrapper">
          <el-form-item label="有龙门币/千" class="my-form-item-wrapper" prop="base.money">
            <el-input-number
              :size="short ? 'medium' : ''"
              controls-position="right"
              class="my-form-item"
              v-model="char.base.money"
              :step="10"
              :min="0"
              placeholder="龙门币"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="基建经验|千/日" class="my-form-item-wrapper">
            <el-input-number
              :size="short ? 'medium' : ''"
              :step="10"
              :min="0"
              controls-position="right"
              class="my-form-item"
              v-model.number="char.production.exp"
              placeholder="经验"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="基建龙币|千/日" class="my-form-item-wrapper">
            <el-input-number
              :size="short ? 'medium' : ''"
              controls-position="right"
              :step="10"
              :min="0"
              class="my-form-item"
              v-model.number="char.production.money"
              placeholder="经验"
            ></el-input-number>
          </el-form-item>
        </div>

        <div class="my-form-wrapper extra-exp">
          <el-form-item
            v-for="(card, index, key) in exp_cards"
            :key="card.iconId"
            label="已有经验/千"
            class="my-form-item-wrapper"
          >
            <div slot="label">
              <item-viewer class="exp-card" :short="!short" :item="card"></item-viewer>
            </div>
            <el-input-number
              :size="short ? 'medium' : ''"
              controls-position="right"
              class="my-form-item"
              v-model.number="char.base.exp_cards[key]"
              placeholder="经验"
              :min="0"
              :step="10"
            ></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <el-form label-width="80px" class="my-form-wrapper-result" inline>
        <el-form-item label="需要经验">
          <span>{{ExpNeed}}</span>
        </el-form-item>
        <el-form-item label="需龙门币">
          <span>{{MoneyNeed}}</span>
        </el-form-item>

        <el-form-item label="已有经验">
          <span>{{baseExp}}</span>
        </el-form-item>
      </el-form>
      <el-form label-width="80px" class="my-form-wrapper-result">
        <el-form-item label="刷CE5">
          <span>{{CE5}}次, 需要理智{{CE5 * 30}}点, 天数 {{CE5 * 30 / 300}}</span>
        </el-form-item>
        <el-form-item label="刷LS5">
          <span>{{LS5}}次, 需要理智{{LS5 * 30}}点, 天数 {{LS5 * 30 / 300}}</span>
        </el-form-item>
        <el-form-item label="基建+CE5">
          <span>{{BCE5}}天</span>
        </el-form-item>
        <el-form-item label="基建+LS5">
          <span>{{BLS5}}天</span>
        </el-form-item>

        <p>按一天300体力算（月卡）</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import data from './level.json';
import ItemViewer from './ItemViewer';
import Vue from 'vue';
import { Form, FormItem, Select, Option, InputNumber, Alert } from 'element-ui';
import { exp_cards } from '../utils/string';
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(InputNumber);
Vue.use(Alert);

export default {
  data() {
    return {
      char: {
        phases: 0,
        phases_now: 0,
        level_now: 1,
        star: 3,
        base: {
          money: 0,
          exp_cards: [0, 0, 0, 0]
        },
        production: {
          exp: 0,
          money: 0
        },
        level: 10
      },
      data: data,
      short: false,
      exp_cards: exp_cards
    };
  },
  components: {
    'item-viewer': ItemViewer
  },
  beforeMount() {
    console.log('下面是计算用的数据，可以复制去自己用');
    console.log(this.data);
    this.short = window.innerWidth < 600 ? true : false;
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 600 ? true : false;
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
      return this.calBase('characterUpgradeCostMap');
    },
    ExpNeed() {
      return this.calBase('characterExpMap');
    },
    baseExp() {
      let res = 0;
      this.char.base.exp_cards.forEach((el, index) => {
        res += el * this.exp_cards['200' + (index + 1)].exp;
        // return (cur += pre * this.exp_cards['200' + (cIndex + 1)].exp);
      });
      return res;
    },
    CE5() {
      const result = Math.ceil(
        (this.MoneyNeed - this.char.base.money * 1000 - this.LS5 * 360) / 7500
      );
      return result > -1 ? result : 0;
    },
    LS5() {
      const result = Math.ceil((this.ExpNeed - this.baseExp) / 7400);
      return result > -1 ? result : 0;
    },
    BLS5() {
      const result = Math.ceil(
        (this.ExpNeed - this.baseExp) /
          (74000 + this.char.production.exp * 1000)
      );
      return result > -1 ? result : 0;
    },
    BCE5() {
      const result = Math.ceil(
        (this.MoneyNeed - this.char.base.money * 1000) /
          (75000 + this.char.production.money * 1000)
      );
      return result > -1 ? result : 0;
    }
  },
  methods: {
    calBase(target) {
      const star = this.char.star,
        phases = this.char.phases;
      const maxLv = this.data.maxLevel[this.char.star][this.char.phases];
      let level = this.char.level - 1;
      if (level > maxLv) level = maxLv;
      let need = 0;
      for (let i = this.char.phases_now; i < phases + 1; i++) {
        // console.log(`now phases: ${i}, targetP: ${phases}}`);
        for (
          let j = i === this.char.phases_now ? this.char.level_now - 1 : 0;
          j < this.data.maxLevel[star][i] - 1;
          j++
        ) {
          if (i === phases && j > level - 1) break;
          // console.log(`i:${i}, phases: ${phases}`);
          need += this.data[target][i][j];
          // console.log(`j: ${j}, maxlv: ${level}, need: ${need}`);
        }
      }
      if (target === 'characterUpgradeCostMap') {
        // debugger;
        // console.log(need);
        for (let i = this.char.phases_now; i < phases; i++) {
          need += this.data.evolveGoldCost[star][i];
        }
      }
      // console.log('need_____' + need);
      return need;
    }
  }
};
</script>

<style scoped>
.my-form-item {
  /* width: 30%; */
  max-width: 120px;
}

.my-form-item-wrapper {
  /* margin: 0px 10px 40px; */
  --wrapperH: 5vh;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* width: 220px; */
}
.my-form-item-fill {
  width: 188px;
  height: 5vh;
}
.my-form-wrapper {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0px auto;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(92, 92, 92, 0.4);
}
.my-form-wrapper-result {
  padding: 20px;
  padding-top: 0;
  margin: 0 auto;
  max-width: 800px;
}
.extra-exp {
  height: 100px;
  justify-content: space-around;
}

.extra-exp .my-form-item {
  max-width: 100px;
}

@media screen and (max-width: 800px) {
  .my-form-wrapper {
    height: 100px;
    font-size: 13px;
    padding: 0 5vw;
  }
  .my-form-item-fill {
    width: 110px;
    height: 100px;
  }

  .my-form-item-wrapper {
    width: 106px;
  }
  .my-form-item {
    max-width: 100px;
  }

  .extra-exp {
    height: auto;
    justify-content: space-between;
  }
  .extra-exp .my-form-item-wrapper {
    width: calc(50vw - 150px);
    margin: 15px 40px;
  }

  .extra-exp .my-form-item {
    max-width: 100px;
  }
}

@media screen and (max-width: 600px) {
  .extra-exp .my-form-item-wrapper {
    width: calc(50vw - 23px);
    /* padding: 0; */
    margin: 15px 0;
  }
}
</style>

