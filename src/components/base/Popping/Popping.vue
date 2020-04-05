<template>
  <div>
    <div v-if="short || disabled" class="click" @click="openDrawer">
      <slot name="reference" />
    </div>
    <div v-if="!disabled">
      <h-drawer
        v-if="short"
        :show-drawer.sync="drawer"
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
        <slot slot="title" name="title" />
        <div style="padding: 0 20px 20px">
          <slot />
        </div>
      </h-drawer>
      <h-popover
        v-else
        :visible-arrow="true"
        popper-class="item-popover-class"
        :placement="placement"
        :width="width"
        :trigger="trigger"
        :title="title"
        :disabled="disabled"
        :arrow="arrow"
        @show="openHandler"
        @hide="closeHandler"
      >
        <slot slot="reference" class="click" name="reference" @click="openDrawer" />
        <slot v-if="drawer" />
      </h-popover>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import HDrawer from '@/components/base/Drawer'
import HPopover from '@/components/base/Popover'


export default {
  components: {
    HDrawer,
    HPopover
  },
  props: {
    width: {
      type: Number,
      default: 0
    },
    trigger: {
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
    },
    arrow: {
      type: Boolean,
      default: true
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
      this.openDrawer()
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

