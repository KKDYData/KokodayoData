<template>
  <div>
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
      console.log(name);
      this.value = item.name;
    }
  }

};
</script>
