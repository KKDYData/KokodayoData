<template>
  <div>
    <div v-if="short || disabled" class="click" @click="openDrawer">
      <slot name="reference" />
    </div>
    <div v-if="!disabled">
      <h-drawer
        v-if="short"
        :visible.sync="drawer"
        width="80%"
        :size="size"
        :direction="direction"
        :show-close="true"
        :append-to-body="true"
        :with-header="!noTitle"
        :custom-class="customClass"
        @close="closeHandler"
        @opened="openHandler"
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
        :visible-arrow="true"
        popper-class="item-popover-class"
        :placement="placement"
        :width="width"
        :trigger="isHover"
        :open-delay="500"
        :title="title"
        :disabled="disabled"
        @show="openHandler"
        @hide="closeHandler"
      >
        <div slot="reference" class="click" @click="openDrawer">
          <slot name="reference" />
        </div>
        <div v-if="drawer">
          <slot />
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Popover } from 'element-ui'
import HDrawer from '@/components/base/Drawer'
import Vue from 'vue'
Vue.use(Popover)



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
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '75%'
    },
    noTitle: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'btt'
    },
    customClass: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
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
  watch: {
    short(v) {
      console.log('short change', v)
    }
  },
  methods: {
    openHandler() {
      this.$emit('opened')
    },
    openDrawer() {
      if (this.disabled) return
      this.drawer = true
    },
    closeHandler() {
      this.$emit('closed')
    }
  }
}
</script>

