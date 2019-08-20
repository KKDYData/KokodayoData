<template>
  <div>
    <my-title></my-title>
    <slot></slot>
  </div>
</template>

<script>
import MyTitle from './MyTitle';
export default {
  components: { MyTitle }
};
</script>
