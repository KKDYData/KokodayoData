<template>
  <view class="index">
    <view class="text-gray-900 text-2xl">hello KOKODAYO</view>
    <NumberDisplay/>
    <NumberSubmit />
  </view>
</template>

<script>
import NumberDisplay from '../../components/NumberDisplay.vue'
import NumberSubmit from '../../components/NumberSubmit.vue'

export default {
  name: 'Index',
  components: {
    NumberDisplay,
    NumberSubmit
  }
}
</script>

<style>
.index {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
