<template>
  <div>
    <div v-if="short" @click="openDrawer">
      <slot name="reference" />
    </div>
    <h-drawer
      v-if="short"
      :visible.sync="drawer"
      width="80%"
      size="75%"
      direction="btt"
      :show-close="false"
      :append-to-body="true"
      @close="closeHandler"
    >
      <div slot="title">
        <slot name="title" />
      </div>
      <div style="padding: 0 20px 20px">
        <slot />
      </div>
    </h-drawer>
    <el-popover
      v-else
      :visible-arrow="false"
      popper-class="item-popover-class"
      placement="top"
      :width="!short? 350 : 250"
      :trigger="isHover"
      :open-delay="500"
      :title="title"
      :disabled="disable"
    >
      <div slot="reference">
        <slot name="reference" />
      </div>
      <slot />
    </el-popover>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Popover } from 'element-ui'
import HDrawer from '@/components/base/Drawer'
import Vue from 'vue'
Vue.use(Popover)


let prevOverflow = ''

export default {
  components: {
    HDrawer
  },
  props: {
    width: {
      type: Number,
      default: 0
    },
    isHover: {
      type: String,
      default: 'click',
    },
    title: {
      type: String,
      default: ''
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapState(['short']),
  },
  methods: {
    openDrawer() {
      console.log('open')
      this.drawer = true
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // setTimeout(() => {
      // }, 1000)
    },
    closeHandler() {
      document.body.style.overflow = prevOverflow
    }
  }
}
</script>

