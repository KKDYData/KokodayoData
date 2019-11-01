<template>
  <div>
    <div :style="titleStyle" class="status-details-title">
      <slot name="title"></slot>
    </div>
    <div :style="contentStyle" class="status-details-value">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: Number,
    long: Boolean,
    noWrap: Boolean
  },
  computed: {
    titleStyle() {
      const res = {};
      if (this.width) {
        res.width = this.width + 'px';
      }
      if (this.noWrap) {
        res.display = 'inline-block';
      }
      return res;
    },
    contentStyle() {
      return this.long ? { width: 'auto' } : {};
    }
  }
};
</script>


<style lang="stylus" scoped>
.status-details-title {
  color: white;
  background-color: #313131;
  border-radius: 2px;
  width: calc(80px + 0.5vw);
  text-align: center;
  display: inline-block;
  font-size: 100%;
  line-height: 100%;
  padding: 2px 0;
  box-shadow: 1px 1px 2px 1px #0000005e;
}

.status-details-value {
  display: inline-block;
}

@media screen and (max-width: 900px) {
  .status-details-title {
    display: block;
  }

  .status-details-value {
    width: calc(80px + 0.5vw);
    text-align: center;
  }
}
</style>
