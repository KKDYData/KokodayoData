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
import { getProfileList } from '../utils/fetch'
import { Alert, link } from 'element-ui'
import Vue from 'vue'
Vue.use(link)
Vue.use(Alert)

import loadingC from '../components/base/Loading'
import { devMode } from '../stats'
import MyTitle from '@/components/base/MyTitle'
import SlideTitle from '@/components/base/MySlideTilte'
import { localStore } from '@/localStore'
import { mapState } from 'vuex'


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
      store: localStore()
    }
  },
  computed: {
    ...mapState(['short'])
  },
  created() {
  },
  mounted() {
    this.linkStart()
    this.store.getItem('home-activity-state').then((state) => {
      this.activityState = state === null ? true : state
      console.log('act ', state)
    })

  },
  methods: {
    linkStart() {
      this.getData().then(data => {
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
    },
    getData() {
      return getProfileList().then(source => {
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
    margin: 20px 10px 0
  }

  &-activity {
    margin: 20px 40px 0 10px
  }

  &-title {
    max-width: 1000px
  }
}

@media screen and (max-width: 700px) {
  .home {
    &-wrapper {
      display: grid
      grid-template-columns: 1fr
      margin-top: vw(20)
    }

    &-base {
      margin: vw(20) vw(10)
    }

    &-activity {
      margin: vw(20) vw(10)
    }
  }
}
</style>


