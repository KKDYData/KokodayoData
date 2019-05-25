<template>
  <div class="container">
    <div class="tableWrapper">
      <div class="background">
        <p>选择星级</p>
        <el-select v-model="num" v-on:change="change">
          <el-option v-for="i in [3, 4, 5]" :value="i" :key="i">{{i}}</el-option>
        </el-select>
        <div style="text-align:right; margin-top:10px">
          <el-button @click="submit" round size="medium" type="primary">确认</el-button>
        </div>
      </div>
    </div>
    <div class="masking"></div>
  </div>
</template>

<script>
import { Select, Option, Button } from "element-ui";
import Vue from "vue";
export default {
  props: {
    star: Number()
  },

  data() {
    return {
      // data: []
      num: this.star
    };
  },
  mounted() {
    console.log(this.star);
  },
  methods: {
    change() {
      console.log(this.num);
      this.$emit("change", this.num);
    },
    submit() {
      console.log(this.num);

      this.$emit("change", this.num);
    }
  }
};
</script>
<style lang="stylus" scoped>
p {
  margin: 0 auto 10px;
  color: #009688;
}

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
  top: calc(50% - 80px);

  .background {
    // text-align: center;
    background-color: white;
    padding: 20px;

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
