<template>
  <div class="status-details-wrapper">
    <div
      v-for="({key, value}) in changedStatus"
      :key="key"
      :style="compact ? 'margin: 5px 0': ''"
      class="status-details-container"
    >
      <content-slot :long="!short" :width="short ? 80 : 100">
        <div slot="title">
          <span>{{ key }}</span>
        </div>
        <div slot="content">
          <span v-html="value" />
          <span v-if="key === '攻击间隔' || key === '再部署'">s</span>
        </div>
      </content-slot>
    </div>
  </div>
</template>

<script>
import { statusToChChar } from '../../utils/string'
import ContentSlot from '@/components/base/ContentSlot'
import { mapState } from 'vuex'

export default {
  components: {
    ContentSlot
  },
  props: {
    status: {
      type: Object,
      required: true
    },
    statusToChFc: {
      type: Function,
      default: statusToChChar
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['short']),
    changedStatus() {
      return Object.entries(this.status).map(([k, value]) => {
        const ch = this.statusToCh(k)
        if (!ch) return
        else return { key: ch, value }
      }).filter(el => el)
    }
  },
  methods: {
    statusToCh(key) {
      return this.statusToChFc ? this.statusToChFc(key) : statusToChChar(key)
    },
  }
}
</script>

<style lang="stylus" scoped>
.status-details-wrapper {
  display: flex
  flex-wrap: wrap
  justify-content: center
  overflow: hidden
}

.status-details-container {
  width: 48%
  max-width: 220px
  margin: 10px 0
}

@media screen and (max-width: 900px) {
  .status-details-wrapper {
    height: auto
  }

  .status-details-container {
    margin: 5px 0
  }
}

@media screen and (max-width: 500px) {
  .status-details-wrapper {
    justify-content: space-between
  }
}
</style>
