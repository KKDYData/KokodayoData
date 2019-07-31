<template>
  <div class="group-container-title">{{title}}</div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="stylus" scoped>
.group-container-title {
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: #414141;
  padding-left: 1vw;
  box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.15);
}
</style>
