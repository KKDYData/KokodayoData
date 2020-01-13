<template>
  <div v-loading="lock">
    <map-predefined-list
      class="predefine-list-contianer"
      title="预设道具"
      :list="data.tokenInsts"
      :status-to-ch-fc="statusToChFc"
    />
    <map-predefined-list
      class="predefine-list-contianer"
      title="预下场角色"
      :list="data.characterInsts"
    />
    <map-predefined-list
      class="predefine-list-contianer"
      title="预设角色卡"
      :list="data.characterCards"
      :show-position="false"
    />
    <map-predefined-list
      class="predefine-list-contianer"
      title="道具卡"
      :list="data.tokenCards"
      :runes-data="runesData"
      :show-position="false"
    />
  </div>
</template>

<script>
import { getProfilePath, UA } from '../../utils'
import { statusToChToken } from '../../utils/string'
import MapPredefinedList from './MapPreDefinedList'

import { mapState } from 'vuex'

export default {
  components: {
    MapPredefinedList
  },
  props: {
    preData: {
      required: true
    },
    data: {
      required: true
    },
    runesData: {
      default: Object
    }
  },
  data() {
    return {
      tokenInsts: null,
      tokenCards: null,
      characterInsts: null,
      characterCards: null,
      statusToChFc: statusToChToken,
      skills: null,
      detailsOpen: false,
      isHover:
        process.env.NODE_ENV === 'development' || UA.isMobliePad ||
          this.short ? 'click' : 'hover',
      lock: false
    }
  },
  computed: {
    ...mapState(['short']),
  },
  methods: {
    getSrc(key) {
      return getProfilePath(key)
    },
  }

}
</script>

<style lang="stylus" scoped>
.predefine-list-contianer + .predefine-list-contianer {
  margin-top: 30px
}
</style>
