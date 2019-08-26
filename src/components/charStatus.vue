<template>
  <div class="status-details-wrapper">
    <div
      :style="compact ? 'margin: 5px 0': ''"
      v-for="({key, value}) in changedStatus"
      :key="key"
      class="status-details-container"
    >
      <div>
        <div class="status-details-title">
          <span>{{key}}</span>
        </div>
        <div class="status-details-value">
          <span v-html="value"></span>
          <span v-if="key === '攻击间隔' || key === '再部署'">s</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statusToChChar } from '../utils/string';
export default {
  props: {
    status: {
      required: true
    },
    statusToChFc: {
      default: statusToChChar
    },
    compact: {
      default: false
    }
  },
  computed: {
    changedStatus() {
      return Object.entries(this.status).map(([k, value]) => {
        const ch = this.statusToCh(k);
        if (!ch) return;
        else return { key: ch, value };
      }).filter(el => el);
    }
  },
  methods: {
    statusToCh(key) {
      return this.statusToChFc ? this.statusToChFc(key) : statusToChChar(key);
    },
  }
};
</script>

<style lang="stylus" scoped>
.status-details-wrapper {
  display: flex
  flex-wrap: wrap
}

.status-details-container {
  flex-grow: 0.5
  width: 50%
  margin: 10px 0
}

.status-details-value {
  display: inline-block
}

.status-details-title {
  color: white
  background-color: #313131
  border-radius: 2px
  width: calc(80px + 0.5vw)
  text-align: center
  display: inline-block
  font-size: 100%
  line-height: 100%
  padding: 2px 0
  box-shadow: 1px 1px 2px 1px #0000005e
}

@media screen and (max-width: 900px) {
  .status-details-wrapper {
    height: auto
  }

  .status-details-title {
    display: block
  }

  .status-details-value {
    width: calc(80px + 0.5vw)
    text-align: center
  }
}
</style>
