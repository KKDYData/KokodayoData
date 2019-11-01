<template>
  <div class="feedback-info" style="display: flex">
    <span
      :style="{width: width + 'px', 'min-width': width + 'px' ,'margin-right': '10px'}"
    >{{title}}</span>
    <div class="feedback-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    width: {
      type: Number,
      default: 40
    }
  }
};
</script>


<style lang="stylus" scoped>
.feedback-info {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.feedback-content {
  flex-grow: 1;
}
</style>


