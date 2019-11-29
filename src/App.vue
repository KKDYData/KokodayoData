<template>
  <div id="app">
    <div v-if="isNeedUpdate" class="need-update">
      <p>
        <i class="el-alert__icon el-icon-warning is-big" />
        <span>当前版本落后，请刷新页面以获取最新版本</span>
      </p>
      <p>如果遇到更新问题，请进群799872783咨询</p>
    </div>
    <nav-menu />
    <transition name="fade" mode="out-in">
      <router-view class="view" />
    </transition>
    <Footer />
  </div>
</template>
<script>
import NavMenu from '@/components/NavMenu';
import { mapState } from 'vuex';
const Footer = () => import(/* webpackChunkName: "EnemyData" */'./pages/Footer');

export default {
  components: {
    NavMenu,
    Footer
  },
  data() {
    return {
      isOrientation: false,
      loading: true
    };
  },
  computed: {
    ...mapState(['isNeedUpdate'])
  }
};
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
