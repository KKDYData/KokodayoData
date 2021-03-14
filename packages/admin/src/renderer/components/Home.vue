<template>
  <p>
    For a guide and recipes on how to configure / customize this project,
    <br />check out the
    <a
      href="https://github.com/cawa-93/vite-electron-builder"
      rel="noopener"
      target="_blank"
    >vite-electron-builder documentation</a>.
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>
  <p class="my-20 text-2xl text-red-300">KOKODAYO DATA</p>

  <hr />
  <ElButton @click="count++">count is: {{ count }}</ElButton>
  <p>
    Edit
    <code>renderer/components/Home.vue</code> to test hot module replacement.
  </p>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElButton } from 'element-plus'

export default defineComponent({
  components: {
    ElButton
  },
  name: 'HelloWorld',
  setup() {
    const count = ref(0)

    return { count }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
