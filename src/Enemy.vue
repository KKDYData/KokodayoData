<template>
  <div>
    <enemy-data></enemy-data>
  </div>
</template>

<script>
// import EnemyData from './components/EnemyData';
import loadingC from './components/Loading';

const EnemyData = () => ({
  component: import(
    /* webpackChunkName: "EnemyData" */ './components/EnemyData'
  ),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});

export default {
  components: {
    EnemyData
  },
  data() {
    return {};
  }
};
</script>
