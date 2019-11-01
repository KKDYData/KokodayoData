<template>
  <div class="filter-wrapper" style>
    <div class="filter">
      <div class="filter-button-wrapper">
        <el-button
          :size="short? 'mini' :'medium'"
          @click="choseAll"
          :type="allChosed ? 'info': 'danger'"
          :class="!allChosed  && !single ? 'filter-button filter-button-closeable' : 'filter-button'"
          :disabled="disabled"
        >
          {{label}}
          <transition name="fade">
            <span v-if="!allChosed && !single" class="filter-close-icon">
              <i class="el-icon-close"></i>
            </span>
          </transition>
        </el-button>
        <el-button
          :disabled="disabled"
          v-for="key in lists"
          :key="key.value"
          @click="filter(key)"
          :size="short? 'mini' :'medium'"
          :type="key.chosed ? 'primary': ''"
          :plain="!key.chosed"
          class="filter-button"
        >{{key.text}}</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from 'vue';
import { Button } from 'element-ui';
import { mapState } from 'vuex';
Vue.use(Button);

export default {
  props: {
    filters: Array,
    label: String,
    single: Boolean,
    default: String,
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    const de = this.default || '';
    return {
      lists: this.filters.map(obj => {
        if (obj.value !== de) obj.chosed = false;
        else obj.chosed = true;
        return obj;
      })
    };
  },
  watch: {
    filters: function (newFilter, old) {
      const res = newFilter.map(obj => {
        if (!obj.chosed) obj.chosed = false;
        return obj;
      });
      this.lists = res;
    }
  },
  computed: {
    ...mapState(['short']),
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
      let fArr;
      if (!this.single) {
        this.$set(key, 'chosed', !key.chosed);
        fArr = this.lists.filter(key => key.chosed);
        if (fArr.length === 0) {
          this.$emit('filter', []);
          return;
        }
        if (fArr.length === this.lists.length) {
          this.lists.forEach(key => this.$set(key, 'chosed', false));
          this.$emit('filter', []);
          return;
        }
        this.$emit('filter', fArr);
      } else {
        if (this.lists.length === 1 || !key.chosed)
          this.$set(key, 'chosed', !key.chosed);

        this.lists.forEach(other => {
          if (key !== other) this.$set(other, 'chosed', false);
        });
        fArr = this.lists.filter(key => key.chosed);
        this.$emit('filter', fArr);
      }
    },
    choseAll() {
      console.log('全选');
      if (this.single) return;

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

<style lang="stylus" scoped>
.filter-wrapper {
  margin-bottom: 10px
  padding-right: 10px
}

.filter {
  display: flex
  margin-left: 10px
}

.filter-button-wrapper {
  display: flex
  flex-wrap: wrap
  margin-left: -10px
}

.filter-close-icon {
  position: absolute
  left: 8px
}

.filter-button {
  margin-bottom: 5px
  margin-top: 5px
  margin-left: 10px
  min-width: 50px
  transition: all 0.3s ease
  box-sizing: border-box
  min-width: 70px
  position: relative

  &.is-plain:focus {
    border-color: #dcdfe6
  }
}

.filter-button-closeable {
  min-width: 80px
}

@media screen and (max-width: 500px) {
  .filter-button {
    min-width: 56px
  }

  .filter-button-closeable {
    min-width: 68px
  }

  .filter-button-wrapper {
    margin-left: 0
  }
}
</style>
