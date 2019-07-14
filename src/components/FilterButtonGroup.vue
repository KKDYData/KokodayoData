<template>
  <div class="filter-wrapper" style>
    <div class="filter">
      <div>
        <el-button
          :size="short? 'mini' :'medium'"
          @click="choseAll"
          :type="allChosed ? 'info': 'warning'"
          round
        >{{label}}</el-button>
      </div>
      <div class="filter-button-wrapper">
        <el-button
          v-for="key in lists"
          :key="key.value"
          @click="filter(key)"
          :size="short? 'mini' :'medium'"
          :type="key.chosed ? 'primary': ''"
          class="filter-button"
        >{{key.text}}</el-button>
      </div>
    </div>
    <!-- style="margin-left: 0" -->
  </div>
</template>


<script>
import Vue from 'vue';
import { Button } from 'element-ui';
Vue.use(Button);

export default {
  props: ['filters', 'short', 'label', 'single'],
  data() {
    return {
      lists: this.filters.map(obj => {
        if (!obj.chosed) obj.chosed = false;
        return obj;
      })
    };
  },
  watch: {
    filters: function(newFilter, old) {
      const res = newFilter.map(obj => {
        if (!obj.chosed) obj.chosed = false;
        return obj;
      });
      // console.log(res);
      // console.log(this);
      this.lists = res;
    }
  },
  computed: {
    // lists() {
    //   return this.filters.map(obj => {
    //     if (!obj.chosed) obj.chosed = false;
    //     return obj;
    //   });
    // },
    allChosed() {
      if (!this.lists) return;
      const l = this.lists.filter(key => key.chosed).length;
      if (this.single) {
        return l === 0;
      }
      return l === this.filters.length || l === 0;
    }
  },
  methods: {
    filter(key) {
      this.$set(key, 'chosed', !key.chosed);
      const fArr = this.lists.filter(key => key.chosed);
      if (!this.single) {
        if (fArr.length === 0) {
          // this.$emit("reset");
          this.$emit('filter', []);

          return;
        }
        if (fArr.length === this.lists.length) {
          this.lists.forEach(key => this.$set(key, 'chosed', false));
          this.$emit('filter', []);

          return;
        }
      }
      this.$emit('filter', fArr);
    },
    choseAll() {
      console.log('全选');

      if (this.single && this.allChosed) {
        this.lists.forEach(key => this.$set(key, 'chosed', true));
        this.$emit('filter', this.lists);

        return;
      }
      this.lists.forEach(key => this.$set(key, 'chosed', false));
      this.$emit('filter', []);
    }
  }
};
</script>

<style scoped>
.filter-wrapper {
  margin-bottom: 10px;
}

.filter {
  display: flex;
  margin-left: 10px;
  text-align: center;
}
.filter-button-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.filter-button {
  margin-bottom: 5px;
  margin-left: 10px;
}
.filter-button-wrapper > .el-button--primary {
  background-color: rgb(49, 49, 49);
  border-color: rgb(49, 49, 49);
}
</style>
