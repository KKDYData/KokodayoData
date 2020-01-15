<template>
  <div class="top-menu">
    <route-item v-for="route in routes" :key="route.path" :data="route" @click="go(route)" />
  </div>
</template>
<script>
import RouteItem from './RoutItem'

export default {
  components: {
    RouteItem
  },
  data() {
    return {
      routes: [
        {
          name: 'home',
          path: '/',
          text: 'Arknights Data',
          isHere: true
        },
        {
          name: 'enemydata',
          path: '/enemydata',
          text: '关卡数据',
          isHere: false
        },
        {
          name: 'enemydata',
          path: '/computer',
          text: '经验计算',
          isHere: false
        },
        {
          name: 'customtheme',
          path: '/customtheme',
          text: '家具',
          isHere: false
        },
        {
          name: 'items',
          path: '/items',
          text: '材料',
          isHere: false
        }
      ],
    }
  },
  methods: {
    go(route) {
      this.routes.forEach(r => this.$set(r, 'isHere', false))
      console.log('go')
      this.$set(route, 'isHere', true)
      this.$router.push(route.path)
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
</style>
