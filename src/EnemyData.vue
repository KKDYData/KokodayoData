<template>
  <div class="home-wrapper">
    <el-drawer ref="chapter-selecter" title="章节选择" :visible.sync="drawer" size="50%">
      <div class="chapter-wrapper">
        <el-tree
          @node-click="choseMap"
          :data="stageList"
          accordion
          :highlight-current="true"
          :auto-expand-parent="true"
        ></el-tree>
      </div>
    </el-drawer>
    <el-alert show-icon type="warning" description>
      <div slot="title">注意</div>
      <p>敌人的突袭数据由这里的数据和地图加成计算得出</p>
    </el-alert>
    <div class="map-wrapper">
      <div class="map-title-part">
        <el-button @click="drawer = true" type="primary">
          {{selectedMap !== '' ? selectedMap : '选择地图'}}
          <i class="el-icon-edit-outline"></i>
        </el-button>
      </div>
      <div v-if="mapCode" class="map-data-container">
        <el-image class="map-pic-contianer" fit="fill" :src="mapPath"></el-image>
        <div class="map-option-container">
          <content-slot
            class="map-option-content"
            :long="true"
            :width="126"
            v-for="([k,v]) in options"
            :key="k"
          >
            <template slot="title">{{k}}</template>
            <template slot="content">{{v}}</template>
          </content-slot>
        </div>
      </div>
      <my-title style="margin: 0" :title="selectedMap === '' ? '所有敌人' : '出现敌人'"></my-title>
      <enemy-data-layout
        ref="layout"
        :short="short"
        v-if="load"
        :data="data"
        :appear-map="appearMap"
      ></enemy-data-layout>
    </div>
    <!-- {{stageList}} -->
  </div>
</template>
<script>
import loadingC from "./components/Loading";
import MyTitle from "./components/MyTitle";
import ContentSlot from "./components/ContentSlot";

import { Alert, Tree, Drawer, Button, Image } from "element-ui";
import Vue from "vue";
Vue.use(Alert);
Vue.use(Button);
Vue.use(Tree);
Vue.use(Drawer);
Vue.use(Image);

import mapPic from "../assets/wk_fly_1.png";

import {
  getEnemyList,
  getEneAppearMap,
  isMoblie,
  getMapData,
  mapOptionsKey,
  path
} from "./components/utils";
import StageList from "./components/stageListPro";

const StageType = {
  main: "主线",
  tr: "TR",
  hard: "困难",
  wk: "日常",
  camp: "剿灭作战",
  guid: "教程",
  sub: "支线"
};

const EnemyDataLayout = () => ({
  component: import(
    /* webpackChunkName: "EnemyDataLayout" */ "./components/EnemyDataLayout"
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  components: {
    EnemyDataLayout,
    MyTitle,
    ContentSlot
  },
  data() {
    return {
      short: false,
      data: [],
      rowData: [],
      load: false,
      appearMap: null,
      drawer: false,
      selectedMap: "",
      selMapData: null,
      mapCode: ""
    };
  },
  computed: {
    mapPath() {
      return this.mapCode
        ? path + "map/pic/" + this.mapCode + "_optimized.png"
        : mapPic;
    },
    options() {
      return !this.selMapData
        ? {}
        : Object.entries(this.selMapData.options)
            .filter(([k, v]) => mapOptionsKey[k])
            .map(([k, v]) => [mapOptionsKey[k], v]);
    },
    stageList() {
      const change = list => {
        return Object.entries(list).map(([key, value]) => {
          if (Array.isArray(value)) {
            return {
              label: StageType[key] || key,
              children: value.map(el => {
                if (el.type && el.data) {
                  return {
                    label: "支线",
                    children: el.data.map(el => {
                      const keys = el.split(" ");
                      return {
                        label: keys.slice(0, 2).join(" "),
                        path: keys[2]
                      };
                    }) //change(el.data)
                  };
                }
                return { label: el };
              })
            };
          } else {
            return { label: StageType[key] || key, children: change(value) };
          }
        });
      };
      return change(StageList)
        .filter(el => el.label !== "st")
        .sort((pre, cur) => (pre.label > cur.label ? -1 : 1));
    },
    direction() {
      return this.short ? "btt" : "rtl";
    }
  },
  created() {
    this.linkStart();
  },
  beforeMount() {
    this.short = isMoblie();
  },
  methods: {
    async choseMap(data, node) {
      const oneToTwo = n => {
        if (n.charAt(0) === "H") n = "0" + n.substring(1);
        return n.length < 2 ? "0" + n : n;
      };
      if (!data.children) {
        const type = {};
        Object.entries(StageType).forEach(([key, text]) => (type[text] = key));

        let parent = "";
        while (node.parent) {
          let label = type[node.data.label] || node.data.label.split(" ")[0];
          const sp = label.split("-");
          if (sp.length > 1) {
            label = oneToTwo(sp[0]) + "-" + oneToTwo(sp[1]);
          }
          if (/\d/.test(label) && label.length === 2) {
            label = "";
          } else if (!/sub/.test(parent)) {
            parent = parent === "" ? label : label + "_" + parent;
          } else if (/sub/.test(parent)) {
            parent = data.path;
            break;
          }
          node = node.parent;
          console.log(parent);
        }
        this.mapCode = parent;
        const mapData = await getMapData("level_" + parent);
        console.log(mapData);

        if (mapData) {
          this.selectedMap = data.label;
          this.selMapData = mapData;
          this.$refs["chapter-selecter"].closeDrawer();
          this.data = Object.fromEntries(
            Object.entries(this.rowData).filter(([key]) =>
              mapData.enemyDbRefs.find(el => el.id === key)
            )
          );
        }
      }
    },
    linkStart() {
      this.getData().then(data => {
        this.data = this.rowData = data[0];
        this.appearMap = data[1];
        this.load = true;
      });
    },
    getData() {
      return Promise.all([getEnemyList(), getEneAppearMap()]);
    }
  }
};
</script>

<style lang="stylus" scoped>
.chapter-wrapper {
  padding-left: 20px;
}

.map-wrapper {
  margin: 20px auto 0;
  max-width: 1200px;
  padding: 20px;
  min-width: 1000px;

  .map-title-part {
    margin: 0 0 20px;
  }

  .map-data-container {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;

    .map-option-container {
      margin-left: 20px;
      max-width: 450px;
      min-width: 385px;
      display: flex;
      flex-wrap: wrap;
      align-content: start;

      .map-option-content {
        margin: 0 20px 20px;
        width: calc(50% - 40px);
      }
    }

    .map-pic-contianer {
      --height: 30vw;
      height: var(--height);
      width: calc(var(--height) * 1.6);
      box-sizing: border-box;
      border: 2px solid #313131;
    }
  }
}

@media screen and (max-width: 700px) {
  .map-wrapper {
    min-width: 360px;
    box-sizing: border-box;

    .map-data-container {
      min-width: auto;

      .map-pic-contianer {
        --height: calc(62.5vw - 25px);
      }

      .map-option-container {
        min-width: auto;
        margin: 20px 0;

        .map-option-content {
          margin: 0 10px 10px 0;
          width: calc(50% - 10px);
        }
      }
    }
  }
}
</style>

