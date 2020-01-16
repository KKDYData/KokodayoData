<template>
  <div class="image-inner" :style="{backgroundImage: `url('${src}')`}" />
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>
