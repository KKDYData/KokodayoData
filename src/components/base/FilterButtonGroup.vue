<template>
  <div class="filter-wrapper" style>
    <div class="filter">
      <div class="filter-button-wrapper">
        <el-button
          :size="short? 'mini' :'medium'"
          :type="allChosed ? 'info': 'danger'"
          :class="!allChosed && closeAble ? 'filter-button filter-button-closeable' : 'filter-button'"
          :disabled="disabled"
          @click="choseAll"
        >
          {{ label }}
          <transition name="fade">
            <span v-if="!allChosed && closeAble" class="filter-close-icon">
              <i class="el-icon-close" />
            </span>
          </transition>
        </el-button>
        <el-button
          v-for="key in lists"
          :key="key.value"
          :disabled="disabled"
          :size="short? 'mini' :'medium'"
          :type="key.chosed ? 'primary': ''"
          :plain="!key.chosed"
          class="filter-button"
          @click="filter(key)"
        >{{ key.text }}</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'
import { Button } from 'element-ui'
import { mapState } from 'vuex'
Vue.use(Button)

export default {
  props: {
    filters: {
      default() {
        return []
      },
      type: Array
    },
    label: {
      default: '',
      type: String
    },
    single: Boolean,
    default: {
      default: '',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    singleClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const de = this.default || ''
    return {
      lists: this.filters.map(obj => {
        if (obj.value !== de) obj.chosed = false
        else obj.chosed = true
        return obj
      })
    }
  },

  computed: {
    ...mapState(['short']),
    closeAble() {
      return this.singleClose || !this.single
    },
    allChosed() {
      if (!this.lists) return
      const l = this.lists.filter(key => key.chosed).length
      if (this.single) {
        return l === 0
      }
      return l === this.filters.length || l === 0
    }
  },
  watch: {
    filters: function (newFilter, old) {
      const res = newFilter.map(obj => {
        if (!obj.chosed) obj.chosed = false
        return obj
      })
      this.lists = res
    }
  },
  methods: {
    filter(key) {
      let fArr
      if (!this.single) {
        this.$set(key, 'chosed', !key.chosed)
        fArr = this.lists.filter(key => key.chosed)
        if (fArr.length === 0) {
          this.$emit('filter', [])
          return
        }
        if (fArr.length === this.lists.length) {
          this.lists.forEach(key => this.$set(key, 'chosed', false))
          this.$emit('filter', [])
          return
        }
        this.$emit('filter', fArr)
      } else {
        if (this.lists.length === 1 || !key.chosed)
          this.$set(key, 'chosed', !key.chosed)

        this.lists.forEach(other => {
          if (key !== other) this.$set(other, 'chosed', false)
        })
        fArr = this.lists.filter(key => key.chosed)
        this.$emit('filter', fArr)
      }
    },
    choseAll() {
      console.log('全选')
      if (this.single && !this.singleClose) return

      if (this.single && this.allChosed) {
        this.lists.forEach(key => this.$set(key, 'chosed', true))
        this.$emit('filter', this.lists)

        return
      }
      this.lists.forEach(key => this.$set(key, 'chosed', false))
      this.$emit('filter', [])
    }
  }
}
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
    min-width: vw(112)
    margin-left: vw(10)
  }

  .filter-button-closeable {
    min-width: vw(136)
    margin-left: vw(10)
  }

  .filter-button-wrapper {
    margin-left: 0
  }
}
</style>
