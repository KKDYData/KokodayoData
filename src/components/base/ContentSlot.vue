<template>
  <div class="base-content" :class="{long, 'long-content': longContent}">
    <div :style="titleStyle" class="base-content-title">
      <slot name="title" />
    </div>
    <div class="base-content-value">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    width: {
      type: Number,
      default: null
    },
    long: Boolean,
    noWrap: Boolean,
    longContent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['short']),
    titleStyle() {
      const res = {}
      if (this.width) {
        res.width = this.short ? `${this.width / 750 * 200}vw` : this.width + 'px'
      }
      if (this.noWrap) {
        res.display = 'inline-block'
      }
      return res
    },
  }
}
</script>


<style lang="stylus" scoped>
.base-content {
  &-title {
    color: white
    background-color: #313131
    text-align: center
    //display: inline-block
    font-size: 100%
    line-height: 100%
    border-radius: 2px
    width: calc(80px + 0.5vw)
    padding: 2px 0
    box-shadow: 1px 1px 2px 1px #00005e
  }

  &-value {
    display: inline-block
    padding-top: 10px
  }
}

.long {
  .base-content {
    &-title {
      width: auto
      padding: 2px 10px
      margin: 5px 5px 5px 0
      display: inline-block
    }

    &-value {
      display: inline-block
      width: auto
      text-align: left
      padding: 0
    }
  }
}

.long-content {
  .base-content {
    &-value {
      display: block
      width: 100%
      text-align: left
    }
  }
}

@media screen and (max-width: 900px) {
  .base-content {
    &-title {
      display: block
    }

    &-value {
      width: calc(80px + 0.5vw)
      text-align: center
      padding-top: 5px
    }
  }
}

@media screen and (max-width: 500px) {
  .base-content {
    font-size: vw(30)

    &-title {
      display: block
      border-radius: vw(4)
      width: vw(160)
      padding: vw(4) 0
      box-shadow: vw(2) vw(2) vw(4) vw(2) #00005e
    }

    &-value {
      width: vw(160)
      padding-top: vw(10)
    }
  }
}
</style>
