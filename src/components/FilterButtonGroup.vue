<template>
  <div class="filter-wrapper" style>
    <div class="filter">
      <div>
        <el-button
          :size="short? 'mini' :'medium'"
          @click="choseAll"
          :type="allChosed ? 'info': 'success'"
          round
        >{{label}}</el-button>
      </div>
      <div class="filter-button-wrapper">
        <el-button
          v-for="key in lists"
          :key="key.value"
          @click="filter(key)"
          :round="short"
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
  data: function() {
    return {
      lists: this.filters.map(obj => {
        obj.chosed = false;
        return obj;
      })
    };
  },
  computed: {
    allChosed() {
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
      console.log(key.chosed);
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
      if (this.single && this.allChosed) {
        this.$emit('filter', this.lists);
        this.lists.forEach(key => this.$set(key, 'chosed', true));

        return;
      }
      if (!this.allChosed) {
        this.lists.forEach(key => this.$set(key, 'chosed', false));
        this.$emit('filter', []);
      }
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
</style>
