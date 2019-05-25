<template>
  <div class="container">
    <div class="tableWrapper">
      <div class="background">
        <h4>当前列表， 共有{{lists.length}}</h4>
        <el-table :data="lists" :height="tableHeight">
          <el-table-column prop="name" label="名字" width="100"></el-table-column>
          <el-table-column prop="time" label="更新时间" width="160"></el-table-column>
          <el-table-column label="操作" width="70px">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="closebutton">
          <el-button @click="close">关闭</el-button>
        </div>
      </div>
    </div>
    <div class="masking"></div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import Vue from "vue";
import { getHeroPic, getHeroData, sort } from "../utils";
Vue.use(Table);
Vue.use(TableColumn);
export default {
  props: {
    data: Array
  },
  data() {
    return {
      // data: []
      tableHeight: this.calTableHeight()
      // top: this.calTop()
    };
  },

  computed: {
    // top() {
    //   return `calc(50% + ${this.tableHeight / 2})`;
    // },
    lists() {
      // console.log(this.data);
      const data = [...this.data];
      // console.log(this.data);
      const format = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false
      });
      const arr = data.map(element => {
        const obj = {};
        obj.date = element.time ? new Date(element.time) : "";
        if (obj.date) obj.time = format.format(obj.date);
        // console.log(temp.get);
        obj.name = element.name;
        obj.url = element.url;
        // console.log(obj.time);
        return obj;
      });

      console.log(arr.length);
      try {
        let newArr = sort(arr, (a, b) => {
          // console.log(a);

          return a.date > b.date;
        });
        newArr.forEach(item => {
          console.log(item.name + " " + item.time);
        });
        console.log(newArr.length);
        return newArr;
      } catch (error) {
        debugger;
        console.log(error);
      }
    }
  },
  methods: {
    calTop() {
      console.log(this);
      // debugger;
      const n = document.querySelector(".background");
      console.log(n);
      debugger;
      const h = window.innerHeight;
      return `${(h - n) / 2}px`;
    },
    calTableHeight() {
      const ch = window.innerHeight;
      return ch > 400 ? ch * 0.6 : ch * 0.4;
    },
    handleClick(row) {
      console.log(row.name);
      getHeroData(row.url)
        .then(data => {
          console.log(data);
          this.$emit("editServerData", data);
        })
        .then(() => {
          getHeroPic(row.name).then(lists => {
            this.$emit("insertImgs", lists);
            this.$emit("close");
          });
        });
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="stylus" scoped>
.container {
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  // opacity: 0.5;
  // background: #000;
}

.tableWrapper {
  // width: 500px;
  // max-width: 500px;
  z-index: 20001;
  position: relative;
  // box-sizing: border-box;
  // border: 1px solid white;
  height: 100%;
  padding: 20px;
  overflow: hidden;
  margin: 0 auto;

  .background {
    background-color: white;
    padding: 0 20px;

    .closebutton {
      padding: 20px;
      position: relative;
      display: flex;
      justify-content: center;
    }
  }

  h4 {
    padding-top: 30px;
  }
}

.masking {
  opacity: 0.5;
  background: #000;
  width: 100%;
  height: 100%;
  position: fixed;
  // z-index: 2000;
  left: 0;
  top: 0;
  z-index: 200;
}
</style>
