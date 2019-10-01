<template>
  <span :style="'color:' + color + ';background: #303131'">
    <slot></slot>
  </span>
</template>

<script>
// 新加的，慢慢覆盖
export default {
  props: {
    color: {
      required: true
    }
  }
};
</script>
