<template>
  <div>
    <enemy-data ref="layout" />
  </div>
</template>

<script>
import loadingC from '../components/base/Loading'

const EnemyData = () => ({
  component: import(/* webpackChunkName: "EnemyData" */ '../components/EnemyData'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
})

export default {
  components: {
    EnemyData,
  },
  data() {
    return {}
  },
  beforeRouteUpdate(to, from, next) {
    //todo
    console.log('update')
    this.$refs.layout.linkStart(to.params.map)
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log('leave')
    //todo
    if (/enemydata(\/)?$/.test(to.path)) {
      this.$refs.layout.clearMap()
    } else if (/enemydata\/.+$/.test(to.path)) {
      this.$refs.layout.linkStart(to.params.map)
    }
    next()
  }
}
</script>
