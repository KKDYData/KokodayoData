<template>
  <div>
    <div class="skill-pic-contianer">
      <c-image :src="path" />
    </div>
    <div class="skill-name-wrapper">
      <span :style="{fontSize}">{{ skill.levels[0].name }}</span>
    </div>
  </div>
</template>

<script>
import { path } from '../../utils/listVer'
import CImage from '@/components/Base/CImage'
import { mapState } from 'vuex'
import { getfontSize } from '../../utils'



export default {
  components: {
    CImage
  },
  props: {
    skill: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['short']),
    path() {
      if (!this.skill) return
      const skill = this.skill
      const name = skill.iconId ? skill.iconId : skill.skillId
      return path + 'skills/pics/skill_icon_' + name + '.png'
    },
    fontSize(s) {
      return getfontSize(this.skill.levels[0].name, 34, 16, this.short ? 4 : 6)
    }
  }
}
</script>



<style lang="stylus" scoped>
.skill-pic-contianer {
  width: 100px
  height: 100px
  position: relative
  vertical-align: middle
  display: inline-block
}

.skill-name-wrapper {
  text-align: center
  font-size: 15px
}

@media screen and (max-width: 500px) {
  .skill-pic-contianer {
    width: vw(140)
    height: vw(140)
  }

  .skill-name-wrapper {
    font-size: vw(28)
    word-break: keep-all
  }
}
</style>
