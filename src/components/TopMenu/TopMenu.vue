<template>
  <div>
    <div v-if="!short" class="top-menu">
      <route-item :short="short" :data="home" />
      <route-item
        v-for="(route) in routes"
        :key="route.path"
        :short="short"
        :data="route"
        @click="go(route)"
      />
    </div>
    <div v-else class="mobile-menu">
      <div class="top-menu">
        <route-item top :short="short" :data="home" />
        <h-drawer ref="drawer" custom-class="router-drawer" size="50%" direction="ttb">
          <div slot="reference" class="router-more">
            更多
            <sup>new</sup>
          </div>
          <route-item :short="short" :data="home" />
          <route-item
            v-for="(route) in routes"
            :key="route.path"
            :short="short"
            :data="route"
            @click.native="go(route)"
          />
        </h-drawer>
      </div>
    </div>
  </div>
</template>
<script>
import RouteItem from './RoutItem'
import { mapState } from 'vuex'
import HDrawer from '@/components/base/Popping'


export default {
  components: {
    RouteItem,
    HDrawer
  },
  data() {
    return {
      currentRoute: 'home',
      home: {
        name: 'home',
        path: '/',
        text: 'Arknights Data',
        decs: '首页 干员图鉴',
      },
      routes: [
        {
          name: 'enemydata',
          path: '/enemydata',
          text: '关卡数据',
          decs: '敌人数据 行动路线 地图掉落',
        },
        {
          name: 'enemydata',
          path: '/computer',
          text: '经验计算',
          decs: '干员养成消耗计算',
        },
        {
          name: 'items',
          path: '/items',
          text: '材料图鉴',
          decs: '掉率查询 合成配方',
        },
        {
          name: 'customtheme',
          path: '/customtheme',
          text: '家具图鉴',
          decs: '家具套装 散件',
        },
      ],
    }
  },
  computed: {
    ...mapState(['short'])
  },
  methods: {
    go() {
      console.log('go')
      this.$refs.drawer.drawer = false
    }
  }
}
</script>
<style lang="stylus" scoped>
.top-menu {
  display: grid
  grid-template-columns: 150px repeat(auto-fill, 100px)
  background-color: #515151
}

@media screen and (max-width: 600px) {
  .top-menu {
    grid-template-columns: 3fr 1fr
    align-items: center
    color: white
  }

  .router-more {
    text-align: center
  }
}
</style>
