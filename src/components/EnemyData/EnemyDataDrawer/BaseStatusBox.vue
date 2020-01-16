<template>
  <div class="enemy-status-abc-container">
    <div>
      <div class="enemy-status-abc-title" style="margin: 0">
        <c-image style="width: 13px; height:13px " :src="smallPicPath + 'nj_optimized.png'" />
        <div class="enemy-status-abc-title-text">{{ type }}</div>
      </div>
    </div>
    <h1>{{ level }}</h1>
  </div>
</template>
<script>
import { path } from '@/utils/listVer'
import CImage from '@/components/base/CImage'

export default {
  components: {
    CImage
  },
  props: {
    level: {
      type: String,
      default: '?'
    },
    type: {
      type: String,
      default: '?'
    }
  },
  data() {
    return {
      smallPicPath: path + 'others/',
    }
  }
}
</script>
<style lang="stylus" scoped>
.enemy-status-abc-container {
  border: 4px solid rgb(82, 82, 82)
  width: 65px
  height: 48px
  color: rgb(82, 82, 82)
}

.enemy-status-abc-container + .enemy-status-abc-container {
  margin-left: 5px
}

.enemy-status-abc-container h1 {
  margin: 0
  text-align: center
  font-size: 2.5em
  line-height: 0.8em
}

.enemy-status-abc-title {
  display: flex
  align-items: center
  font-size: 0
}

.enemy-status-abc-title-text {
  display: inline-block
  text-align: center
  flex-grow: 1
  font-size: 12px
}
</style>
