<template>
  <div class="InputPage-body">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row type="flex">
          <el-col :span="8">
            <div class="grid-content header">
              <div></div>
              <h2>数据录入</h2>
            </div>
          </el-col>
          <el-col :span="16" class="explain-box">
            <div class="gird-content header" @click="showDetail">
              <div id="profile" width="100%"></div>
              <div id="detail-pic" v-if="isShoDetail" @click.stop="showDetail">
                <div>
                  <p>技能升级列表现在可以删除、添加，和拖动排序，点击排序按钮就就可以进行操作</p>
                  <p>3.18,17点，更新了被动识别职业-盗贼的识别逻辑</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row id="data-input-container">
      <el-col :span="24">
        <div class="grid-content" style="min-height: 800px" v-if="loadStart">
          <!-- 录入数据模板 -->
          <transition name="el-fade-in" appear>
            <DataInput :scanData="arr" ref="datainput" v-on:load="dataInputLoad"></DataInput>
          </transition>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import scanArr from './components/scanArr';
import loadingC from './components/loading';
import { Col, Row, Loading } from 'element-ui';
import { getHeroData, getHeroPic } from './components/utils';

Vue.use(Col);
Vue.use(Row);
Vue.use(Loading);

const DataInput = () => ({
  component: import(/* webpackChunkName: "dataInput" */ './components/dataInput'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  name: 'app',
  components: {
    DataInput
  },
  data() {
    return {
      arr: scanArr,
      dataoffsetTop: 0,
      dataoffsetLeft: 0,
      loadStart: false,
      isShoDetail: false
    };
  },
  mounted() {
    this.loadStart = true;
  },
  watch: {
    $route(to, from) {
      console.log(to + ' || ' + from);
    }
  },
  methods: {
    showDetail() {
      this.isShoDetail = !this.isShoDetail;
      console.log('//');
    },
    dataInputLoad() {
      console.log('???');
      // let ref = this.$refs.datainput;
      // ref.offsetTop = this.$el.querySelector("#data-input-container").offsetTop;
      // ref.offsetLeft = this.$el.querySelector(
      //   "#data-input-container"
      // ).offsetLeft;
      // window.addEventListener("resize", () => {
      //   ref.offsetTop = this.$el.querySelector(
      //     "#data-input-container"
      //   ).offsetTop;
      //   ref.offsetLeft = this.$el.querySelector(
      //     "#data-input-container"
      //   ).offsetLeft;
      // });
      if (this.$route.params) {
        this.$route.params.name &&
          this.$vlf
            .getItem('dataUrl')
            .then(url => {
              if (url) return getHeroData(url);
              else return Promise.reject('no url');
            })
            .then(data => this.$refs.datainput.editServerData(data))
            .then(() => {
              return getHeroPic(this.$route.params.name).then(lists => {
                this.$refs.datainput.insertServerImgs(lists);
              });
            })
            .catch(err => console.error(err));
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.InputPage-body {
  max-width: 1003px;
  // box-sizing: border-box;
  margin: 0 auto;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  overflow: hidden;
}

.gird-content .header {
  padding-left: 20px;
}

.explain-box {
  border-left: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 0px;
  padding-left: 10px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

#detail-pic {
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;

  div {
    margin: 0 auto;
    max-width: 500px;

    img {
      width: 100%;
    }
  }
}

#profile {
  // position: absolute;
  background: rgba(0, 0, 0, 0.3);
  width: 20vw;
  height: 20vw;
  max-height: 220px;
  max-width: 220px;
  top: 150px;
  right: 20px;
  overflow: hidden;
}
</style>