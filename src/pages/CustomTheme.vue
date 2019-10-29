<template>
  <div
    class="custom-themes-cantainer"
    v-loading="!load"
    element-loading-background="rgba(168, 168, 168, 0.1)"
  >
    <!-- :init-value="k === 'furni_set_beach' ? true: false" -->
    <div>
      <div
        class="custom-head-pic"
        v-loading="themePicLoad"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <el-image fit="fill" @load="themePicLoad = false" :src="currThemePic">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <div class="custom-head-title" v-if="rowData">{{rowData[currKey].name}}</div>
    </div>
    <transition-group name="flip-list">
      <my-slide-title
        v-for="([k, theme], index) in themes"
        :key="k"
        :title="theme.name ? theme.name : '散件'"
        @open="loadData(theme, k, index, $event)"
        :custom-bg="`--custombg: linear-gradient(90deg, #414141 ${Math.max((10 - index) * 7, 0)}%, hsl(${index * 5 + 180}, 67%, 25%))`"
        @monuted="initOpen(index, $event)"
      >
        <div
          class="custom-theme-wrapper"
          v-if="load && groupList[k] && k !== 'bulkFurns' && k === currKey"
        >
          <div class="theme-furn-container">
            <div class="theme-details-container">
              <p>{{theme.desc}}</p>
              <div>
                <div class="theme-desc">氛围：{{groupList[k].comfort}}</div>
                <div class="theme-desc">总价格：{{groupList[k].price}}</div>
              </div>
              <div v-if="extraComfort[k]">
                <div class="theme-desc">自动摆放最大氛围：{{extraComfort[k]}}</div>
              </div>
            </div>
            <div v-if="groupList[k].extraFurn && groupList[k].extraFurn.length">
              <furni-list type="extra" :furnis="groupList[k].extraFurn"></furni-list>
            </div>
            <div v-for="group in groupList[k].lists" :key="group.name">
              <p style="color: #313131; margin-bottom: 0">
                {{group.name}}
                <span>套件氛围： {{group.comfort}}</span>
              </p>
              <furni-list :furnis="group.list"></furni-list>
            </div>
          </div>
        </div>

        <div v-if="k === 'bulkFurns' &&  groupList[k]  && k === currKey" style="padding-top: 20px">
          <furni-list type="BULK" :furnis="groupList[k]"></furni-list>
        </div>
      </my-slide-title>
    </transition-group>
  </div>
</template>

<script>
import MySlideTitle from '../components/base/MySlideTilte';
import FurniList from '../components/base/FurniLIst';
import { bsr } from '../utils';
import { getThemeList, getFurn } from '../utils/fetch';
import { path } from '../utils/listVer';

import { Loading } from 'element-ui';
import Vue from 'vue';
Vue.use(Loading);

const ease = t => bsr(t, 0.38, 0.93, 0.78, 1.02);


export default {
  components: { MySlideTitle, FurniList },
  data() {
    return {
      rowData: null,
      themes: [],
      groupList: {},
      comfortList: {},
      extraComfort: {},
      load: false,
      priceList: {},
      path,
      currOpen: null,
      currKey: 'furni_set_beach',
      themePicLoad: true
    };
  },
  async created() {

    const data = await getThemeList();
    this.rowData = data;
    const arr = Object.entries(data).reverse();
    this.themes = arr;
    const temp = this.themes.shift();
    this.themes.push(temp);
    this.load = true;
  },
  computed: {
    currThemePic() {
      return `${this.path}custom/themes/${this.currKey}_optimized.png?x-oss-process=style/jpg-test`;
    }
  },
  methods: {
    initOpen(index, e) {
      if (index === 0) {
        e.click(true);
      }
    },
    async loadData(target, k, index, e) {
      let top = document.body.scrollTop || document.documentElement.scrollTop;
      const anima = top / window.innerHeight > 0.5;
      if (!anima) {
        this.currKey = k;
        const temp = this.themes.splice(index, 1);
        this.themes.unshift(...temp);

      } else {
        setTimeout(() => {
          top = document.body.scrollTop || document.documentElement.scrollTop;
          const total = top;
          const time = top / window.innerHeight * 700;
          let start;
          const toTop = (timeStamp) => {
            if (!start) start = timeStamp;
            const progress = Math.min((timeStamp - start) / time, 1);
            const b = ease(progress);
            top = (1 - b) * total;
            document.body.scrollTop = document.documentElement.scrollTop = top;
            if (progress < 1) {
              requestAnimationFrame(toTop);
            }
          };
          requestAnimationFrame(toTop);
          const temp = this.themes.splice(index, 1);
          this.themes.unshift(...temp);

          setTimeout(() => {
            this.currKey = k;
          }, time + 300);
        }, 500);
      }

      const theme = target;

      this.themePicLoad = true;
      if (!this.groupList[k]) {
        this.load = false;
        if (k === 'bulkFurns') {
          const list = await Promise.all(theme.map(el => getFurn(el)));
          this.$set(this.groupList, k, list);
        } else {
          const lists = await Promise.all(theme.groups
            .map(({ comfort, furniture, name }) =>
              Promise.all(furniture.map(el => getFurn(el)))
                .then(list => ({ name, list, comfort }))));

          const comfort = lists.reduce((res, cur) => {
            return res += cur.comfort + cur.list.reduce((res, cur) => res += cur.comfort, 0);
          }, 0);

          let extraFurn, extraFurnComfort;
          if (theme.extraFurn) {
            extraFurn = await Promise.all(theme.extraFurn
              .map(([k, count]) => getFurn(k).then(item => ({ ...item, count }))));
            extraFurnComfort = comfort + extraFurn.reduce((res, cur) => res += cur.comfort * (cur.count - 1), 0);
          }

          const price = lists.reduce((res, cur) =>
            res += cur.list.reduce((res, cur) => {
              let p = cur.processedProductCount * 2;
              if (p % 10 === 6) p--;
              cur.price = p;
              return res += p;
            }, 0), 0);
          this.$set(this.extraComfort, k, extraFurnComfort);
          this.$set(this.comfortList, k, comfort);
          this.$set(this.priceList, k, price);
          this.$set(this.groupList, k, { lists, comfort, price, extraFurn });
        }
        this.load = true;
      }
      if (this.currOpen && (e !== this.currOpen)) {
        this.currOpen.close();
      }
      this.currOpen = e;
      this.themePicLoad = false;


    },
  }
};
</script>

<style lang="stylus" scoped>
.custom-themes-cantainer {
  width: 1000px
  margin: 20px auto 0
  --width: 1000px
}

.custom-head-pic {
  width: var(--width)
  height: calc(var(--width) * 0.294)
  box-sizing: border-box
  border: 10px solid #313133
  font-size: 0

  & >>> .el-image {
    width: 100%
    height: 100%
  }
}

.custom-head-title {
  font-size: 1.5em
  color: #525252
}

.custom-theme-wrapper {
}

.theme-details-container {
}

.theme-desc {
  display: inline-block
  width: fit-content
  font-size: 0.9em
  color: #828282
}

.theme-desc + .theme-desc {
  margin-left: 10px
}

.theme-furn-container {
  flex-grow: 1
}

@media screen and (max-width: 1000px) {
  .custom-themes-cantainer {
    --width: 90vw
    width: calc(100% - 10vw)
    margin: 20px auto 0
  }
}
</style>
