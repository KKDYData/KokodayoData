<template>
  <div class="home-wrapper" style>
    <nav-menu></nav-menu>
    <el-alert show-icon="" type='error' 
    title="服务器流量异常，暂时先关闭几天"
    description="被DDOS攻击中!访问异常请及时联系我,qq736693980。"></el-alert>
    <home-layout v-if="load" :profileList="data"></home-layout>
  </div>
</template>
<script>
import { getProfileList } from './components/utils';
import NavMenu from './NavMenu';
import { Alert, MessageBox } from "element-ui";
import Vue from 'vue'
import loadingC from "./components/loading";

const HomeLayout = () => ({
  component: import(/* webpackChunkName: "HomeLayout" */'./components/homeLayout'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
})

Vue.use(Alert)

export default {
  components: {
    'home-layout': HomeLayout,
    'nav-menu': NavMenu
  },
  data() {
    return {
      short: false,
      data: [],
      load: false
    };
  },
  mounted() {
    const isOpen = localStorage.getItem('isOpen')
    if(!isOpen){

      MessageBox('访问异常请及时联系我,qq736693980。', '被DDOS攻击中')
      .then(() => {
        
        this.linkStart()
      })
      localStorage.setItem('isOpen', true)
    }else{
        this.linkStart()

    }
  },
  methods: {
    linkStart(){
      this.getData().then(data => {
      this.data = data;
      this.load = true;
    });
    },
    getData() {
      return getProfileList().then(source => {
        source.forEach((el, index) => {
          el.index = index;
          el.tagHit = 0;
        });
        return source.filter(el => el.position).reverse();
      });
    }
  }
};
</script>


