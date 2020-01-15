<template>
  <div id="app">
    <div v-if="isNeedUpdate" class="need-update">
      <p>
        <i class="el-alert__icon el-icon-warning is-big" />
        <span>当前版本落后，后台正在更新，请稍等。如果长时间没提示刷新，请尝试手动刷新以更新</span>
      </p>
      <p>如果遇到更新问题，请进群799872783咨询</p>
    </div>
    <top-menu />
    <transition name="fade" mode="out-in">
      <router-view v-if="ok" class="view" />
      <div v-else>
        <el-input v-model="key" placeholder="填点什么" />
      </div>
    </transition>
    <Footer />
  </div>
</template>
<script>
import TopMenu from '@/components/TopMenu'
import { mapState } from 'vuex'
import { devMode } from './stats'
import Vue from 'vue'
import { Input } from 'element-ui'
Vue.use(Input)
const Footer = () => import(/* webpackChunkName: "EnemyData" */'./pages/Footer')


export default {
  components: {
    Footer,
    TopMenu
  },
  data() {
    return {
      isOrientation: false,
      loading: true,
      ok: devMode !== 'beta' || process.env.NODE_ENV === 'development',
      key: ''
    }
  },
  watch: {
    key(v) {
      if (v === 'kokodayo test') {
        this.ok = true
      }
    }
  },
  computed: {
    ...mapState(['isNeedUpdate'])
  }
}
</script>
<style lang="stylus" scoped>
.need-update {
  color: red
  display: flex
  justify-content: center
  align-items: center
  height: 25vw
  flex-wrap: wrap

  p {
    margin: 2vw

    &:last-child {
      color: grey
    }
  }
}

@media screen and (min-width: 700px) {
  .need-update {
    height: 100px
  }
}
</style>
