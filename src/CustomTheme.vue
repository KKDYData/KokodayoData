<template>
  <div class="custom-theme-cpntainer">
    <my-slide-title
      v-for="(theme, k) in themes"
      :key="theme.id"
      :title="theme.name ? theme.name : '散件'"
      :init-value="k === 'furni_set_beach' ? true: false"
      @open="loadData(theme, k)"
    >
      <div v-if="load && groupList[k] && k !== 'bulkFurns'">
        <div style="padding: 5px">
          <p>{{theme.desc}}</p>
          <div>
            <div>舒适度：{{groupList[k].comfort}}</div>
            <div>总价格：{{groupList[k].price}}</div>
          </div>
        </div>
        <div>
          <div v-for="group in groupList[k].lists" :key="group.name">
            <p>
              {{group.name}}
              <span>套件舒适度： {{group.comfort}}</span>
            </p>
            <furni-list :furnis="group.list"></furni-list>
          </div>
          <div v-if="groupList[k].extraFurn">
            <furni-list type="extra" :furnis="groupList[k].extraFurn"></furni-list>
          </div>
        </div>
      </div>
      <div v-if="k === 'bulkFurns' &&  groupList[k]">
        <furni-list :furnis="groupList[k]"></furni-list>
      </div>
    </my-slide-title>
  </div>
</template>

<script>
import MySlideTitle from './components/MySlideTilte';
import FurniList from './components/FurniLIst';
import { getThemeList, getFurn } from './utils';
import { Promise } from 'q';

export default {
  components: { MySlideTitle, FurniList },
  data() {
    return {
      themes: [],
      groupList: {},
      comfortList: {},
      load: false,
      priceList: {}
    };
  },
  async created() {
    this.themes = await getThemeList();
    await this.loadData(this.themes.furni_set_beach, 'furni_set_beach');
    this.load = true;
  },
  methods: {
    async loadData(theme, k) {
      if (!this.groupList[k]) {
        if (k === 'bulkFurns') {
          const list = await Promise.all(theme.map(el => getFurn(el)));
          this.$set(this.groupList, k, list);
        } else {
          const lists = await Promise.all(theme.groups
            .map(({ comfort, furniture, name }) =>
              Promise.all(furniture.map(el => getFurn(el)))
                .then(list => ({ name, list, comfort }))));

          let extraFurn;
          if (theme.extraFurn) {
            extraFurn = await Promise.all(theme.extraFurn
              .map(([k, count]) => getFurn(k).then(item => ({ ...item, count }))));
          }
          const comfort = lists.reduce((res, cur) => {
            return res += cur.comfort + cur.list.reduce((res, cur) => res += cur.comfort, 0);
          }, 0);
          const price = lists.reduce((res, cur) =>
            res += cur.list.reduce((res, cur) => {
              let p = cur.processedProductCount * 2;
              if (p % 10 === 6) p--;
              cur.price = p;
              return res += p;
            }, 0), 0);
          console.log(comfort);
          this.$set(this.comfortList, k, comfort);
          this.$set(this.priceList, k, price);
          this.$set(this.groupList, k, { lists, comfort, price, extraFurn });
        }
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
.custom-theme-cpntainer {
  width: 1000px
  margin: 0 auto
}
</style>
