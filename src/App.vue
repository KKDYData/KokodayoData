<template>
  <div id="app" class="app">
    <div v-if="isNeedUpdate" class="need-update">
      <p>
        <i class="el-alert__icon el-icon-warning is-big" />
        <span>当前版本落后，请尝试点击下面的更新（刷新）按钮</span>
      </p>
      <div>
        <el-button size="mini" @click="update">更新</el-button>
      </div>
      <div>
        <el-button size="mini" @click="refresh"
          >如果多次更新无效，请点击这里3次</el-button
        >
      </div>
      <p>如果点完上面的都不行，那就清除浏览器数据</p>
    </div>
    <top-menu />
    <my-share />
    <router-view class="view" />
    <Footer />
  </div>
</template>
<script>
import TopMenu from "@/components/TopMenu";

import { mapState } from "vuex";
import { devMode } from "./stats";
// import Vue from 'vue'

const Footer = () =>
  import(/* webpackChunkName: "Footer" */ "./components/Footer");
const MyShare = () =>
  import(/* webpackChunkName: "MyShare" */ "@/components/Share");

const forceUnregister = 200116;
import localforage from "localforage";
import { Button } from "element-ui";
import Vue from "vue";
Vue.use(Button);

console.log("当前版本日期", process.env.VERSION);

export default {
  components: {
    Footer,
    TopMenu,
    MyShare,
  },
  data() {
    return {
      isOrientation: false,
      loading: true,
      dev: devMode === "beta" || process.env.NODE_ENV === "development",
      status: "",
      unregistHit: 0,
    };
  },
  computed: {
    ...mapState({
      info: (state) => state.Base.info,
    }),
    isNeedUpdate() {
      if (!this.info) return false;
      return this.info.base?.web.key > process.env.VERSION && !this.dev;
    },
  },
  mounted() {
    if (!navigator.serviceWorker) return;
    const store = localforage.createInstance({
      name: "testDB",
    });
    store.getItem("forceUnregister").then((date) => {
      if (!date || date < forceUnregister) {
        console.log(
          `强制注销serverWorker, 当前记录：${date}, 目标记录${forceUnregister}`
        );
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((el) => el.unregister());
          store.setItem("forceUnregister", forceUnregister);
        });
      }
    });
  },
  methods: {
    update() {
      window.location.reload();
    },
    refresh() {
      if (++this.unregistHit < 3) return;
      console.log("强制注销serverWorker");
      const store = localforage.createInstance({
        name: "testDB",
      });
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((el) => el.unregister());
        store.setItem("forceUnregister", forceUnregister);
        window.location.reload();
      });
    },
  },
};
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
