<template>
  <div class="agent-card-pic cbg" :style="{width, height: width, backgroundImage}">
    <!-- <div style="height:100%;width:100%" :style="{backgroundImage: `url('${src}')`}" /> -->
  </div>
</template>

<script>

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: ''
    }
  },
  computed: {
    backgroundImage() {
      return `url('${this.src}')`
    }
  }
}
</script>

<style lang="stylus" scoped>
.agent-card-pic {
  display: inline-block
  position: relative
  vertical-align: middle
  width: 150px
  height: 150px
}

@media screen and (max-width: 700px) {
  .agent-card-pic {
    --imgW: calc(80px + 5vw)
    height: var(--imgW)
    width: var(--imgW)
    min-width: var(--imgW)
  }
}
</style>
