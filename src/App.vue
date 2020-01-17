<template>
  <div id="app">
    <div v-if="isNeedUpdate" class="need-update">
      <p>
        <i class="el-alert__icon el-icon-warning is-big" />
        <span>当前版本落后，请尝试点击下面的更新（刷新）按钮</span>
      </p>
      <div>
        <el-button size="mini" @click="update">更新</el-button>
      </div>
      <div>
        <el-button size="mini" @click="refresh">如果多次更新无效，请点击这里3次</el-button>
      </div>
      <p>如果点完上面的都不行，那就清除浏览器数据</p>
    </div>
    <top-menu />
    <transition name="fade" mode="out-in">
      <router-view v-if="ok" class="view" />
      <div v-else>
        <!-- <el-input v-model="key" placeholder="填点什么" /> -->
      </div>
    </transition>
    <Footer />
  </div>
</template>
<script>
import TopMenu from '@/components/TopMenu'
import { mapState } from 'vuex'
import { devMode } from './stats'
// import Vue from 'vue'
// import { Input } from 'element-ui'
// Vue.use(Input)
const Footer = () => import(/* webpackChunkName: "EnemyData" */'./pages/Footer')
const forceUnregister = 200116
import localforage from 'localforage'
import { Button } from 'element-ui'
import Vue from 'vue'
Vue.use(Button)

export default {
  components: {
    Footer,
    TopMenu
  },
  data() {
    return {
      isOrientation: false,
      loading: true,
      ok: 1 || devMode !== 'beta' || process.env.NODE_ENV === 'development',
      key: '',
      status: '',
      unregistHit: 0
    }
  },
  computed: {
    ...mapState(['isNeedUpdate'])
  },
  watch: {
    key(v) {
      if (v === 'kokodayo test') {
        this.ok = true
      }
    }
  },
  mounted() {
    if (!navigator.serviceWorker) return
    const store = localforage.createInstance({
      name: 'testDB'
    })
    store.getItem('forceUnregister').then(date => {
      if (!date || date < forceUnregister) {
        console.log(`强制注销serverWorker, 当前记录：${date}, 目标记录${forceUnregister}`)
        navigator.serviceWorker.getRegistrations()
          .then((registrations) => {
            registrations.forEach(el => el.unregister())
            store.setItem('forceUnregister', forceUnregister)
          })
      }
    })
  },
  methods: {
    update() {
      window.location.reload()
    },
    refresh() {
      if (++this.unregistHit < 3) return
      console.log('强制注销serverWorker')
      const store = localforage.createInstance({
        name: 'testDB'
      })
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
          registrations.forEach(el => el.unregister())
          store.setItem('forceUnregister', forceUnregister)
          window.location.reload()
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
.need-update {
  color: red
  display: flex
  justify-content: center
  align-items: center
  flex-wrap: wrap

  p {
    width: 100vw
    text-align: center

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
