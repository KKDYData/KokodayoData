<template>
  <div class="muti-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  componentName: 'AccordionPanel',
  data() {
    return {
      activeName: this.value
    };
  },
  watch: {
    value(v) {
      this.activeName = v;
    }
  },
  provide() {
    return {
      mutiSlide: this
    };
  },
  created() {
    this.$on('item-click', this.handleItemClick);
  },
  methods: {
    handleItemClick(item) {
      this.activeName = item.name;
    }
  }

};
</script>

<style lang="stylus" scoped>
.muti-wrapper {
  display: flex
  flex-flow: column
  height: 100%
}
</style>
