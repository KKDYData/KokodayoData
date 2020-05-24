<template>
  <div class="home-wrapper">
    <div class="home-activity">
      <slide-title
        v-if="!short || activityState !== 'unset'"
        :init="activityState"
        class="home-title"
        :control="short"
        title="最近活动"
        @open="handleActivity"
      >
        <activity />
      </slide-title>
    </div>
    <div class="home-base">
      <my-title class="home-title" title="干员列表" />
      <transition name="fade" mode="out-in">
        <home-layout v-if="load" :profile-list="data" :token-list="token" />
      </transition>
    </div>
  </div>
</template>
<script>
import { Alert, link } from 'element-ui'
import Vue from 'vue'
Vue.use(link)
Vue.use(Alert)

import loadingC from '../components/Base/Loading'
import { devMode } from '../stats'
import MyTitle from '@/components/Base/MyTitle'
import SlideTitle from '@/components/Base/MySlideTilte'
import { localStore } from '@/localStore'
import { mapState } from 'vuex'
import { Assets } from '../Api'


const HomeLayout = () => ({
  component: import(/* webpackChunkName: "HomeLayout" */ '../components/homeLayout'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
})

const Activity = () => ({
  component: import(/* webpackChunkName: "HomeLayout" */ '../components/Activity'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
})

export default {
  components: {
    HomeLayout,
    MyTitle,
    Activity,
    SlideTitle
  },
  data() {
    return {
      data: [],
      token: [],
      load: false,
      isBeta: devMode === 'beta',
      activityState: 'unset',
      store: localStore(),
      innerWidth: window.innerWidth
    }
  },
  computed: {
    ...mapState(['short']),
    ...mapState({
      info: state => state.Base.info
    })
  },
  watch: {
    info(v) {
      this.linkStart()

    }
  },
  created() {
    this.linkStart()
  },
  mounted() {
    this.store.getItem('home-activity-state').then((state) => {
      this.activityState = state === null ? true : state
      console.log('act ', state)
    })
  },
  methods: {
    linkStart() {
      if (this.info?.agent?.char) {
        this.getData(this.info.agent.char.key).then(data => {
          const agent = [],
            token = []
          data.forEach(el => {
            if (el.class !== 'TOKEN') agent.push(el)
            else token.push(el)
          })
          this.data = agent
          this.token = token
          this.load = true
        })
      }
    },
    getData(key) {
      return Assets.getProfileList(key).then(source => {
        source.forEach((el, index, arr) => {
          el.index = index
          el.tagHit = 0
          el.showTags = false
        })
        return source.reverse()
      })
    },
    handleActivity(el) {
      console.log(el, el.value)
      this.store.setItem('home-activity-state', el.value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-wrapper {
  display: grid
  grid-template-columns: 350px 1fr
}

.home {
  &-base {
    margin: 20px 0 0
  }

  &-activity {
    margin: 20px 40px 0 10px
  }

  &-title {
    max-width: 1000px
  }
}

@media screen and (max-width: 1000px) {
  .home {
    &-wrapper {
      display: grid
      grid-template-columns: 1fr
      margin-top: vw(20)
    }

    &-base {
      margin: vw(20) vw(10)
      // 不给width swiper 的宽算不对
      max-width: vw(750 - 20)
    }

    &-activity {
      margin: vw(20) vw(10)
    }
  }
}
</style>


